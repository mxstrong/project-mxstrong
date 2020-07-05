import { UPDATE_USER } from "./types";
import { IUserLoginData, IUpdateUserAction } from "../helpers/types";
import { Dispatch } from "redux";
import { LOGIN_URL } from "../constants/urls";

function updateUser(user: string) {
  return {
    type: UPDATE_USER,
    user,
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
