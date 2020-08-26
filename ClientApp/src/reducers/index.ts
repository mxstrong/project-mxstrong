import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { postsReducer } from "./postsReducer";
import { topicsReducer } from "./topicsReducer";
import { commentsReducer } from "./commentsReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  comments: commentsReducer,
  posts: postsReducer,
  topics: topicsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
