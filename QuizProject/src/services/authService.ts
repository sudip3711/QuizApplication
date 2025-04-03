import axios from 'axios';
import toast from "react-hot-toast";
const API_URL = 'http://localhost:8080/user';  // No 'api' in the path



const axiosInstance = axios.create({

  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
}

export const authService = {
 
  login: async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    try {
      const response = await axiosInstance.post('login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));

        toast.success("Login successfuly")
      }
      
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // If the backend responds with an error (e.g., 401)
        if (error.response.status === 401) {
          toast.error("Invalid username or password. Please try again.");
        } else {
          toast.error(`Error: ${error.response.data.message || "Something went wrong!"}`);
        }
      } else {
        // If the request fails entirely (network error, etc.)
        toast.error("Unable to connect to the server. Please try again later.");
      }
      
      console.error("Login error:", error);
      return null;
    }
  },
  
  register: async (credentials: RegisterCredentials): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/register`, credentials);
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
      throw error; // Re-throw the error if you want calling code to handle it
    }
  },

  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('totalQuestions');
      window.location.replace("/")
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Add method to get JWT token for API calls
  getAuthHeader: (): { Authorization: string } | {} => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  },
};