import { reducer as formReducer } from "redux-form";
import { combineReducers } from "redux";
import { authReducer } from "./authReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
