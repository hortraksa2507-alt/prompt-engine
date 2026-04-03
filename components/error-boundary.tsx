"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Zap, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-[#060a0d]">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-6">
            <Zap className="w-7 h-7 text-white/30" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/40 text-sm mb-8 max-w-xs">
            {this.state.error?.message || "An unexpected error occurred. Try refreshing."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500"
          >
            <RefreshCw className="w-4 h-4" />
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
