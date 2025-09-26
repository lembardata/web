"use client";

import { useState, useEffect } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        isMobileMenuOpen &&
        !target.closest(".mobile-sidebar") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden mobile-sidebar",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mobile-menu-button"
        />

        {/* Page Content */}
        <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8", className)}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Loading component for dashboard pages
export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton Header */}
      <div className="lg:pl-64">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse lg:hidden" />
            <div className="hidden md:block h-10 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Skeleton Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="space-y-6">
              {/* Title skeleton */}
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />

              {/* Cards skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg border border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Large content skeleton */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 rounded animate-pulse"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Skeleton Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
          {/* Header skeleton */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Navigation skeleton */}
          <div className="flex-1 px-3 py-4 space-y-6">
            {[...Array(5)].map((_, sectionIndex) => (
              <div key={sectionIndex}>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="space-y-1">
                  {[...Array(2)].map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center space-x-3 px-3 py-2"
                    >
                      <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer skeleton */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex space-x-2">
                <div className="h-8 flex-1 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 flex-1 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error boundary component for dashboard
export function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading the dashboard. Please try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
        {error.digest && (
          <p className="text-xs text-gray-400 mt-4">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
