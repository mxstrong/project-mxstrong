import React from 'react';
import { makeStyles, Paper, TextField, Button, Typography, } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.light,
    height: '100%',
    margin: 0
  },
  fill: {
    flex: '0 1 600px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    margin: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing,
    height: '60%',
    flex: '1 0 200px'
  },
  text: {
    textAlign: 'center',
    margin: theme.spacing(2)
  },
  button: {
    width: '80%'
  }
}));

export default function Login() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.fill}></div>
      <Paper className={classes.paper}>
        <Typography className={classes.text} variant="h3">
          Sign In
        </Typography>
        <form className={classes.form}>
          <TextField className={classes.input} label="Email" variant="outlined" />
          <TextField className={classes.input} label="Password" variant="outlined" />
          <Button className={classes.button} variant="contained" color="primary">
            Login
          </Button>
        </form>
        <Typography className={classes.text} variant="body2">Not our user yet? [placeholder]</Typography>
      </Paper>
      <div className={classes.fill}></div>
    </div>
  );
}