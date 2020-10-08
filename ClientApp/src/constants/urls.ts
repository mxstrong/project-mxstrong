export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://mxstrong.azurewebsites.net"
    : "https://localhost:5001";
export const CHECK_EMAIL_URL = BASE_URL + "/api/auth/emailTaken";
export const REGISTER_URL = BASE_URL + "/api/auth/register";
export const LOGIN_URL = BASE_URL + "/api/auth/login";
export const CURRENT_USER_URL = BASE_URL + "/api/auth/currentUser";
export const LOGOUT_URL = BASE_URL + "/api/auth/logout";
export const POSTS_URL = BASE_URL + "/api/posts";
export const TOPICS_URL = BASE_URL + "/api/topics";
export const COMMENTS_URL = BASE_URL + "/api/comments";
const GOALS_URL = BASE_URL + "/api/goals";
export const PROGRESS_BARS_URL = GOALS_URL + "/progressBars";
export const CHECKBOXES_URL = GOALS_URL + "/checkboxes";
export const DAY_COUNTERS_URL = GOALS_URL + "/dayCounters";
