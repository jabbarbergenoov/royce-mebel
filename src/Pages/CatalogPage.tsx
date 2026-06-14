import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, X, Save, Search, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { axiosInstance } from "#/lib/api";

export default function CatalogPage() {
  const [catalogs, setCatalogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  
  // Пагинация
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  
  // Загрузка каталогов
  const fetchCatalogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/catalogs`, {
        params: {
          name: searchName || undefined,
          limit,
          offset
        }
      });
      setCatalogs(data.catalogs || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  // Создание каталога
  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    
    try {
      await axiosInstance.post(`/catalogs`, { name: formData.name });
      await fetchCatalogs();
      closeModal();
    } catch (error) {
      console.error("Ошибка создания:", error);
    }
  };

  // Обновление каталога
  const handleUpdate = async () => {
    if (!formData.name.trim() || !editingCatalog) return;
    
    try {
      await axiosInstance.patch(`/catalogs/${editingCatalog.id}`, { name: formData.name });
      await fetchCatalogs();
      closeModal();
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Удалить категорию "${name}"?`)) {
      try {
        await axiosInstance.delete(`/catalogs/${id}`);
        await fetchCatalogs();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const openModal = (catalog = null) => {
    if (catalog) {
      setEditingCatalog(catalog);
      setFormData({ name: catalog.name });
    } else {
      setEditingCatalog(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCatalog(null);
    setFormData({ name: "" });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

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
              Каталог
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#706233",
                lineHeight: "1.6",
                opacity: 0.9
              }}
            >
              Управление категориями товаров
            </p>
          </motion.div>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Панель управления */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
          >
            {/* Поиск */}
            <div className="relative w-full md:w-80">
              <Search
                size={20}
                style={{ color: "#706233" }}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
              />
              <input
                type="text"
                placeholder="Поиск по названию..."
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
              Добавить категорию
            </motion.button>
          </motion.div>

          {/* Список категорий */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full animate-spin border-4" style={{ borderColor: "#706233", borderTopColor: "transparent" }} />
            </div>
          ) : catalogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-3xl"
              style={{ backgroundColor: "#E1C78F" }}
            >
              <p style={{ color: "#706233", opacity: 0.7 }}>Категории не найдены</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4"
            >
              {catalogs.map((catalog, index) => (
                <motion.div
                  key={catalog.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-5 rounded-2xl"
                  style={{ backgroundColor: "#E1C78F" }}
                >
                  <div>
                    <h3 style={{ color: "#706233", fontSize: "1.2rem", fontWeight: "600" }}>
                      {catalog.name}
                    </h3>
                    <p style={{ color: "#706233", opacity: 0.6, fontSize: "0.8rem" }}>
                      ID: {catalog.id}
                    </p>
                    <p style={{ color: "#706233", opacity: 0.5, fontSize: "0.75rem" }}>
                      Создан: {new Date(catalog.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openModal(catalog)}
                      className="p-2 rounded-lg transition-colors hover:opacity-70"
                      style={{ backgroundColor: "#B0926A", color: "#FAE7C9" }}
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(catalog.id, catalog.name)}
                      className="p-2 rounded-lg transition-colors hover:opacity-70"
                      style={{ backgroundColor: "#c62828", color: "#FAE7C9" }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
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

      {/* Модальное окно */}
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
              className="w-full max-w-md rounded-3xl p-6"
              style={{ backgroundColor: "#FAE7C9" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 style={{ color: "#706233", fontSize: "1.5rem", fontWeight: "700" }}>
                  {editingCatalog ? "Редактировать" : "Добавить категорию"}
                </h2>
                <button onClick={closeModal}>
                  <X size={24} style={{ color: "#706233" }} />
                </button>
              </div>

              <div className="mb-6">
                <label style={{ color: "#706233" }} className="block text-sm font-medium mb-2">
                  Название категории
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="Введите название"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{
                    backgroundColor: "#E1C78F",
                    color: "#706233",
                    border: "1px solid transparent"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#B0926A")}
                  onBlur={(e) => (e.target.style.borderColor = "transparent")}
                  onKeyPress={(e) => e.key === "Enter" && (editingCatalog ? handleUpdate() : handleCreate())}
                />
              </div>

              <div className="flex gap-3">
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
                  onClick={editingCatalog ? handleUpdate : handleCreate}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                >
                  <Save size={18} />
                  {editingCatalog ? "Сохранить" : "Добавить"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}