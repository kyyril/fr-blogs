import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { config } from "@/constants/config";

export const metadata: Metadata = {
  title: "Login - Blogify",
  description: "Login to your Blogify account",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>
        <GoogleOAuthProvider clientId={config.googleClientId}>
          <LoginForm />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
