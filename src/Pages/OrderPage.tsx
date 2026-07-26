import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ChevronLeft, ChevronRight, Eye, 
  Edit2, Trash2, X, Save, Phone, User, 
  Package, Calendar, Clock, AlertCircle
} from "lucide-react";
import { axiosInstance } from "#/lib/api";

interface Order {
  id: number;
  phone: string;
  full_name: string;
  description: string;
  product_id: number;
  product?: {
    id: number;
    name: string;
    price: number;
  };
  created_at: string;
  updated_at: string;
}

interface OrderFormData {
  phone: string;
  full_name: string;
  description: string;
  product_id: string;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    phone: "",
    full_name: "",
    description: "",
    product_id: ""
  });
  
  // Пагинация
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Загрузка заказов
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/orders", {
        params: {
          full_name: searchName || undefined,
          limit,
          offset
        }
      });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Ошибка загрузки заказов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [limit, offset, searchName]);

  // Поиск с debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchName(searchInput);
      setOffset(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Обновление заказа
  const handleUpdate = async () => {
    if (!formData.phone.trim() || !formData.full_name.trim()) {
      alert("Заполните обязательные поля (телефон и ФИО)");
      return;
    }
    
    try {
      await axiosInstance.patch(`/orders/${editingOrder?.id}`, {
        phone: formData.phone,
        full_name: formData.full_name,
        description: formData.description || "",
        product_id: Number(formData.product_id) || undefined
      });
      await fetchOrders();
      closeModal();
    } catch (error) {
      console.error("Ошибка обновления:", error);
      //@ts-ignore
      alert(error.response?.data?.message || "Ошибка обновления заказа");
    }
  };

  // Удаление заказа
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Удалить заказ от "${name}"?`)) {
      try {
        await axiosInstance.delete(`/orders/${id}`);
        await fetchOrders();
      } catch (error) {
        console.error("Ошибка удаления:", error);
        //@ts-ignore
        alert(error.response?.data?.message || "Ошибка удаления заказа");
      }
    }
  };

  // Открыть модалку для редактирования
  const openModal = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      phone: order.phone,
      full_name: order.full_name,
      description: order.description || "",
      product_id: order.product_id.toString()
    });
    setIsModalOpen(true);
  };

  // Открыть модалку просмотра
  const openViewModal = (order: Order) => {
    setViewingOrder(order);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
    setFormData({
      phone: "",
      full_name: "",
      description: "",
      product_id: ""
    });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              Заказы
            </h1>
            <p
              style={{
                fontSize: "1.2rem",
                color: "#706233",
                lineHeight: "1.6",
                opacity: 0.9
              }}
            >
              Управление заказами клиентов
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
                placeholder="Поиск по ФИО..."
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

            <div className="flex items-center gap-2">
              <span style={{ color: "#706233", opacity: 0.7 }}>
                Всего заказов: {total}
              </span>
            </div>
          </motion.div>

          {/* Список заказов */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full animate-spin border-4" style={{ borderColor: "#706233", borderTopColor: "transparent" }} />
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-3xl"
              style={{ backgroundColor: "#E1C78F" }}
            >
              <Package size={48} style={{ color: "#706233", opacity: 0.5 }} className="mx-auto mb-4" />
              <p style={{ color: "#706233", opacity: 0.7 }}>Заказы не найдены</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: "#E1C78F" }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Информация о заказе */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <User size={20} style={{ color: "#706233", opacity: 0.7 }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: "#706233" }}>
                            {order.full_name}
                          </p>
                          <p className="text-sm" style={{ color: "#706233", opacity: 0.7 }}>
                            <Phone size={14} className="inline mr-1" />
                            {order.phone}
                          </p>
                        </div>
                      </div>

                      {order.description && (
                        <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>
                          {order.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: "#FAE7C9", color: "#706233" }}>
                          <Package size={14} />
                          Товар ID: {order.product_id}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: "#FAE7C9", color: "#706233" }}>
                          <Calendar size={14} />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: "#FAE7C9", color: "#706233" }}>
                          <Clock size={14} />
                          Обновлен: {formatDate(order.updated_at)}
                        </span>
                      </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openViewModal(order)}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#B0926A", color: "#FAE7C9" }}
                      >
                        <Eye size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal(order)}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(order.id, order.full_name)}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#c62828", color: "#FAE7C9" }}
                      >
                        <Trash2 size={18} />
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

      {/* Модальное окно редактирования */}
      <AnimatePresence>
        {isModalOpen && editingOrder && (
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
                  Редактировать заказ #{editingOrder.id}
                </h2>
                <button onClick={closeModal}>
                  <X size={24} style={{ color: "#706233" }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label style={{ color: "#706233" }} className="block text-sm font-medium mb-2">
                    ФИО <span style={{ color: "#c62828" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Введите ФИО"
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
                    Телефон <span style={{ color: "#c62828" }}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (XXX) XXX-XX-XX"
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
                    Комментарий
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Дополнительная информация"
                    rows={3}
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
                    ID товара
                  </label>
                  <input
                    type="number"
                    value={formData.product_id}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    placeholder="Введите ID товара"
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
                  onClick={handleUpdate}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                >
                  <Save size={18} />
                  Сохранить
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальное окно просмотра */}
      <AnimatePresence>
        {isViewModalOpen && viewingOrder && (
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
              className="w-full max-w-2xl rounded-3xl p-6"
              style={{ backgroundColor: "#FAE7C9" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 style={{ color: "#706233", fontSize: "1.8rem", fontWeight: "700" }}>
                  Заказ #{viewingOrder.id}
                </h2>
                <button onClick={() => setIsViewModalOpen(false)}>
                  <X size={24} style={{ color: "#706233" }} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#E1C78F" }}>
                    <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>ФИО</p>
                    <p className="font-semibold" style={{ color: "#706233" }}>{viewingOrder.full_name}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#E1C78F" }}>
                    <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>Телефон</p>
                    <p className="font-semibold" style={{ color: "#706233" }}>{viewingOrder.phone}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: "#E1C78F" }}>
                  <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>ID товара</p>
                  <p className="font-semibold" style={{ color: "#706233" }}>{viewingOrder.product_id}</p>
                </div>

                {viewingOrder.description && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#E1C78F" }}>
                    <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>Комментарий</p>
                    <p style={{ color: "#706233" }}>{viewingOrder.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#E1C78F" }}>
                    <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>Создан</p>
                    <p className="text-sm" style={{ color: "#706233" }}>{formatDate(viewingOrder.created_at)}</p>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#E1C78F" }}>
                    <p className="text-sm" style={{ color: "#706233", opacity: 0.6 }}>Обновлен</p>
                    <p className="text-sm" style={{ color: "#706233" }}>{formatDate(viewingOrder.updated_at)}</p>
                  </div>
                </div>
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
                    openModal(viewingOrder);
                  }}
                  className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#706233", color: "#FAE7C9" }}
                >
                  <Edit2 size={18} />
                  Редактировать
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}