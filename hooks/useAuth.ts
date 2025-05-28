import { useCallback } from "react";
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

  const logout = useCallback(() => {
    authService.logout();
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
};
