import {
  IPost,
  IUpdatePostsAction,
  ITopic,
  IUpdateTopicsAction,
  IAddTopicAction,
  IComment,
  IUpdateCommentsAction,
  ISetCurrentPostAction,
  AppThunk,
  IPostFormData,
  IEditPostData,
} from "../helpers/types";
import {
  UPDATE_POSTS,
  UPDATE_TOPICS,
  UPDATE_TOPIC,
  UPDATE_COMMENTS,
  SET_CURRENT_POST,
} from "./types";
import { Dispatch } from "redux";
import { POSTS_URL, TOPICS_URL, COMMENTS_URL } from "../constants/urls";

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

export function fetchPosts(): AppThunk {
  return async function (dispatch: Dispatch<IUpdatePostsAction>) {
    const response = await fetch(POSTS_URL, {
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
    const response = await fetch(POSTS_URL + "/" + postId, {
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
    const response = await fetch(TOPICS_URL, {
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
      const response = await fetch(TOPICS_URL, {
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

    const response = await fetch(POSTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
    if (response.ok) {
      const response = await fetch(POSTS_URL, {
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
      const response = await fetch(TOPICS_URL, {
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

    const response = await fetch(POSTS_URL + "/" + post.postId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPost),
    });

    if (response.ok) {
      const response = await fetch(POSTS_URL, {
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
    const response = await fetch(COMMENTS_URL + "/" + postId, {
      method: "GET",
    });
    if (response.ok) {
      const comments: IComment[] = await response.json();
      dispatch(updateComments(comments));
    }
  };
}
