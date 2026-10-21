"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, RotateCcw, Copy, Check, Terminal, ShieldAlert } from "lucide-react";

interface Props {
  children?: ReactNode;
  moduleTitle?: string;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[Project Kingdom ErrorBoundary] Caught error in ${this.props.moduleTitle || "Component"}:`,
      error,
      errorInfo
    );
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    });
  };

  public handleCopyDiagnostics = () => {
    const diagnosticReport = `=== PROJECT KINGDOM ERROR DIAGNOSTIC REPORT ===
Module: ${this.props.moduleTitle || "General Component"}
Timestamp: ${new Date().toISOString()}
Error Message: ${this.state.error?.message || "Unknown error"}
Stack: ${this.state.error?.stack || "No stack trace available"}
Component Stack: ${this.state.errorInfo?.componentStack || "No component stack"}
URL: ${typeof window !== "undefined" ? window.location.href : "SSR"}
==============================================`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(diagnosticReport).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 3000);
      });
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const moduleName = this.props.moduleTitle || "Sovereign Module";

      return (
        <div
          id={`error-boundary-${moduleName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
          className="p-5 my-3 bg-[#FAF7F2] border-2 border-red-900/40 text-[#1a1a1a] shadow-sm rounded-sm font-sans"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-red-900/20 pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-sm bg-red-950 flex items-center justify-center border border-red-500/50 shrink-0">
                <ShieldAlert className="w-4 h-4 text-red-200" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-serif font-bold text-red-950">
                    {moduleName} Execution Halted
                  </h3>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-red-100 text-red-800 border border-red-300">
                    Runtime Guard Active
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 font-mono mt-0.5">
                  An unexpected fault was contained. Neighboring modules and local state remain unaffected.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-neutral-400" suppressHydrationWarning>
              CONTAINED
            </span>
          </div>

          {/* Error Message Summary */}
          <div className="bg-white border border-neutral-300 p-3 mb-3 font-mono text-xs text-neutral-800">
            <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
              Fault Description
            </div>
            <div className="text-red-900 font-bold break-words">
              {this.state.error?.name || "Error"}: {this.state.error?.message || "An unhandled exception occurred."}
            </div>
          </div>

          {/* Recovery Actions & Controls */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#c5a27d] text-[#FAF7F2] transition-colors text-xs font-mono uppercase tracking-wider shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#c5a27d]" />
              <span>Retry Module</span>
            </button>

            <button
              onClick={this.handleCopyDiagnostics}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#1a1a1a]/20 hover:bg-[#FAF7F2] text-neutral-800 transition-colors text-xs font-mono uppercase tracking-wider"
            >
              {this.state.copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Report Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#c5a27d]" />
                  <span>Copy Diagnostics</span>
                </>
              )}
            </button>

            <button
              onClick={() => this.setState({ showDetails: !this.state.showDetails })}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#1a1a1a]/20 hover:bg-[#FAF7F2] text-neutral-600 transition-colors text-xs font-mono uppercase tracking-wider ml-auto"
            >
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              <span>{this.state.showDetails ? "Hide Stack" : "View Stack"}</span>
            </button>
          </div>

          {/* Recovery Guidance Box */}
          <div className="p-2.5 bg-[#FAF7F2] border border-[#c5a27d]/30 text-[11px] font-sans text-neutral-700 space-y-1">
            <div className="font-mono text-[10px] font-bold text-[#c5a27d] uppercase tracking-wider">
              Recommended Recovery Procedures:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-neutral-600 pl-1 font-sans">
              <li>Click <strong>Retry Module</strong> to re-render with the latest verified state.</li>
              <li>If the issue persists, the local IndexedDB vault ensures your unsaved strongholds and logs are preserved.</li>
              <li>You may continue navigating other tabs; this boundary isolates failures to <em>{moduleName}</em>.</li>
            </ul>
          </div>

          {/* Expandable Stack Trace */}
          {this.state.showDetails && (
            <div className="mt-3 p-3 bg-[#151515] border border-neutral-800 text-neutral-300 font-mono text-[10px] overflow-x-auto max-h-48 rounded-sm">
              <div className="text-emerald-400 font-bold mb-1">STACK TRACE &amp; COMPONENT HIERARCHY</div>
              <pre className="text-neutral-400 whitespace-pre-wrap">
                {this.state.error?.stack || "No JS stack"}
                {"\n"}
                {this.state.errorInfo?.componentStack || ""}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
