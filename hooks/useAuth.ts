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

        // Set auth state in Redux
        dispatch(setAuth({ user: response.user }));

        return response;
      } catch (error) {
        console.error("Login failed:", error);
        dispatch(clearAuth());
        throw error;
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always clear local state
      dispatch(clearAuth());
    }
  }, [dispatch]);

  // Initialize auth state from server
  const initializeAuth = useCallback(async () => {
    try {
      const response = await authService.getMe();
      dispatch(setAuth({ user: response.user }));
    } catch (error) {
      console.error("Auth initialization failed:", error);
      dispatch(clearAuth());
    }
  }, [dispatch]);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await authService.getMe();

      // Update Redux state if we got user data
      if (response.user) {
        dispatch(setAuth({ user: response.user }));
        return true;
      } else {
        dispatch(clearAuth());
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      dispatch(clearAuth());
      return false;
    }
  }, [dispatch]);

  // Initialize authentication on hook mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Set up periodic auth check and token refresh
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAuthenticated) {
      // Check auth every 10 minutes
      interval = setInterval(async () => {
        try {
          await authService.getMe();
        } catch (error) {
          console.error("Periodic auth check failed:", error);
          dispatch(clearAuth());
        }
      }, 10 * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, dispatch]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
    checkAuth,
    initializeAuth,
  };
};
