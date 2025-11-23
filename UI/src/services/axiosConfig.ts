import axios from 'axios';
import CryptoJS from 'crypto-js'
import CYS from './Secret';
import { logout } from './axiosClient';

export function createAxiosClient({
    options,
    getCurrentAccessToken,
}: any) {
    const client = axios.create(options);
    client.interceptors.request.use((config: any) => {
        const token = getCurrentAccessToken();
        if (token) {
            config.headers.Authorization = token;
        }
        if(config.data instanceof FormData) {
            console.log(config.data)
        }
        else {
            // console.log(config.data)
            config.data = { cypher: CryptoJS.AES.encrypt(JSON.stringify(config.data), CYS).toString() }
        }
        return config;
    },
        (error) => {
            console.log(error)
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        response => {
            // Skip decryption for file upload responses or if data is already decrypted
            if (response.config.url?.includes('/upload-doc') || response.config.url?.includes('/upload')) {
                return response;
            }
            
            // Try to decrypt if data exists and is a string
            if (response.data?.data && typeof response.data.data === 'string') {
                try {
                    response.data.data = JSON.parse(CryptoJS.AES.decrypt(response.data.data, CYS).toString(CryptoJS.enc.Utf8));
                } catch (decryptError) {
                    // If decryption fails, data might already be plain JSON
                    console.warn("Decryption failed, treating as plain JSON:", decryptError);
                    // Try to parse as JSON if it's already decrypted
                    try {
                        if (typeof response.data.data === 'string') {
                            response.data.data = JSON.parse(response.data.data);
                        }
                    } catch (parseError) {
                        // If both fail, keep original data
                        console.warn("Could not parse response data:", parseError);
                    }
                }
            }
            return response;
        },
        async error => {
            console.log(error)
            if(error.response === undefined) {
                alert("Internet failure or server disconnected")
            }
            else if (error.response.status === 401) {
                logout();
                return axios(error.config);
            }
            return Promise.reject(error);
        }
    );
    return client;

}