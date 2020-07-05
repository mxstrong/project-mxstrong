import { AppState } from ".";
import { UPDATE_USER } from "../actions/types";
import { IUpdateUserAction } from "../helpers/types";

export const initialState = {
  auth: {
    user: "",
  },
  form: {},
};

export function authReducer(state = initialState, action: IUpdateUserAction) {
  switch (action.type) {
    case UPDATE_USER:
      return Object.assign({}, state, {
        user: action.user,
      });
    default:
      return state;
  }
}
