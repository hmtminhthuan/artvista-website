import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { ResponseDTO } from '@/models/ResponseDTO';
import { ArtworkDTO } from '@/models/ArtWorkDTO';
import { AuthService } from '@/services/AuthService';

export class ArtWorkService {
    private static axiosInstance = axios.create();

    static initialize() {
        ArtWorkService.axiosInstance.interceptors.request.use(async (config) => {
            const token = await AuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    static async getAllArtworks(): Promise<ResponseDTO<ArtworkDTO[]>> {
        try {
            const response = await ArtWorkService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/artwork/GetAllArtwork`);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching all artworks:', error);
            throw error;
        }
    }

    static async getArtworkByID(id: string): Promise<ResponseDTO<ArtworkDTO>> {
        try {
            const response = await ArtWorkService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/artwork/GetArtworkByID?id=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching artwork by ID ${id}:`, error);
            throw error;
        }
    }

    static async createNewArtwork(artwork: ArtworkDTO): Promise<ResponseDTO<ArtworkDTO>> {
        try {
            const response = await ArtWorkService.axiosInstance.post<ResponseDTO<any>>(`${API_BASE_URL}/api/artwork/CreateNewArtwork`, artwork);
            return response.data.result;
        } catch (error) {
            console.error('Error creating new artwork:', error);
            throw error;
        }
    }

    static async updateArtwork(artwork: ArtworkDTO): Promise<ResponseDTO<ArtworkDTO>> {
        try {
            const response = await ArtWorkService.axiosInstance.put<ResponseDTO<any>>(`${API_BASE_URL}/api/artwork/UpdateArtwork`, artwork);
            return response.data.result;
        } catch (error) {
            console.error(`Error updating artwork with ID ${artwork.id}:`, error);
            throw error;
        }
    }

    static async deleteArtworkByID(id: string, confirm: boolean): Promise<ResponseDTO<ArtworkDTO>> {
        try {
            const response = await ArtWorkService.axiosInstance.delete<ResponseDTO<any>>(`${API_BASE_URL}/api/artwork/DeleteArtWorkByID`, {
                params: { id, confirm },
            });
            return response.data.result;
        } catch (error) {
            console.error(`Error deleting artwork with ID ${id}:`, error);
            throw error;
        }
    }
}

// Initialize the ArtWorkService to automatically set the Bearer token
ArtWorkService.initialize();
