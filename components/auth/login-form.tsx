"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { tokenService } from "@/services/token.services";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <div className="space-y-6">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          console.log("Google credential response:", credentialResponse);

          const idToken = credentialResponse.credential;
          if (!idToken) {
            console.error("No credential received from Google");
            toast({
              title: "Login failed",
              description: "No credential received from Google.",
              variant: "destructive",
            });
            return;
          }

          console.log("ID Token received:", idToken ? "Present" : "Missing");

          try {
            console.log("Attempting login...");
            const res = await login(idToken);
            console.log("Login response:", res);

            if (res && res.user) {
              // Add debugging for cookies after login
              console.log("Login successful, checking cookies...");
              console.log("Document cookies:", document.cookie);

              // Wait a bit for cookies to be set
              setTimeout(() => {
                console.log("Cookies after timeout:", document.cookie);
                console.log(
                  "Access token from service:",
                  tokenService.getAccessToken()
                );
                console.log(
                  "Refresh token from service:",
                  tokenService.getRefreshToken()
                );
              }, 100);

              toast({
                title: "Login successful",
                description: `Welcome back, ${res.user.name}!`,
              });
              console.log("Redirecting to home...");

              // Force a full page reload to ensure middleware picks up new cookies
              setTimeout(() => {
                window.location.href = "/";
              }, 500);
            } else {
              throw new Error("Invalid response from login");
            }
          } catch (err: any) {
            console.error("Login Error Details:", {
              error: err,
              message: err.message,
              response: err.response?.data,
              status: err.response?.status,
            });

            toast({
              title: "Login failed",
              description:
                err.response?.data?.message || "Google authentication failed",
              variant: "destructive",
            });
          }
        }}
        onError={() => {
          console.error("Google Login Error: An unknown error occurred.");
          toast({
            title: "Login failed",
            description: "Google login failed due to an unknown error.",
            variant: "destructive",
          });
        }}
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
}
