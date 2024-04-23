import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CredentialsState {
  token: string | null;
  expiration: number;
  clearOnLoad : boolean;
}

const initial: CredentialsState = { token: null, expiration: -1, clearOnLoad: true };

export const CredentialsSlice = createSlice({
  name: "Credentials",
  initialState: initial,
  reducers: {
    setToken: (state, action: PayloadAction<CredentialsState>) => {
      return action.payload;
    },
    reset: (state) => {
      return initial;
    },
  },
});

export const { setToken } = CredentialsSlice.actions;

export default CredentialsSlice.reducer;
