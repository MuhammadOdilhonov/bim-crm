import axios from "axios"

export const BaseUrl = "https://cliniccrm.pythonanywhere.com/api" // To'g'ri URLni tekshiring
export const BaseUrlImg = "https://cliniccrm.pythonanywhere.com"

// Axios instance yaratish
const client = axios.create({
    baseURL: BaseUrl, // baseURL (kichik harflar bilan)
    baseURLIMG: BaseUrlImg,
    headers: {
        "Content-Type": "application/json", // JSON yuborish uchun zarur header
    },
})
export default client;