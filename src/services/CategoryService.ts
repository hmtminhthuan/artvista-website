import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { ResponseDTO } from '@/models/ResponseDTO';
import { CategoryDTO } from '@/models/CategoryDTO';
import { AuthService } from '@/services/AuthService';

export class CategoryService {
    private static axiosInstance = axios.create();

    static initialize() {
        CategoryService.axiosInstance.interceptors.request.use(async (config) => {
            const token = await AuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    static async getAllCategories(): Promise<ResponseDTO<CategoryDTO[]>> {
        try {
            const response = await CategoryService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/category/GetAllCategory`);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    }

    static async getCategoryByID(id: string): Promise<ResponseDTO<CategoryDTO>> {
        try {
            const response = await CategoryService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/category/GetCategoryByID?id=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching category by ID ${id}:`, error);
            throw error;
        }
    }

    static async createNewCategory(category: CategoryDTO): Promise<ResponseDTO<CategoryDTO>> {
        try {
            const response = await CategoryService.axiosInstance.post<ResponseDTO<any>>(`${API_BASE_URL}/api/category/CreateCategory`, category);
            return response.data.result;
        } catch (error) {
            console.error('Error creating new category:', error);
            throw error;
        }
    }

    static async updateCategory(category: CategoryDTO): Promise<ResponseDTO<CategoryDTO>> {
        try {
            const response = await CategoryService.axiosInstance.put<ResponseDTO<any>>(`${API_BASE_URL}/api/category/UpdateCategory`, category);
            return response.data.result;
        } catch (error) {
            console.error(`Error updating category with ID ${category.categoryId}:`, error);
            throw error;
        }
    }

    static async deleteCategoryByID(id: string): Promise<ResponseDTO<CategoryDTO>> {
        try {
            const response = await CategoryService.axiosInstance.delete<ResponseDTO<any>>(`${API_BASE_URL}/api/category/DeleteCategory?categoryId=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
    }
}

// Initialize the CategoryService to automatically set the Bearer token
CategoryService.initialize();
