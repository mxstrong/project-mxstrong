import {
  UPDATE_USER,
  UPDATE_POSTS,
  UPDATE_TOPICS,
  UPDATE_TOPIC,
  SET_CURRENT_POST,
  UPDATE_COMMENTS,
} from "./types";
import {
  IUserLoginData,
  IUser,
  IUpdateUserAction,
  IUpdatePostsAction,
  IPost,
  ITopic,
  IUpdateTopicsAction,
  IPostFormData,
  IAddTopicAction,
  IEditPostData,
  ISetCurrentPostAction,
  AppThunk,
  IComment,
  IUpdateCommentsAction,
} from "../helpers/types";
import { Dispatch, Action } from "redux";
import {
  LOGIN_URL,
  CURRENT_USER_URL,
  FETCH_POSTS_URL,
  FETCH_TOPICS_URL,
  ADD_POST_URL,
  ADD_TOPIC_URL,
  EDIT_POST_URL,
  FETCH_COMMENTS_URL,
  LOGOUT_URL,
} from "../constants/urls";

function updateUser(user: IUser): IUpdateUserAction {
  return {
    type: UPDATE_USER,
    payload: user,
  };
}

function updatePosts(posts: IPost[]): IUpdatePostsAction {
  return {
    type: UPDATE_POSTS,
    payload: posts,
  };
}

function updateTopics(topics: ITopic[]): IUpdateTopicsAction {
  return {
    type: UPDATE_TOPICS,
    payload: topics,
  };
}

function addTopic(topic: ITopic): IAddTopicAction {
  return {
    type: UPDATE_TOPIC,
    payload: topic,
  };
}

function updateComments(comments: IComment[]): IUpdateCommentsAction {
  return {
    type: UPDATE_COMMENTS,
    payload: comments,
  };
}

export function setCurrentPost(post: IPost): ISetCurrentPostAction {
  return {
    type: SET_CURRENT_POST,
    payload: post,
  };
}

export function loginUser(user: IUserLoginData): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const response = await fetch(CURRENT_USER_URL, {
        method: "GET",
      });
      const user = await response.json();
      dispatch(updateUser(user));
    } else {
      return Promise.reject();
    }
  };
}

export function logoutUser(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(LOGOUT_URL, {
      method: "POST",
    });
    if (response.ok) {
      dispatch(updateUser({ userId: "", fullName: "", email: "", role: "" }));
    }
  };
}

export function fetchCurrentUser(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateUserAction>) {
    const response = await fetch(CURRENT_USER_URL, {
      method: "GET",
    });
    if (response.ok) {
      const user = await response.json();
      dispatch(updateUser(user));
    }
  };
}

export function fetchPosts(): AppThunk {
  return async function (dispatch: Dispatch<IUpdatePostsAction>) {
    const response = await fetch(FETCH_POSTS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const posts: IPost[] = await response.json();
    dispatch(updatePosts(posts));
  };
}

export function fetchCurrentPost(postId: string): AppThunk {
  return async function (dispatch: Dispatch<ISetCurrentPostAction>) {
    const response = await fetch(FETCH_POSTS_URL + "/" + postId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const post: IPost = await response.json();
    dispatch(setCurrentPost(post));
  };
}

export function fetchTopics(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateTopicsAction>) {
    const response = await fetch(FETCH_TOPICS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const topics = await response.json();
    dispatch(updateTopics(topics));
  };
}

export function addNewPost(post: IPostFormData): AppThunk {
  return async function (
    dispatch: Dispatch<IUpdatePostsAction | IAddTopicAction>
  ) {
    if (post.topic === "other" && post.otherTopic) {
      const response = await fetch(ADD_TOPIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: post.otherTopic,
        }),
      });
      if (response.ok) {
        const topic = await response.json();
        dispatch(addTopic(topic));
      }
    }

    const newPost = {
      title: post.title,
      topic: post.topic === "other" ? post.otherTopic : post.topic,
      body: post.body,
    };

    const response = await fetch(ADD_POST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
    if (response.ok) {
      const response = await fetch(FETCH_POSTS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const posts: IPost[] = await response.json();
      dispatch(updatePosts(posts));
    }
  };
}

export function editPost(post: IEditPostData): AppThunk {
  return async function (
    dispatch: Dispatch<IAddTopicAction | IUpdatePostsAction>
  ) {
    if (post.topic === "other" && post.otherTopic) {
      const response = await fetch(ADD_TOPIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: post.otherTopic,
        }),
      });
      if (response.ok) {
        const topic = await response.json();
        dispatch(addTopic(topic));
      }
    }

    const updatedPost = {
      postId: post.postId,
      title: post.title,
      topic: post.topic === "other" ? post.otherTopic : post.topic,
      body: post.body,
      userId: post.userId,
    };

    const response = await fetch(EDIT_POST_URL + "/" + post.postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    });

    if (response.ok) {
      const response = await fetch(FETCH_POSTS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const posts: IPost[] = await response.json();
      dispatch(updatePosts(posts));
    }
  };
}

export function fetchComments(postId: string): AppThunk {
  return async function (dispatch: Dispatch<IUpdateCommentsAction>) {
    const response = await fetch(FETCH_COMMENTS_URL + "/" + postId, {
      method: "GET",
    });
    if (response.ok) {
      const comments: IComment[] = await response.json();
      dispatch(updateComments(comments));
    }
  };
}
