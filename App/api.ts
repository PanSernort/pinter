import axios from "axios";
import type { User, UserId } from "../components/users/types/User";
import { AuthAuthoriza, AuthReg } from "../components/auth/types/AuthState";
import { Party } from "../components/party/types/PartyState";
import {
  Access,
  Access_Table,
  CreateRoomWithTest,
  Room,
  RoomTest,
} from "../components/room/types/RoomState";
import { UserPartyRoomId } from "../components/profile/types/UserParties";

// auth + users
export const registrationAxios = async (value: AuthReg): Promise<User> => {
  const { data }: { data: User } = await axios.post("/api/auth/sign-up", {
    data: value,
  });
  if (!data.message) {
    return data;
  }
  throw new Error(data.message);
};

export const authorizationAxios = async (
  value: AuthAuthoriza,
): Promise<User> => {
  const { data }: { data: User } = await axios.post("/api/auth/sign-in", {
    data: value,
  });
  if (!data.message) {
    return data;
  }
  throw new Error(data.message);
};

export const checkAuthAxios = async (): Promise<User> => {
  const { data }: { data: { user: User } } = await axios.get("/api/auth/check");
  return data.user;
};

export const logOutAxios = async (): Promise<void> => {
  try {
    await axios.get("/api/auth/logout");
  } catch (error) {
    console.log(error);
  }
};
export const updUserProfileAxios = async (value: User): Promise<User> => {
  const { data }: { data: User } = await axios.put('/api/users/profile', {
    data: value,
  });
  return data;
}

//access_tables

export const access_tablesAxios = async (): Promise<Access_Table[]> => {
  const { data }: { data: Access_Table[] } = await axios.get(
    "/api/room/access_tables",
  );
  return data;
};

//party

export const allPartyAxios = async (): Promise<Party[]> => {
  const { data }: { data: Party[] } = await axios.get("/api/party");
  return data;
};

//room

export const allRoomsDialogue = async (
  partyId: string | undefined,
): Promise<Room[]> => {
  const { data }: { data: Room[] } = await axios.get(`api/room/${partyId}`);
  return data;
};

export const createRoomDialogue = async (
  roomWithTest: CreateRoomWithTest,
): Promise<Room> => {
  const { data } = await axios.post("/api/room/roomDialogue", {
    data: roomWithTest,
  });
  return data;
};

//test

export const passTheTest = async (test: RoomTest): Promise<Access> => {
  const { data } = await axios.post("/api/room/test", {
    data: test,
  });
  return data;
};

// userpartyRooms

export const userPartyRooms = async (id: UserId) => {
  const { data } = await axios(`/api/users/parties/${id}`);
  return data;
};

export const deleteUserPartyRoom = async (id: UserPartyRoomId) => {
  const { data } = await axios.delete(`api/users/room/${id}`);
  console.log(data);
  
  return data;
};