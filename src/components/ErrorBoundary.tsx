import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "./ui/button";
import { analytics } from "../utils/analytics";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error("Error caught by boundary:", error, errorInfo);

    // Track error in analytics (includes Sentry automatically)
    analytics.trackError(
      "React Error Boundary",
      `${error.name}: ${error.message}`,
      error.stack
    );

    // Send to Sentry if available (already handled by trackError, but can add extra context)
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          errorBoundary: true,
        },
      });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    this.handleReset();
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 mb-6">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                Oups, une erreur est survenue
              </h1>
              
              <p className="text-xl text-neutral-400 mb-8">
                Nous sommes désolés, quelque chose s'est mal passé.
                L'équipe technique a été notifiée.
              </p>
            </div>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-8 p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                <h2 className="font-bold text-red-400 mb-3">Détails de l'erreur :</h2>
                <pre className="text-sm text-neutral-300 overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-neutral-400 hover:text-mint">
                      Stack trace
                    </summary>
                    <pre className="text-xs text-neutral-400 mt-2 overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                size="lg"
                className="bg-mint text-black hover:bg-mint/90 h-14 px-8 rounded-xl"
              >
                <RefreshCcw className="mr-2 h-5 w-5" />
                Réessayer
              </Button>

              <Button
                onClick={this.handleGoHome}
                size="lg"
                variant="outline"
                className="border-2 border-neutral-800 hover:border-mint/30 h-14 px-8 rounded-xl"
              >
                <Home className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
