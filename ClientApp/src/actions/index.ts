import {
  UPDATE_USER,
  UPDATE_POSTS,
  UPDATE_TOPICS,
  UPDATE_PROFILE,
  UPDATE_POST,
  UPDATE_TOPIC,
  SET_CURRENT_POST,
} from "./types";
import {
  IUserLoginData,
  IUpdateUserAction,
  IUserProfile,
  IUpdateProfileAction,
  IUpdatePostsAction,
  IPost,
  ITopic,
  IUpdateTopicsAction,
  IPostFormData,
  IAddPostAction,
  IAddTopicAction,
  IEditPostData,
  ISetCurrentPostAction,
  AppThunk,
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
} from "../constants/urls";

function updateUser(user: string): IUpdateUserAction {
  return {
    type: UPDATE_USER,
    payload: user,
  };
}

function updateUserProfile(userProfile: IUserProfile): IUpdateProfileAction {
  return {
    type: UPDATE_PROFILE,
    payload: userProfile,
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

function addPost(post: IPost): IAddPostAction {
  return {
    type: UPDATE_POST,
    payload: post,
  };
}

function addTopic(topic: ITopic): IAddTopicAction {
  return {
    type: UPDATE_TOPIC,
    payload: topic,
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
      const data = await response.json();
      const token = data.tokenString;
      dispatch(updateUser(token));
    } else {
      return Promise.reject();
    }
  };
}

export function loadUser(userToken: string) {
  return function (dispatch: Dispatch<IUpdateUserAction>) {
    dispatch(updateUser(userToken));
  };
}

export function loadUserProfile(userToken: string) {
  return async function (dispatch: Dispatch<IUpdateProfileAction>) {
    const response = await fetch(CURRENT_USER_URL, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userToken,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const userProfile = await response.json();
      dispatch(updateUserProfile(userProfile));
    }
  };
}

export function logoutUser() {
  return function (
    dispatch: Dispatch<IUpdateUserAction | IUpdateProfileAction>
  ) {
    dispatch(updateUser(""));
    dispatch(
      updateUserProfile({ userId: "", fullName: "", email: "", role: "" })
    );
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

export function addNewPost(post: IPostFormData, userToken: string): AppThunk {
  return async function (
    dispatch: Dispatch<IUpdatePostsAction | IAddTopicAction>
  ) {
    if (post.topic === "other" && post.otherTopic) {
      const response = await fetch(ADD_TOPIC_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
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
        Authorization: "Bearer " + userToken,
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

export function editPost(post: IEditPostData, userToken: string): AppThunk {
  return async function (
    dispatch: Dispatch<IAddTopicAction | IUpdatePostsAction>
  ) {
    if (post.topic === "other" && post.otherTopic) {
      const response = await fetch(ADD_TOPIC_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + userToken,
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
