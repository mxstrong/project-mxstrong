import { UPDATE_USER } from "../actions/types";
import { IUpdateUserAction } from "../helpers/types";
import { Reducer } from "redux";

export const initialState = {
  user: { userId: "", fullName: "", email: "", role: "" },
};

export const authReducer: Reducer<typeof initialState, IUpdateUserAction> = (
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
    default:
      return state;
  }
};
