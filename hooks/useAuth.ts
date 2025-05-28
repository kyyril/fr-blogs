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
    async (credential: string) => {
      try {
        const response: LoginResponse = await authService.googleLogin(
          credential
        );
        dispatch(setAuth({ user: response.user }));
        return response;
      } catch (error) {
        console.error("Login failed:", error);
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
