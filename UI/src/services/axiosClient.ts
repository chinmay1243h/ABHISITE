import { createAxiosClient } from "./axiosConfig";
import { jwtDecode } from "jwt-decode";

const BASE_URL = 'http://localhost:4000/api'

// const BASE_URL ="https://api.livabhiproductions.in/api"
// const BASE_URL="https://livabhi-server.onrender.com/api"


export function getCurrentAccessToken() {
    // SSR ya build issues avoid karne ke liye
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem('accessToken');
    
    // Console spam avoid karne ke liye comment kar diya
    // if (!token) {
    //     console.warn('No access token found in localStorage');
    // }
    
    return token;
}

export function isLoggedIn() {
    return getCurrentAccessToken() !== null;
}

export async function logout() {
    localStorage.clear();
    window.location.href = '/login';
    return 0;
}


export function setCurrentAccessToken(accessToken: any) {
    return localStorage.setItem('accessToken', accessToken)
}



export function getfirstName(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        console.log("user Details bro!=",decoded)
        return decoded.firstName || '';
    }
    else {
        return '';
    }
}

export function getlastName(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        // console.log()
        // console.log("user Details bro!=",decoded)
        return decoded.lastName || '';
    }
    else {
        return '';
    }
}


export function getUserId(): string {
    let token: any = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (token) {
        try {
            let decoded: any = jwtDecode(token);
            console.log("Decoded token:", decoded);
            // Return id as string, as MongoDB IDs are strings
            // Check both id and _id fields
            const userId = decoded.id || decoded._id || decoded.user_id || '';
            console.log("Extracted user ID:", userId);
            return userId ? String(userId) : '';
        } catch (error) {
            console.error("Error decoding token:", error);
            return '';
        }
    }
    else {
        console.warn("No access token found in localStorage");
        return '';
    }
}

export function getUserType(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.userType || '';
    }
    else {
        return '';
    }
}


export function getUserRoll(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.role || '';
    }
    else {
        return '';
    }
}


export function getUserEmail(): string {
    let token: any = localStorage.getItem('accessToken');
    if (token) {
        let decoded: any = jwtDecode(token);
        return decoded.email_id || '';
    }
    else {
        return '';
    }
}

export function getUserDetails(): any | null {
    let token = localStorage.getItem('accessToken');
    if (token) {
        try {
            let res: any = jwtDecode(token);
            console.log(res)
            return {
                profileImage:res.profileImage,
                email: res.email_id,
                coverImage:res.coverImage,
                firstName:res.name,
                lastName:res.lastName,
                createdAt:res.createdAt,
            
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } else {
        return null;
    }
}



export const client = createAxiosClient({
    options: {
        baseURL: BASE_URL,
        timeout: 300000,
        headers: {
        }
    },
    getCurrentAccessToken,
})
