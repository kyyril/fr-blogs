import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Helper function to get user from localStorage
const getUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

// Helper function to save user to localStorage
const saveUserToStorage = (user: User | null): void => {
  if (typeof window === "undefined") return;

  try {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

const initialState: AuthState = {
  isAuthenticated: false, // We'll check this via API call instead of token
  user: getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      // Persist user data to localStorage
      saveUserToStorage(action.payload.user);
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear user data from localStorage
      saveUserToStorage(null);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        saveUserToStorage(state.user);
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
