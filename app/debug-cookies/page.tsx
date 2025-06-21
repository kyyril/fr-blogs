"use client";

import { useEffect, useState } from "react";
import { tokenService } from "@/services/token.services";

export default function DebugCookiesPage() {
  const [cookies, setCookies] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const updateCookieInfo = () => {
      setCookies(document.cookie);
      setAccessToken(tokenService.getAccessToken());
      setRefreshToken(tokenService.getRefreshToken());
    };

    updateCookieInfo();
    
    // Update every second
    const interval = setInterval(updateCookieInfo, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const clearAllCookies = () => {
    tokenService.removeTokens();
    // Also clear all cookies manually
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Cookie Debug Page</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Raw Document Cookies:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {cookies || "No cookies found"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Token Service - Access Token:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {accessToken || "No access token"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Token Service - Refresh Token:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {refreshToken || "No refresh token"}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {`NODE_ENV: ${process.env.NODE_ENV}
API_URL: ${process.env.NEXT_PUBLIC_API_URL}
User Agent: ${typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}`}
          </pre>
        </div>

        <div className="space-x-4">
          <button
            onClick={clearAllCookies}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All Cookies
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
