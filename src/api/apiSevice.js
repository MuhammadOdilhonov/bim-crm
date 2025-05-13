import axios from "axios"

export const BaseUrl = "https://med-crm-service.uz/api" // To'g'ri URLni tekshiring
export const BaseUrlImg = "https://med-crm-service.uz"

// Axios instance yaratish
const client = axios.create({
    baseURL: BaseUrl, // baseURL (kichik harflar bilan)
    baseURLIMG: BaseUrlImg,
    headers: {
        "Content-Type": "application/json", // JSON yuborish uchun zarur header
    },
})

// Add request interceptor to include auth token in requests
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("medCrmToken")
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default client
