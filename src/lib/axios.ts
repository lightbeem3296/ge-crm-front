import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";

export class AxiosHelper {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    // Create an Axios instance with a custom base URL
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  // Generic GET request
  async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T | undefined> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, config);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic POST request
  async post<T, R>(
    endpoint: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<R | undefined> {
    try {
      const response = await this.axiosInstance.post<R>(
        endpoint,
        data,
        config
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T>(
    endpoint: string,
    data: T,
    confirmationMessage?: string
  ): Promise<AxiosResponse | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }

    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return response;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch<T>(
    endpoint: string,
    data: T,
    confirmationMessage?: string
  ): Promise<AxiosResponse | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }

    try {
      const response = await this.axiosInstance.patch(endpoint, data);
      return response;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete(
    endpoint: string,
    confirmationMessage?: string
  ): Promise<AxiosResponse | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }

    try {
      const response = await this.axiosInstance.delete(endpoint);
      return response;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Centralized error handler
  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      alert(error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  }
}

// Instance
export const axiosHelper = new AxiosHelper(process.env.NEXT_PUBLIC_API_BASE_URL || "");
