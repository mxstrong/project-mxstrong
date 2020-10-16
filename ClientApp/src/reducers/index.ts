import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { postsReducer } from "./postsReducer";
import { topicsReducer } from "./topicsReducer";
import { commentsReducer } from "./commentsReducer";
import { goalsReducer } from "./goalsReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  comments: commentsReducer,
  goals: goalsReducer,
  posts: postsReducer,
  topics: topicsReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
