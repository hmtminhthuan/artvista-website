import axios from 'axios';
import { PostDTO } from '@/models/PostDTO';
import { API_BASE_URL } from '@/config/apiConfig';
import { ResponseDTO } from '@/models/ResponseDTO';
import { AuthService } from '@/services/AuthService';

export class PostService {
    private static axiosInstance = axios.create();

    static initialize() {
        PostService.axiosInstance.interceptors.request.use(async (config) => {
            const token = await AuthService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    static async getAllPosts(): Promise<ResponseDTO<PostDTO[]>> {
        try {
            const response = await PostService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/post/GetAllPost`);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching all posts:', error);
            throw error;
        }
    }

    static async getPostByID(id: string): Promise<ResponseDTO<PostDTO>> {
        try {
            const response = await PostService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/post/GetPostByID?id=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error fetching post by ID ${id}:`, error);
            throw error;
        }
    }

    static async createNewPost(post: PostDTO): Promise<ResponseDTO<PostDTO>> {
        try {
            const response = await PostService.axiosInstance.post<ResponseDTO<any>>(`${API_BASE_URL}/api/post/CreateNewPost`, post);
            return response.data.result;
        } catch (error) {
            console.error('Error creating new post:', error);
            throw error;
        }
    }

    static async updatePost(post: PostDTO): Promise<ResponseDTO<any>> {
        try {
            const response = await PostService.axiosInstance.put<ResponseDTO<any>>(`${API_BASE_URL}/api/post/UpdatePost`, post);
            return response.data.result;
        } catch (error) {
            console.error(`Error updating post with ID ${post.postId}:`, error);
            throw error;
        }
    }

    static async deletePostByID(id: string): Promise<ResponseDTO<any>> {
        try {
            const response = await PostService.axiosInstance.delete<ResponseDTO<any>>(`${API_BASE_URL}/api/post/DeletePostByID?id=${id}`);
            return response.data.result;
        } catch (error) {
            console.error(`Error deleting post with ID ${id}:`, error);
            throw error;
        }
    }

    static async getPostByCondition(title: string, artworkId: string): Promise<ResponseDTO<PostDTO[]>> {
        try {
            const response = await PostService.axiosInstance.get<ResponseDTO<any>>(`${API_BASE_URL}/api/post/GetPostByCondition?title=${title}&artworkId=${artworkId}`);
            return response.data.result;
        } catch (error) {
            console.error('Error fetching post by condition:', error);
            throw error;
        }
    }
}

// Initialize the PostService to automatically set the Bearer token
PostService.initialize();
