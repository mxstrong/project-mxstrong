import { UPDATE_USER, UPDATE_PROFILE } from "../actions/types";
import { AuthActionTypes } from "../helpers/types";
import { Reducer } from "redux";

export const initialState = {
  user: "",
  userProfile: { userId: "", fullName: "", email: "", role: "" },
};

export const authReducer: Reducer<typeof initialState, AuthActionTypes> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UPDATE_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }

    case UPDATE_PROFILE: {
      return {
        ...state,
        userProfile: action.payload,
      };
    }
    default:
      return state;
  }
};
