import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { ResponseDTO } from '@/models/ResponseDTO';
import { ConfigurationDTO } from '@/models/ConfigurationDTO';
import { AuthService } from '@/services/AuthService';

export class ConfigurationService {
    private static axiosInstance = axios.create();

    static initialize() {
        ConfigurationService.axiosInstance.interceptors.request.use(async (config) => {
            const token = await AuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    static async getAllConfigurations(): Promise<ResponseDTO<ConfigurationDTO[]>> {
        try {
            const response = await ConfigurationService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/configuration/GetAllConfiguration`);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching all configurations:', error);
            throw error;
        }
    }

    static async getConfigurationByID(id: string): Promise<ResponseDTO<ConfigurationDTO>> {
        try {
            const response = await ConfigurationService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/configuration/GetConfigurationByID?id=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching configuration by ID ${id}:`, error);
            throw error;
        }
    }

    static async createNewConfiguration(configuration: ConfigurationDTO): Promise<ResponseDTO<ConfigurationDTO>> {
        try {
            const response = await ConfigurationService.axiosInstance.post<ResponseDTO<any>>(`${API_BASE_URL}/api/configuration/CreateNewConfiguration`, configuration);
            return response.data.result;
        } catch (error) {
            console.error('Error creating new configuration:', error);
            throw error;
        }
    }

    static async updateConfiguration(configuration: ConfigurationDTO): Promise<ResponseDTO<ConfigurationDTO>> {
        try {
            const response = await ConfigurationService.axiosInstance.put<ResponseDTO<any>>(`${API_BASE_URL}/api/configuration/UpdateConfiguration`, configuration);
            return response.data.result;
        } catch (error) {
            console.error(`Error updating configuration with ID ${configuration.configurationId}:`, error);
            throw error;
        }
    }

    static async deleteConfigurationByID(id: string): Promise<ResponseDTO<ConfigurationDTO>> {
        try {
            const response = await ConfigurationService.axiosInstance.delete<ResponseDTO<any>>(`${API_BASE_URL}/api/configuration/DeleteConfigurationByID?id=${id}&confirm=${confirm}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error deleting configuration with ID ${id}:`, error);
            throw error;
        }
    }
}

// Initialize the  ConfigurationService to automatically set the Bearer token
ConfigurationService.initialize();
