import {
  AppThunk,
  IUser,
  IUpdateUserAction,
  IUserLoginData,
} from "../helpers/types";
import { UPDATE_USER } from "./types";
import { Dispatch } from "redux";
import {
  LOGIN_URL,
  CURRENT_USER_URL,
  LOGOUT_URL,
  GOOGLE_LOGIN_URL,
} from "../constants/urls";

function updateUser(user: IUser): IUpdateUserAction {
  return {
    type: UPDATE_USER,
    payload: user,
  };
}

export function loginUser(user: IUserLoginData): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const response = await fetch(CURRENT_USER_URL, {
        method: "GET",
      });
      const user = await response.json();
      dispatch(updateUser(user));
    } else {
      return Promise.reject();
    }
  };
}

export function loginWithGoogle(idToken: string): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(GOOGLE_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: idToken,
    });
    if (response.ok) {
      const response = await fetch(CURRENT_USER_URL, {
        method: "GET",
      });
      const user = await response.json();
      dispatch(updateUser(user));
    } else {
      return Promise.reject();
    }
  };
}

export function logoutUser(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(LOGOUT_URL, {
      method: "POST",
    });
    if (response.ok) {
      dispatch(updateUser({ userId: "", fullName: "", email: "", role: "" }));
    }
  };
}

export function fetchCurrentUser(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(CURRENT_USER_URL, {
      method: "GET",
    });
    if (response.ok) {
      const user = await response.json();
      dispatch(updateUser(user));
    }
  };
}
