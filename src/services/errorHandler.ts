import process from "process";

class ErrorHandler {
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    window.addEventListener(
      "unhandledrejection",
      this.handleUnhandledRejection
    );
    window.addEventListener("error", this.handleRuntimeError);
    window.addEventListener("error", this.handleResourceError, true);
    this.isInitialized = true;
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    const error = event.reason;
    this.logError("Unhandled Promise Rejection", error);
    this.showErrorToast("An unexpected error occurred. Please try again.");
  };

  private handleRuntimeError = (event: ErrorEvent) => {
    if (event.error?.__handledByBoundary) {
      return;
    }

    const error = event.error || new Error(event.message);
    this.logError("Runtime Error", error);
  };

  private handleResourceError = (event: ErrorEvent) => {
    const target = event.target as HTMLElement;
    if (
      target &&
      (target.tagName === "IMG" ||
        target.tagName === "SCRIPT" ||
        target.tagName === "LINK")
    ) {
      this.logError(
        "Resource Loading Error",
        new Error(
          `Failed to load ${target.tagName}: ${
            (target as any).src || (target as any).href
          }`
        )
      );
    }
  };

  private logError(type: string, error: Error | any, extra?: any) {
    const errorData = {
      type,
      message: error?.message || String(error),
      stack: error?.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      extra,
    };

    if (process.env.NODE_ENV === "development") {
      console.error(`[${type}]`, errorData);
    }
    this.sendToBackend(errorData);
  }

  private async sendToBackend(errorData: any) {
    try {
      await fetch("/api/log-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorData),
        keepalive: true,
      });
    } catch (err) {
      console.error("Failed to log error to backend:", err);
    }
  }

  private showErrorToast(message: string) {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 5000);
  }

  handleServiceError(error: any, context?: string) {
    const normalizedError = error?.response?.data || error?.message || error;
    this.logError("Service Error", normalizedError, { context });

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error?.response?.status === 403) {
      this.showErrorToast("You do not have permission to perform this action.");
    } else if (error?.response?.status === 404) {
      this.showErrorToast("The requested resource was not found.");
    } else if (error?.response?.status >= 500) {
      this.showErrorToast("Server error. Please try again later.");
    } else {
      this.showErrorToast("An unexpected error occurred. Please try again.");
    }
  }

  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    context?: string
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleServiceError(error, context);
        throw error;
      }
    }) as T;
  }
}

export const errorHandler = new ErrorHandler();
