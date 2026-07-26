"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught rendering error:", error, errorInfo);
    
    // Log the error silently to the server
    this.logErrorToServer(error.message, error.stack || "", window.location.href);
  }

  public componentDidMount() {
    // Listen to global runtime errors
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener("unhandledrejection", this.handleGlobalRejection);
  }

  public componentWillUnmount() {
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener("unhandledrejection", this.handleGlobalRejection);
  }

  private handleGlobalError = (event: ErrorEvent) => {
    // Silently log global unhandled errors
    this.logErrorToServer(
      event.message || "Unhandled script error",
      event.error?.stack || "",
      window.location.href
    );
  };

  private handleGlobalRejection = (event: PromiseRejectionEvent) => {
    // Silently log global unhandled promise rejections
    const reason = event.reason;
    this.logErrorToServer(
      reason?.message || "Unhandled Promise Rejection",
      reason?.stack || String(reason),
      window.location.href
    );
  };

  private async logErrorToServer(message: string, stack: string, url: string) {
    try {
      await fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          stack,
          url,
        }),
      });
    } catch (e) {
      console.error("Failed to send error details to database:", e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 dark:bg-zinc-950 rounded-3xl border border-slate-100 dark:border-zinc-800 text-center shadow-sm">
          <div className="max-w-md space-y-5">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900/50">
              <AlertCircle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-50">
                A temporary glitch occurred
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
                This runtime error has been automatically captured in our developer diagnostics checklist. 
                Our administrators will review and address it shortly.
              </p>
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow flex items-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
