import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig'; // Adjust the path as per your project structure
import { ResponseDTO } from '@/models/ResponseDTO';

export class ReportService {
    static async getMonthlyInspectionReport(selectedMonth: string): Promise<ResponseDTO<any>> {
        try {
            const response = await axios.get<ResponseDTO<any>>(`${API_BASE_URL}/api/report/MonthlyInspection`, {
                params: { SelectedMonth: selectedMonth },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly inspection report:', error);
            throw error;
        }
    }

    static async getReportByUser(id: string): Promise<ResponseDTO<any>> {
        try {
            const response = await axios.get<ResponseDTO<any>>(`${API_BASE_URL}/api/report/ReportByUser`, {
                params: { id },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching report by user:', error);
            throw error;
        }
    }
}