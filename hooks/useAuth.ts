import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAuth, clearAuth } from "@/store/slices/authSlice";
import { authService, LoginResponse } from "@/services/auth.services";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (credential: string): Promise<LoginResponse> => {
      try {
        const response: LoginResponse = await authService.googleLogin(
          credential
        );

        // Dispatch the auth state to Redux
        dispatch(setAuth({ user: response.user }));

        // Return the response for the component to use
        return response;
      } catch (error) {
        console.error("Login failed:", error);
        // Make sure to clear auth state on failure
        dispatch(clearAuth());
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(clearAuth());
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear local state anyway
      dispatch(clearAuth());
    }
  }, [dispatch]);

  // Check authentication status on app load
  const checkAuth = useCallback(async () => {
    try {
      const isAuth = await authService.checkAuth();
      if (!isAuth && isAuthenticated) {
        // If server says not authenticated but local state says yes, clear it
        dispatch(clearAuth());
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (isAuthenticated) {
        dispatch(clearAuth());
      }
    }
  }, [dispatch, isAuthenticated]);

  // Optional: Check auth status periodically
  useEffect(() => {
    if (user) {
      checkAuth();

      // Set up periodic auth check (every 5 minutes)
      const interval = setInterval(checkAuth, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, checkAuth]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
  };
};
