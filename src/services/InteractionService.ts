import { InteractionDTO } from '@/models/InteractionDTO';
import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/apiConfig'; // Assuming you have a file named apiConfig.ts defining the base URL
import { ResponseDTO } from '@/models/ResponseDTO';
import { AuthService } from '@/services/AuthService'; // Import AuthService

export class InteractionService {
    private static axiosInstance = axios.create();

    static setBearerToken(token: string) {
        InteractionService.axiosInstance.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }

    static async getAllInteractions(): Promise<ResponseDTO<InteractionDTO[]>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/GetAllInteraction`, config);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching all interactions:', error);
            throw error;
        }
    }

    static async getInteractionByID(interactionID: string): Promise<ResponseDTO<InteractionDTO>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/GetInteractionByID?interactionID=${interactionID}`, config);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching interaction by ID ${interactionID}:`, error);
            throw error;
        }
    }

    static async getInteractionByUserID(userID: string): Promise<ResponseDTO<InteractionDTO[]>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/GetInteractionByUserID?userID=${userID}`, config);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching interactions by user ID ${userID}:`, error);
            throw error;
        }
    }

    static async getInteractionByPostID(postId: string): Promise<ResponseDTO<InteractionDTO[]>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/GetInteractionByPostID?postId=${postId}`, config);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching interactions by post ID ${postId}:`, error);
            throw error;
        }
    }

    static async createNewInteraction(interaction: InteractionDTO): Promise<ResponseDTO<any>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.post<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/CreateInteraction`, interaction, config);
            return response.data.result;
        } catch (error) {
            console.error('Error creating new interaction:', error);
            throw error;
        }
    }

    static async updateInteraction(interaction: InteractionDTO): Promise<ResponseDTO<any>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.put<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/UpdateInteraction`, interaction, config);
            return response.data.result;
        } catch (error) {
            console.error(`Error updating interaction with ID ${interaction.interactionId}:`, error);
            throw error;
        }
    }

    static async deleteInteractionByID(id: string): Promise<ResponseDTO<any>> {
        try {
            const token = AuthService.getToken();
            const config: AxiosRequestConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const response = await InteractionService.axiosInstance.delete<ResponseDTO<any>>(`${API_BASE_URL}/api/interaction/DeleteInteraction?id=${id}`, config);
            return response.data.result;
        } catch (error) {
            console.error(`Error deleting interaction with ID ${id}:`, error);
            throw error;
        }
    }
}
