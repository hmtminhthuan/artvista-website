import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { ResponseDTO } from '@/models/ResponseDTO';
import { PackageDTO } from '@/models/PackageDTO';
import { AuthService } from '@/services/AuthService';

export class PackageService {
    private static axiosInstance = axios.create();

    static initialize() {
        PackageService.axiosInstance.interceptors.request.use(async (config) => {
            const token = await AuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    static async getAllPackages(): Promise<ResponseDTO<PackageDTO[]>> {
        try {
            const response = await PackageService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/package/GetAllPackage`);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching all packages:', error);
            throw error;
        }
    }

    static async getPackageByID(id: string): Promise<ResponseDTO<PackageDTO>> {
        try {
            const response = await PackageService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/package/GetPackageByID?id=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching package by ID ${id}:`, error);
            throw error;
        }
    }

    static async createNewPackage(packageData: PackageDTO): Promise<ResponseDTO<PackageDTO>> {
        try {
            const response = await PackageService.axiosInstance.post<ResponseDTO<any>>(`${API_BASE_URL}/api/package/CreatePackage`, packageData);
            return response.data.result;
        } catch (error) {
            console.error('Error creating new package:', error);
            throw error;
        }
    }

    static async updatePackage(packageData: PackageDTO): Promise<ResponseDTO<PackageDTO>> {
        try {
            const response = await PackageService.axiosInstance.put<ResponseDTO<any>>(`${API_BASE_URL}/api/package/UpdatePackage`, packageData);
            return response.data.result;
        } catch (error) {
            console.error(`Error updating package with ID ${packageData.packageId}:`, error);
            throw error;
        }
    }

    static async deletePackageByID(id: string, confirm: boolean): Promise<ResponseDTO<PackageDTO>> {
        try {
            const response = await PackageService.axiosInstance.delete<ResponseDTO<any>>(`${API_BASE_URL}/api/package/DeletePackage`, {
                params: { id, confirm },
            });
            return response.data.result;
        } catch (error) {
            console.error(`Error deleting package with ID ${id}:`, error);
            throw error;
        }
    }
}

// Initialize the PackageService to automatically set the Bearer token
PackageService.initialize();
