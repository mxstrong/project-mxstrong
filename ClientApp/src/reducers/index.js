import { reducer as formReducer } from "redux-form";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  form: formReducer,
});
