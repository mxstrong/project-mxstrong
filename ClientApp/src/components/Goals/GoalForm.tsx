import React from "react";
import { Form, Field, Formik, FormikHelpers } from "formik";
import {
  Button,
  makeStyles,
  Theme,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { TextField } from "formik-material-ui";
import { IGoalFormData, IGoal, IIndexable } from "../../helpers/types";
import { GOALS_URL } from "../../constants/urls";
import { fetchGoals } from "../../actions/goals";

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  title: {
    textAlign: "center",
  },
}));

const validate = (values: IGoalFormData) => {
  const errors: IErrors = {};
  const requiredFields: string[] = ["text", "type"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  return errors;
};

type IErrors = IIndexable & {
  text?: string;
  type?: string;
};

interface IGoalFormProps {
  initialValues: IGoalFormData;
  open: boolean;
  handleClose: () => void;
  handleSubmit: (
    values: IGoalFormData,
    helpers: FormikHelpers<IGoalFormData>
  ) => Promise<void>;
  formType: string;
}

export default function GoalForm(props: IGoalFormProps) {
  const { handleClose, handleSubmit, open, initialValues, formType } = props;
  const classes = useStyles();

  return (
    <Dialog open={open} aria-labelledby="add-goal-dialog" onClose={handleClose}>
      <DialogTitle className={classes.title}>{formType}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {({ isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                className={classes.input}
                name="text"
                component={TextField}
                label="Text"
                variant="outlined"
              />
              <Field
                className={classes.input}
                name="type"
                component={TextField}
                label="Type"
                variant="outlined"
                select
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Progress bar">Progress Bar</MenuItem>
                <MenuItem value="Checkbox">Checkbox</MenuItem>
              </Field>
              <div>
                <Button
                  className={classes.button}
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={props.handleClose}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}