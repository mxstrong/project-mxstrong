import { AppState } from ".";
import { UPDATE_USER, UPDATE_PROFILE } from "../actions/types";
import {
  IUpdateUserAction,
  IUpdateProfileAction,
  AuthActionTypes,
} from "../helpers/types";

export const initialState = {
  user: "",
  userProfile: { id: "", name: "", email: "" },
};

export function authReducer(state = initialState, action: AuthActionTypes) {
  switch (action.type) {
    case UPDATE_USER:
      return Object.assign({}, state, {
        user: action.user,
      });
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        userProfile: action.userProfile,
      });
    default:
      return state;
  }
}
