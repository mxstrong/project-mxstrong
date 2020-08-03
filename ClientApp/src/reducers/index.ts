import { reducer as formReducer } from "redux-form";
import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { postsReducer } from "./postsReducer";
import { topicsReducer } from "./topicsReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer,
  posts: postsReducer,
  topics: topicsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
