"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";

interface AppWrapperProps {
  children: React.ReactNode;
}

export const AppUserWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { isLoading } = useSelector((state: RootState) => state.auth);
  const { initializeAuth } = useAuth();
  console.log(initializeAuth);

  useEffect(() => {
    // Initialize auth when app starts
    initializeAuth();
  }, [initializeAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};
