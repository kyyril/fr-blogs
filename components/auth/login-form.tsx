"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth"; // Import the useAuth hook

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <div className="space-y-6">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const idToken = credentialResponse.credential;
          if (!idToken) {
            toast({
              title: "Login failed",
              description: "No credential received from Google.",
              variant: "destructive",
            });
            return;
          }

          try {
            // Use the login function from useAuth hook instead of calling authService directly
            const res = await login(idToken);
            toast({
              title: "Login successful",
              description: `Welcome back, ${res.user.name}!`,
            });
            router.push("/");
          } catch (err) {
            toast({
              title: "Login failed",
              description: "Google authentication failed",
              variant: "destructive",
            });
            console.error("Login Error:", err);
          }
        }}
        onError={() => {
          toast({
            title: "Login failed",
            description: "Google login error",
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
