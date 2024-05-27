import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CredentialsState {
  name: string;
  token: string | null;
  id: string | null;
  expiration: number;
  clearOnLoad: boolean;
}

const initial: CredentialsState = {
  token: null,
  name: "",
  id: null,
  expiration: -1,
  clearOnLoad: true,
};

export const CredentialsSlice = createSlice({
  name: "Credentials",
  initialState: initial,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsState>) => {
      return action.payload;
    },
    reset: (state) => {
      return initial;
    },
  },
});

export const { setCredentials: setToken } = CredentialsSlice.actions;

export default CredentialsSlice.reducer;
