import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Edit2, Trash2, X, Save, Search, 
  ChevronLeft, ChevronRight, Image, Package, 
  Eye, Upload, Loader2 
} from "lucide-react";
import { axiosInstance } from "#/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  image_name: string;
  catalog_id: number;
  catalog?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface Catalog {
  id: number;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  image_name: string;
  catalog_id: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image_name: "",
    catalog_id: ""
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

  // Загрузка товаров
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/products", {
        params: {
          name: searchName || undefined,
          limit,
          offset
        }
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка категорий для выбора
  const fetchCatalogs = async () => {
    try {
      const { data } = await axiosInstance.get("/catalogs", {
        params: { limit: 100, offset: 0 }
      });
      setCatalogs(data.catalogs || []);
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCatalogs();
  }, [limit, offset, searchName]);

  // Поиск с debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchName(searchInput);
      setOffset(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Загрузка изображения на сервер
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
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      
      // response.data.url - это путь к файлу, например "/files/xxx.jpg"
      const imageUrl = response.data.url;
      setFormData(prev => ({ ...prev, image_name: imageUrl }));
      
      console.log("Файл загружен:", response.data);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      alert("Ошибка загрузки изображения");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }
      // Проверка размера (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер изображения не должен превышать 5MB");
        return;
      }
      handleFileUpload(file);
    }
  };

  // Создание товара
  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.catalog_id) {
      alert("Заполните обязательные поля (название и категория)");
      return;
    }
    
    try {
      await axiosInstance.post("/products", {
        name: formData.name,
        description: formData.description,
        image_name: formData.image_name,
        catalog_id: Number(formData.catalog_id)
      });
      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Ошибка создания:", error);
      //@ts-ignore
      alert(error.response?.data?.message || "Ошибка создания товара");
    }
  };

  // Обновление товара
  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.catalog_id) {
      alert("Заполните обязательные поля (название и категория)");
      return;
    }
    
    try {
      await axiosInstance.patch(`/products/${editingProduct?.id}`, {
        name: formData.name,
        description: formData.description,
        image_name: formData.image_name,
        catalog_id: Number(formData.catalog_id)
      });
      await fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Ошибка обновления:", error);
      //@ts-ignore
      alert(error.response?.data?.message || "Ошибка обновления товара");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Удалить товар "${name}"?`)) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        await fetchProducts();
      } catch (error) {
        console.error("Ошибка удаления:", error);
        //@ts-ignore
        alert(error.response?.data?.message || "Ошибка удаления товара");
      }
    }
  };

  // Открыть модалку для создания/редактирования
  const openModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        image_name: product.image_name || "",
        catalog_id: product.catalog_id.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        image_name: "",
        catalog_id: ""
      });
    }
    setIsModalOpen(true);
  };

  const openViewModal = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      image_name: "",
      catalog_id: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const getCatalogName = (catalogId: number) => {
    const catalog = catalogs.find(c => c.id === catalogId);
    return catalog ? catalog.name : "Без категории";
  };

  // Полный URL изображения
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    const baseURL = import.meta.env.VITE_API_URL;
    return `${baseURL}${imagePath}`;
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
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: "700",
                color: "#706233",
                marginBottom: "1rem"
              }}
            >
              Товары
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#706233",
                lineHeight: "1.6",
                opacity: 0.9
              }}
            >
              Управление товарами и продукцией
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
                placeholder="Поиск товаров по названию..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl outline-none"
                style={{
                  backgroundColor: "#E1C78F",
                  color: "#706233",
                  border: "1px solid transparent"
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
              Добавить товар
            </motion.button>
          </motion.div>

          {/* Список товаров */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full animate-spin border-4" style={{ borderColor: "#706233", borderTopColor: "transparent" }} />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-3xl"
              style={{ backgroundColor: "#E1C78F" }}
            >
              <Package size={48} style={{ color: "#706233", opacity: 0.5 }} className="mx-auto mb-4" />
              <p style={{ color: "#706233", opacity: 0.7 }}>Товары не найдены</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: "#E1C78F" }}
                >
                  {/* Картинка */}
                  <div className="h-48 flex items-center justify-center relative group" style={{ backgroundColor: "#B0926A" }}>
                    {product.image_name ? (
                      <img 
                        src={getImageUrl(product.image_name) || product.image_name}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image size={48} style={{ color: "#FAE7C9", opacity: 0.6 }} />
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 style={{ color: "#706233", fontSize: "1.2rem", fontWeight: "600" }} className="mb-2">
                      {product.name}
                    </h3>
                    <p style={{ color: "#706233", opacity: 0.7, fontSize: "0.9rem" }} className="mb-2 line-clamp-2">
                      {product.description || "Нет описания"}
                    </p>
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: "#FAE7C9", color: "#706233" }}>
                        {product.catalog?.name || getCatalogName(product.catalog_id)}
                      </span>
                    </div>
                    <p style={{ color: "#706233", opacity: 0.5, fontSize: "0.7rem" }} className="mb-4">
                      ID: {product.id} | Создан: {new Date(product.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openViewModal(product)}
                        className="flex-1 py-2 rounded-lg flex items-center justify-center gap-1"
                        style={{ backgroundColor: "#B0926A", color: "#FAE7C9" }}
                      >
                        <Eye size={16} />
                        Просмотр
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(product)}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#c62828", color: "#FAE7C9" }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
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
                <h2 style={{ color: "#706233", fontSize: "1.5rem", fontWeight: "700" }}>
                  {editingProduct ? "Редактировать товар" : "Добавить товар"}
                </h2>
                <button onClick={closeModal}>
                  <X size={24} style={{ color: "#706233" }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={{ color: "#706233" }} className="block text-sm font-medium mb-2">
                    Название <span style={{ color: "#c62828" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Введите название товара"
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "#E1C78F",
                      color: "#706233",
                      border: "1px solid transparent"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                  />
                </div>

                <div>
                  <label style={{ color: "#706233" }} className="block text-sm font-medium mb-2">
                    Категория <span style={{ color: "#c62828" }}>*</span>
                  </label>
                  <select
                    value={formData.catalog_id}
                    onChange={(e) => setFormData({ ...formData, catalog_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl outline-none"
                    style={{
                      backgroundColor: "#E1C78F",
                      color: "#706233",
                      border: "1px solid transparent"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                  >
                    <option value="">Выберите категорию</option>
                    {catalogs.map((catalog) => (
                      <option key={catalog.id} value={catalog.id}>
                        {catalog.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ color: "#706233" }} className="block text-sm font-medium mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Введите описание товара"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                    style={{
                      backgroundColor: "#E1C78F",
                      color: "#706233",
                      border: "1px solid transparent"
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                  />
                </div>

                <div>
                  <label style={{ color: "#706233" }} className="block text-sm font-medium mb-2">
                    Изображение
                  </label>
                  
                  {/* Превью изображения */}
                  {formData.image_name && (
                    <div className="mb-3 relative group">
                      <img 
                        src={getImageUrl(formData.image_name) || formData.image_name}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => setFormData({ ...formData, image_name: "" })}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload кнопка */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
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
                        border: "2px dashed #B0926A"
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
                          <span>{formData.image_name ? "Заменить изображение" : "Загрузить изображение"}</span>
                        </>
                      )}
                    </label>
                  </div>
                  
                  {/* URL изображения (опционально) */}
                  <div className="mt-2">
                    <p className="text-xs" style={{ color: "#706233", opacity: 0.5 }}>
                      Или введите URL вручную:
                    </p>
                    <input
                      type="text"
                      value={formData.image_name}
                      onChange={(e) => setFormData({ ...formData, image_name: e.target.value })}
                      placeholder="/files/example.jpg"
                      className="w-full mt-1 px-4 py-2 rounded-xl outline-none text-sm"
                      style={{
                        backgroundColor: "#E1C78F",
                        color: "#706233",
                        border: "1px solid transparent"
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                      onBlur={(e) => (e.target.style.borderColor = "transparent")}
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
                  onClick={editingProduct ? handleUpdate : handleCreate}
                  disabled={isUploading}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "#706233",
                    color: "#FAE7C9",
                    opacity: isUploading ? 0.5 : 1,
                    cursor: isUploading ? "not-allowed" : "pointer"
                  }}
                >
                  <Save size={18} />
                  {editingProduct ? "Сохранить" : "Добавить"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно просмотра товара */}
      <AnimatePresence>
        {isViewModalOpen && viewingProduct && (
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
              <div className="h-64 flex items-center justify-center" style={{ backgroundColor: "#B0926A" }}>
                {viewingProduct.image_name ? (
                  <img 
                    src={getImageUrl(viewingProduct.image_name) || viewingProduct.image_name}
                    alt={viewingProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image size={64} style={{ color: "#FAE7C9", opacity: 0.6 }} />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 style={{ color: "#706233", fontSize: "1.8rem", fontWeight: "700" }}>
                    {viewingProduct.name}
                  </h2>
                  <button onClick={() => setIsViewModalOpen(false)}>
                    <X size={24} style={{ color: "#706233" }} />
                  </button>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: "#E1C78F", color: "#706233" }}>
                    {viewingProduct.catalog?.name || getCatalogName(viewingProduct.catalog_id)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h3 style={{ color: "#706233", fontWeight: "600" }} className="mb-2">Описание</h3>
                  <p style={{ color: "#706233", opacity: 0.8, lineHeight: "1.6" }}>
                    {viewingProduct.description || "Нет описания"}
                  </p>
                </div>
                
                <div className="pt-4 border-t" style={{ borderColor: "#E1C78F" }}>
                  <p style={{ color: "#706233", opacity: 0.5, fontSize: "0.8rem" }}>
                    ID: {viewingProduct.id}<br />
                    Создан: {new Date(viewingProduct.created_at).toLocaleString()}<br />
                    Обновлен: {new Date(viewingProduct.updated_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsViewModalOpen(false)}
                    className="flex-1 py-3 rounded-xl"
                    style={{ backgroundColor: "#E1C78F", color: "#706233" }}
                  >
                    Закрыть
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openModal(viewingProduct);
                    }}
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
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