import { UPDATE_USER, UDPATE_PROFILE } from "./types";
import {
  IUserLoginData,
  IUpdateUserAction,
  IUserProfile,
  IUpdateProfileAction,
} from "../helpers/types";
import { Dispatch } from "redux";
import { LOGIN_URL, CURRENT_USER_URL } from "../constants/urls";

function updateUser(user: string) {
  return {
    type: UPDATE_USER,
    user,
  };
}

function updateUserProfile(userProfile: IUserProfile) {
  return {
    type: UDPATE_PROFILE,
    userProfile,
  };
}

export function loginUser(user: IUserLoginData) {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const data = await response.json();
      const token = data.tokenString;
      dispatch(updateUser(token));
    } else {
      return Promise.reject();
    }
  };
}

export function loadUserProfile(userToken: string) {
  return async function (dispatch: Dispatch<IUpdateProfileAction>) {
    const response = await fetch(CURRENT_USER_URL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userToken,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const userProfile = await response.json();
      dispatch(updateUserProfile(userProfile));
    }
  };
}

export function logoutUser(userToken: string) {
  return async function (
    dispatch: Dispatch<IUpdateUserAction | IUpdateProfileAction>
  ) {
    const response = await fetch(LOGOUT_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userToken,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(updateUser(""));
      dispatch(updateUserProfile({ id: "", name: "", email: "" }));
    }
  };
}
