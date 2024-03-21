export interface ResponseDTO<T> {
    result?: T;
    isSuccess: boolean;
    message?: string;
}