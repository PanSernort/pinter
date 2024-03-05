import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthAuthoriza, AuthReg, AuthState } from "./types/AuthState";
import * as api from "../../App/api";
import { User } from "../users/types/User";

const initialState: AuthState = {
  user: undefined,
  error: undefined,
};


export const registration = createAsyncThunk(
  "auth/registration",
  (value: AuthReg) => api.registrationAxios(value),
);
export const authorization = createAsyncThunk(
  "auth/authorization",
  (value: AuthAuthoriza) => api.authorizationAxios(value),
);
export const checkAuth = createAsyncThunk("auth/check", async () => {
  try {
    const data = await api.checkAuthAxios();
    return data;
  } catch (message) {
    console.log(message);
  }
});

export const logOut = createAsyncThunk("auth/logout", () => api.logOutAxios());

export const updProfile = createAsyncThunk("auth/updProfile", (value: User) => api.updUserProfileAxios(value));

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(registration.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(authorization.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        if(!action.payload?.name) {
          localStorage.removeItem('user');
          localStorage.clear();
        }
        
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = undefined;
        localStorage.removeItem('user');
        localStorage.clear();
      })
      .addCase(updProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
