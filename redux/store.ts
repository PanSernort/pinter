import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authSlice from "../components/auth/authSlice";
import partySlice from "../components/party/partySlice";
import roomSlice from "../components/room/roomSlice";
import profileSlice from "../components/profile/profileSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    party: partySlice,
    room: roomSlice,
    profile: profileSlice,
  },
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: <T>(fn: (state: RootState) => T) => T =
  useSelector;

export type RootState = ReturnType<typeof store.getState>;
export default store;
