import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.primary.light,
    height: "100%",
    margin: 0,
  },
  fill: {
    flex: "0 1 600px",
  },
}));

interface IProps {
  children: React.ReactNode;
}

export default function Auth(props: IProps) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.fill}></div>
      {props.children}
      <div className={classes.fill}></div>
    </div>
  );
}
