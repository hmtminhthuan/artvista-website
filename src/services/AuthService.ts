export class AuthService {
    static getToken(): string | null {
        return localStorage.getItem("accessToken");
    }

    static setToken(token: string): void {
        localStorage.setItem("accessToken", token);
    }

    static removeToken(): void {
        localStorage.removeItem("accessToken");
    }
}
