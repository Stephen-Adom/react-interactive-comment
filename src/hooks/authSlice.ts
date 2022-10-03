import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUserType } from "./states";

// Define a type for the slice state
interface authState {
  authUser: AuthUserType | null;
}

// Define the initial state using that type
const initialState: authState = {
  authUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    saveAuthState: (state, action: PayloadAction<AuthUserType>) => {
      state.authUser = action.payload;
    },

    resetAuthState: (state) => {
      state.authUser = null;
    },
  },
});

export const { saveAuthState, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
