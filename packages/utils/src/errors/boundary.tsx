"use client";

import React, { Component, type ReactNode } from "react";
import { getLogger } from "../logger";
import { AppError } from "./classes";
import { formatErrorForUser } from "./formatters";
import { handleError } from "./handlers";

const logger = getLogger();

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary component
 * 
 * Catches errors in child components and displays a fallback UI
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error
    logger.error("React Error Boundary caught error", error, {
      componentStack: errorInfo.componentStack,
    });

    // Handle error
    handleError(error, {
      logError: false, // Already logged above
      reportToSentry: true,
      notifyUser: false,
      rethrow: false,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(this.state.error, this.reset);
        }
        return this.props.fallback;
      }

      // Default fallback
      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const userMessage = formatErrorForUser(error);
  const errorCode = error instanceof AppError ? error.code : "UNKNOWN_ERROR";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "3rem",
          marginBottom: "1rem",
        }}
      >
        ⚠️
      </div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          color: "#666",
          marginBottom: "1.5rem",
          maxWidth: "500px",
        }}
      >
        {userMessage}
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Try Again
      </button>
      {process.env.NODE_ENV === "development" && (
        <details
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "0.5rem",
            maxWidth: "600px",
            textAlign: "left",
          }}
        >
          <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
            Error Details (Development Only)
          </summary>
          <pre
            style={{
              marginTop: "1rem",
              fontSize: "0.875rem",
              overflow: "auto",
            }}
          >
            <code>
              {errorCode}: {error.message}
              {"\n\n"}
              {error.stack}
            </code>
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Hook to use error boundary imperatively
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
}
