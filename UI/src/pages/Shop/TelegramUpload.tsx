import axios from "axios";
import { CHAT_ID, TELEGRAM_TOKEN } from "../../services/Secret";

const TELEGRAM_BOT_TOKEN = TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = CHAT_ID;

export const uploadToTelegram = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append("chat_id", TELEGRAM_CHAT_ID);
        formData.append("document", file);

        // Upload the file to Telegram
        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );

        if (response.data.ok) {
            const result = response.data.result;

            // Extract the file ID dynamically
            const fileId =
                result.document?.file_id ||
                result.video?.file_id ||
                result.audio?.file_id;

            if (!fileId) {
                throw new Error("File ID is missing in the response.");
            }

            return fileId; // ✅ Return only the file ID
        } else {
            throw new Error(
                `Failed to upload to Telegram: ${response.data.description || "Unknown error"}`
            );
        }
    } catch (error: any) {
        console.error("Error uploading to Telegram:", error?.response?.data || error.message);
        throw error;
    }
};
