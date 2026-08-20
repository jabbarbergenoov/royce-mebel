import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FurnitureCard } from "./Cards/FurnitureCard";
import { Drawer } from "./Drawer";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";

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

export function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Состояния для заказа
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_URL;

  // Проверка токена
  const checkAccessToken = (): boolean => {
    const token = localStorage.getItem('accessToken');
    return !!token && token.length > 0;
  };

  // Загрузка товаров
  const fetchProducts = async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const { data } = await axios.get(`${baseURL}/products`, {
        params: {
          limit,
          offset: isLoadMore ? offset : 0,
        },
      });

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      } else {
        setProducts(data.products || []);
      }
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Загрузка следующих товаров
  const loadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchProducts(true);
  };

  const handleOpenDrawer = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
    setOrderError(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
    setOrderError(null);
    setIsOrdering(false);
  };

  // Функция для оформления заказа
  const handleOrder = async (orderData: {
    full_name: string;
    phone: string;
    description?: string;
    product_id: number;
  }) => {
    // Проверяем токен перед заказом
    if (!checkAccessToken()) {
      // Токен отсутствует - редирект на страницу логина
      handleCloseDrawer();
      navigate({ to: '/login' });
      return;
    }

    setIsOrdering(true);
    setOrderError(null);

    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post(
        `${baseURL}/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Заказ успешно создан
      console.log('Заказ создан:', response.data);
      
      // Показываем сообщение об успехе
      setIsOrdering(false);
      
      // Закрываем Drawer через 2 секунды
      setTimeout(() => {
        handleCloseDrawer();
      }, 2000);
      
      return response.data;
      
    } catch (error: any) {
      console.error('Ошибка при создании заказа:', error);
      
      if (error.response?.status === 401) {
        // Токен недействительный - удаляем и редиректим на логин
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        handleCloseDrawer();
        navigate({ to: '/login' });
        return;
      }
      
      setOrderError(error.response?.data?.message || 'Произошла ошибка при создании заказа. Попробуйте позже.');
      setIsOrdering(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;

    return `${baseURL}${imagePath}`;
  };

  const hasMore = products.length < total;

  return (
    <>
      <section className="py-24 px-6" style={{ backgroundColor: "#FAE7C9" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: "700",
                color: "#706233",
                marginBottom: "1rem",
              }}
            >
              Наша коллекция
            </h2>
            <p style={{ color: "#B0926A", fontSize: "1.2rem" }}>
              Эксклюзивные решения для вашего дома
            </p>
          </motion.div>

          {/* Скелетон загрузки */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ backgroundColor: "#E1C78F" }}
                >
                  <div
                    className="h-56"
                    style={{ backgroundColor: "#B0926A" }}
                  />
                  <div className="p-5 space-y-3">
                    <div
                      className="h-6 rounded w-3/4"
                      style={{ backgroundColor: "#B0926A" }}
                    />
                    <div
                      className="h-4 rounded w-1/2"
                      style={{ backgroundColor: "#B0926A" }}
                    />
                    <div
                      className="h-5 rounded w-1/4"
                      style={{ backgroundColor: "#B0926A" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 rounded-3xl"
              style={{ backgroundColor: "#E1C78F" }}
            >
              <p style={{ color: "#706233", opacity: 0.7 }}>
                Товары временно отсутствуют
              </p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <FurnitureCard
                    key={product.id}
                    //@ts-ignore
                    id={product.id}
                    title={product.name}
                    category={product.catalog?.name || "Без категории"}
                    //@ts-ignore
                    price={`${product.price || "Цена не указана"}`}
                    imageUrl={getImageUrl(product.image_name)}
                    description={product.description}
                    delay={index * 0.1}
                    onOpenDrawer={() => handleOpenDrawer(product)}
                  />
                ))}
              </div>

              {/* Кнопка "Загрузить еще" */}
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-8 py-3 rounded-xl font-medium transition-all"
                    style={{
                      backgroundColor: "#706233",
                      color: "#FAE7C9",
                      opacity: isLoadingMore ? 0.7 : 1,
                      cursor: isLoadingMore ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-transparent" />
                        Загрузка...
                      </div>
                    ) : (
                      "Загрузить еще"
                    )}
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Drawer для деталей товара */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        product={
          selectedProduct
            ? {
                title: selectedProduct.name,
                category: selectedProduct.catalog?.name || "Без категории",
                //@ts-ignore
                price: `${selectedProduct.price || "Цена не указана"}`,
                imageUrl: getImageUrl(selectedProduct.image_name),
                description: selectedProduct.description,
                //@ts-ignore
                addition: selectedProduct.addition,
                //@ts-ignore
                id: selectedProduct.id,
              }
            : null
        }
        onOrder={handleOrder}
        isOrdering={isOrdering}
        orderError={orderError}
      />
    </>
  );
}