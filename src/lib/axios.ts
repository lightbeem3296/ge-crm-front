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
    config?: AxiosRequestConfig,
    confirmationMessage?: string,
  ): Promise<T | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }
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
    config?: AxiosRequestConfig,
    confirmationMessage?: string,
  ): Promise<R | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }
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

  // Generic POST Download request
  async download_post<T>(
    endpoint: string,
    data: T,
  ) {
    try {
      const response = await this.axiosInstance.post<BlobPart>(
        endpoint,
        data,
        {
          responseType: "blob",
        }
      );

      // Extract the filename from the response headers
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded-file";

      // Create a URL for the downloaded blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element and trigger a download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic PUT request
  async put<T, R>(
    endpoint: string,
    data: T,
    confirmationMessage?: string
  ): Promise<R | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }

    try {
      const response = await this.axiosInstance.put<R>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic PATCH request
  async patch<T, R>(
    endpoint: string,
    data: T,
    confirmationMessage?: string
  ): Promise<R | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }

    try {
      const response = await this.axiosInstance.patch<R>(endpoint, data);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  // Generic DELETE request
  async delete<R>(
    endpoint: string,
    confirmationMessage?: string
  ): Promise<R | undefined> {
    if (confirmationMessage) {
      const isConfirmed = confirm(confirmationMessage);
      if (!isConfirmed) return;
    }

    try {
      const response = await this.axiosInstance.delete<R>(endpoint);
      return response.data;
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
export const axiosHelper = new AxiosHelper(process.env.NEXT_PUBLIC_FRONTEND_API_BASE_URL || "");
