import axios from "axios";

// Функции для работы с localStorage
const getItem = (key: string) => {
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);
};

// Создаем Axios instance
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getItem("accessToken");

    console.log("🔄 Request:", config.url);
    console.log("🔑 Token:", accessToken ? "exists" : "missing");

    // Auth kerak bo‘lmaydigan endpointlar
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/refresh")
    ) {
      return config;
    }

    // Agar token yo‘q bo‘lsa -> so‘rovni BLOK qilish
    if (!accessToken) {
      console.error("❌ Token yo‘q – so‘rov to‘xtatildi");

      window.location.href = "/login";

      return Promise.reject({
        message: "No access token. Request blocked.",
      });
    }

    // Token bo‘lsa biriktiramiz
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response Success - Status:", response.status);
    return response;
  },
  async (error) => {
    console.log("❌ Response Error:", error);
    console.log("❌ Error Status:", error.response?.status);
    console.log("❌ Error URL:", error.config?.url);
    console.log("❌ Error Method:", error.config?.method);

    const originalRequest = error.config;

    // Agar refresh endpointning o‘zi 401 qaytarsa - tashlaymiz
    if (originalRequest?.url?.includes("/auth/refresh")) {
      console.log("❌ Refresh endpoint 401 qaytardi — logout qilinyapti");

      removeItem("accessToken");
      removeItem("refreshToken");
      removeItem("role");
      removeItem("organ_id");

      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Agar 401 bo‘lsa va hali retry qilinmagan bo‘lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔐 401 Error Detected - Starting token refresh...");
      originalRequest._retry = true;

      try {
        const refreshToken = getItem("refreshToken");
        console.log("🔄 Refresh Token:", refreshToken ? "exists" : "missing");

        if (!refreshToken) {
          console.error("❌ No refresh token available");

          removeItem("accessToken");
          removeItem("refreshToken");
          removeItem("role");
          removeItem("organ_id");

          window.location.href = "/login";
          return Promise.reject(error);
        }

        console.log("🔄 Sending refresh request to /auth/refresh...");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refresh_token: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("🔄 Refresh Response Data:", response.data);

        const { access_token, refresh_token } = response.data;

        if (!access_token) {
          console.error("❌ No access token in refresh response");
          throw new Error("No access token in refresh response");
        }

        console.log("✅ New Access Token Received");

        // Yangi tokenlarni saqlaymiz
        setItem("accessToken", access_token);

        if (refresh_token) {
          setItem("refreshToken", refresh_token);
          console.log("✅ New Refresh Token Saved");
        }

        // Original request uchun headerni yangilaymiz
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        console.log("🔄 Retrying original request:", originalRequest.url);

        return axiosInstance(originalRequest);

      } catch (refreshError: any) {
        console.error("❌ Token refresh failed:", refreshError);
        console.error("❌ Refresh error response:", refreshError?.response?.data);

        removeItem("accessToken");
        removeItem("refreshToken");
        removeItem("role");
        removeItem("organ_id");

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    console.log("❌ Not a 401 error or already retried - rejecting");
    return Promise.reject(error);
  }
);