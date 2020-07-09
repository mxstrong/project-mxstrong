import React from "react";
import { Typography, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3">Dashboard</Typography>
    </div>
  );
}
