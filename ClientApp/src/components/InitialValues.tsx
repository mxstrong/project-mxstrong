import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";
import EditPost from "./EditPost";
import { IPostFormData } from "../helpers/types";

export default function InitialValues() {
  const post = useSelector((state: AppState) => state.posts.currentPost);

  const postFormValues: IPostFormData = {
    title: post ? post.title : "",
    topic: post ? post.topic : "",
    otherTopic: "",
    body: post ? post.body : "",
  };

  return <EditPost initialValues={postFormValues} />;
}
