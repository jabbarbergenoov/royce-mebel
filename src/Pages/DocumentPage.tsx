import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Search,
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  Download,
  Upload,
  Loader2,
  Eye,
  FolderOpen,
  FileCheck,
  FileX,
} from "lucide-react";
import { axiosInstance } from "#/lib/api";

interface Document {
  id: number;
  name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    file_path: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Пагинация
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Загрузка документов
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/documents", {
        params: {
          name: searchName || undefined,
          limit,
          offset,
        },
      });
      setDocuments(data.documents || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Ошибка загрузки документов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [limit, offset, searchName]);

  // Поиск с debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchName(searchInput);
      setOffset(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Загрузка файла на сервер
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      const filePath = response.data.url;
      setFormData((prev) => ({ ...prev, file_path: filePath }));

      console.log("Файл загружен:", response.data);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      alert("Ошибка загрузки файла");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка размера (максимум 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert("Размер файла не должен превышать 20MB");
        return;
      }
      handleFileUpload(file);
    }
  };

  // Создание документа
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.file_path) {
      alert("Заполните все поля");
      return;
    }

    try {
      await axiosInstance.post("/documents", {
        name: formData.name,
        file_path: formData.file_path,
      });
      await fetchDocuments();
      closeModal();
    } catch (error) {
      console.error("Ошибка создания:", error);
      //@ts-ignore
      alert(error.response?.data?.message || "Ошибка создания документа");
    }
  };

  // Обновление документа
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.file_path) {
      alert("Заполните все поля");
      return;
    }

    try {
      await axiosInstance.patch(`/documents/${editingDocument?.id}`, {
        name: formData.name,
        file_path: formData.file_path,
      });
      await fetchDocuments();
      closeModal();
    } catch (error) {
      console.error("Ошибка обновления:", error);
      //@ts-ignore
      alert(error.response?.data?.message || "Ошибка обновления документа");
    }
  };

  // Удаление документа
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Удалить документ "${name}"?`)) {
      try {
        await axiosInstance.delete(`/documents/${id}`);
        await fetchDocuments();
      } catch (error) {
        console.error("Ошибка удаления:", error);
        //@ts-ignore
        alert(error.response?.data?.message || "Ошибка удаления документа");
      }
    }
  };

  // Скачивание документа
  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await axiosInstance.get(filePath, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "document");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      alert("Ошибка скачивания файла");
    }
  };

  // Открыть модалку для создания/редактирования
  const openModal = (document: Document | null = null) => {
    if (document) {
      setEditingDocument(document);
      setFormData({
        name: document.name,
        file_path: document.file_path,
      });
    } else {
      setEditingDocument(null);
      setFormData({
        name: "",
        file_path: "",
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = (document: Document) => {
    setViewingDocument(document);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDocument(null);
    setFormData({
      name: "",
      file_path: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Полный URL файла
  const getFileUrl = (filePath: string) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    const baseURL = import.meta.env.VITE_API_URL;
    return `${baseURL}${filePath}`;
  };

  // Получить расширение файла
  const getFileExtension = (fileName: string) => {
    return fileName?.split(".").pop()?.toLowerCase() || "";
  };

  // Иконка для типа файла
  const getFileIcon = (filePath: string) => {
    const ext = getFileExtension(filePath);
    switch (ext) {
      case "pdf":
        return <FileText size={48} style={{ color: "#c62828" }} />;
      case "doc":
      case "docx":
        return <FileText size={48} style={{ color: "#1565c0" }} />;
      case "xls":
      case "xlsx":
        return <FileText size={48} style={{ color: "#2e7d32" }} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileText size={48} style={{ color: "#e65100" }} />;
      default:
        return <FileText size={48} style={{ color: "#706233" }} />;
    }
  };

  return (
    <div style={{ backgroundColor: "#FAE7C9" }} className="min-h-screen pt-24">
      {/* Hero секция */}
      <section className="py-16 px-6" style={{ backgroundColor: "#E1C78F" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <FolderOpen
              size={48}
              style={{ color: "#706233" }}
              className="mx-auto mb-4"
            />
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: "700",
                color: "#706233",
                marginBottom: "1rem",
              }}
            >
              Документы
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#706233",
                lineHeight: "1.6",
                opacity: 0.9,
              }}
            >
              Управление документами и файлами
            </p>
          </motion.div>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Панель управления */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
          >
            {/* Поиск */}
            <div className="relative w-full md:w-96">
              <Search
                size={20}
                style={{ color: "#706233" }}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
              />
              <input
                type="text"
                placeholder="Поиск документов..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl outline-none"
                style={{
                  backgroundColor: "#E1C78F",
                  color: "#706233",
                  border: "1px solid transparent",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                onBlur={(e) => (e.target.style.borderColor = "transparent")}
              />
            </div>

            {/* Кнопка добавления */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl"
              style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
            >
              <Plus size={20} />
              Добавить документ
            </motion.button>
          </motion.div>

          {/* Список документов */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div
                className="w-10 h-10 rounded-full animate-spin border-4"
                style={{
                  borderColor: "#706233",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : documents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-3xl"
              style={{ backgroundColor: "#E1C78F" }}
            >
              <FileX
                size={48}
                style={{ color: "#706233", opacity: 0.5 }}
                className="mx-auto mb-4"
              />
              <p style={{ color: "#706233", opacity: 0.7 }}>
                Документы не найдены
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {documents.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: "#E1C78F" }}
                >
                  <div className="flex items-start md:items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(document.file_path)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-semibold truncate cursor-pointer hover:underline"
                        style={{ color: "#706233" }}
                        onClick={() => openViewModal(document)}
                      >
                        {document.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm mt-1">
                        <span style={{ color: "#706233", opacity: 0.6 }}>
                          <File size={14} className="inline mr-1" />
                          {document.file_path?.split("/").pop() || "Нет файла"}
                        </span>
                        <span style={{ color: "#706233", opacity: 0.4 }}>
                          •
                        </span>
                        <span style={{ color: "#706233", opacity: 0.5 }}>
                          ID: {document.id}
                        </span>
                        <span style={{ color: "#706233", opacity: 0.4 }}>
                          •
                        </span>
                        <span style={{ color: "#706233", opacity: 0.5 }}>
                          {new Date(document.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleDownload(document.file_path, document.name)
                      }
                      className="p-2 rounded-lg flex items-center gap-1 transition-colors hover:opacity-70"
                      style={{ backgroundColor: "#B0926A", color: "#FAE7C9" }}
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline text-sm">Скачать</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openViewModal(document)}
                      className="p-2 rounded-lg flex items-center gap-1 transition-colors hover:opacity-70"
                      style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline text-sm">Просмотр</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(document)}
                      className="p-2 rounded-lg transition-colors hover:opacity-70"
                      style={{ backgroundColor: "#B0926A", color: "#FAE7C9" }}
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(document.id, document.name)}
                      className="p-2 rounded-lg transition-colors hover:opacity-70"
                      style={{ backgroundColor: "#c62828", color: "#FAE7C9" }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="p-2 rounded-lg disabled:opacity-40"
                style={{ backgroundColor: "#E1C78F", color: "#706233" }}
              >
                <ChevronLeft size={20} />
              </motion.button>

              <span style={{ color: "#706233" }}>
                Страница {currentPage} из {totalPages}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
                className="p-2 rounded-lg disabled:opacity-40"
                style={{ backgroundColor: "#E1C78F", color: "#706233" }}
              >
                <ChevronRight size={20} />
              </motion.button>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setOffset(0);
                }}
                className="ml-4 px-3 py-2 rounded-lg outline-none"
                style={{ backgroundColor: "#E1C78F", color: "#706233" }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Модальное окно для создания/редактирования */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: "#FAE7C9" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  style={{
                    color: "#706233",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                  }}
                >
                  {editingDocument
                    ? "Редактировать документ"
                    : "Добавить документ"}
                </h2>
                <button onClick={closeModal}>
                  <X size={24} style={{ color: "#706233" }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    style={{ color: "#706233" }}
                    className="block text-sm font-medium mb-2"
                  >
                    Название <span style={{ color: "#c62828" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Введите название документа"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "#E1C78F",
                      color: "#706233",
                      border: "1px solid transparent",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                  />
                </div>

                <div>
                  <label
                    style={{ color: "#706233" }}
                    className="block text-sm font-medium mb-2"
                  >
                    Файл <span style={{ color: "#c62828" }}>*</span>
                  </label>

                  {/* Информация о загруженном файле */}
                  {formData.file_path && (
                    <div
                      className="mb-3 p-3 rounded-xl flex items-center justify-between"
                      style={{ backgroundColor: "#E1C78F" }}
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck size={20} style={{ color: "#2e7d32" }} />
                        <span
                          className="text-sm truncate"
                          style={{ color: "#706233" }}
                        >
                          {formData.file_path.split("/").pop()}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setFormData({ ...formData, file_path: "" })
                        }
                        className="p-1 rounded-full hover:bg-red-100 transition"
                      >
                        <X size={16} style={{ color: "#c62828" }} />
                      </button>
                    </div>
                  )}

                  {/* Upload кнопка */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        backgroundColor: "#E1C78F",
                        color: "#706233",
                        border: "2px dashed #B0926A",
                      }}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span>Загрузка {uploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          <span>
                            {formData.file_path
                              ? "Заменить файл"
                              : "Загрузить файл"}
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* URL файла (опционально) */}
                  <div className="mt-2">
                    <p
                      className="text-xs"
                      style={{ color: "#706233", opacity: 0.5 }}
                    >
                      Или введите путь вручную:
                    </p>
                    <input
                      type="text"
                      value={formData.file_path}
                      onChange={(e) =>
                        setFormData({ ...formData, file_path: e.target.value })
                      }
                      placeholder="/files/document.pdf"
                      className="w-full mt-1 px-4 py-2 rounded-xl outline-none text-sm"
                      style={{
                        backgroundColor: "#E1C78F",
                        color: "#706233",
                        border: "1px solid transparent",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "transparent")
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl"
                  style={{ backgroundColor: "#E1C78F", color: "#706233" }}
                >
                  Отмена
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={editingDocument ? handleUpdate : handleCreate}
                  disabled={isUploading}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#706233",
                    color: "#FAE7C9",
                    opacity: isUploading ? 0.5 : 1,
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  <Save size={18} />
                  {editingDocument ? "Сохранить" : "Добавить"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно просмотра документа */}
      <AnimatePresence>
        {isViewModalOpen && viewingDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden"
              style={{ backgroundColor: "#FAE7C9" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: "#E1C78F" }}
                    >
                      {getFileIcon(viewingDocument.file_path)}
                    </div>
                    <div>
                      <h2
                        style={{
                          color: "#706233",
                          fontSize: "1.5rem",
                          fontWeight: "700",
                        }}
                      >
                        {viewingDocument.name}
                      </h2>
                      <p
                        style={{
                          color: "#706233",
                          opacity: 0.6,
                          fontSize: "0.9rem",
                        }}
                      >
                        {viewingDocument.file_path?.split("/").pop() ||
                          "Нет файла"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsViewModalOpen(false)}>
                    <X size={24} style={{ color: "#706233" }} />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#E1C78F" }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "#706233", opacity: 0.6 }}
                    >
                      <span className="font-medium">ID:</span>{" "}
                      {viewingDocument.id}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#E1C78F" }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "#706233", opacity: 0.6 }}
                    >
                      <span className="font-medium">Путь к файлу:</span>{" "}
                      {viewingDocument.file_path}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#E1C78F" }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "#706233", opacity: 0.6 }}
                    >
                      <span className="font-medium">Создан:</span>{" "}
                      {new Date(viewingDocument.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "#E1C78F" }}
                  >
                    <p
                      className="text-sm"
                      style={{ color: "#706233", opacity: 0.6 }}
                    >
                      <span className="font-medium">Обновлен:</span>{" "}
                      {new Date(viewingDocument.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleDownload(
                        viewingDocument.file_path,
                        viewingDocument.name,
                      );
                    }}
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                  >
                    <Download size={18} />
                    Скачать файл
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openModal(viewingDocument);
                    }}
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#B0926A", color: "#FAE7C9" }}
                  >
                    <Edit2 size={18} />
                    Редактировать
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
