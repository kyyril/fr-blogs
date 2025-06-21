import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types/data.interface";

interface AuthState {
  isAuthenticated: boolean;
  user: Partial<User> | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: Partial<User> }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isLoading = false;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, updateUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
