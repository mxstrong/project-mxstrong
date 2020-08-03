import React, {
  useEffect,
  FunctionComponent,
  ComponentType,
  useState,
} from "react";
import { Paper, makeStyles, Theme, Button, MenuItem } from "@material-ui/core";
import { renderTextField } from "../helpers/formHelpers";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { fetchTopics, addNewPost } from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import { ITopic, IPostFormData, IIndexable } from "../helpers/types";
import { Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
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
}));

const validate = (values: IPostFormData) => {
  const errors: IErrors = {};
  const requiredFields: string[] = ["title", "body"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (values.topic === "other" && !values["otherTopic"]) {
    errors["otherTopic"] = "You must specify other topic";
  }

  return errors;
};

type IErrors = IIndexable & {
  title?: string;
  topic?: string;
  otherTopic?: string;
  body?: string;
};

function AddPost(props: InjectedFormProps<IPostFormData, {}>) {
  const classes = useStyles();
  const { handleSubmit, pristine, submitting } = props;
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);
  const [cookies] = useCookies(["user"]);
  const userCookie = cookies["user"];
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchTopics());
  }, []);

  const topics = useSelector((state: AppState) => state.topics);
  const topic = useSelector(
    (state: AppState) => state.form.PostForm?.values?.topic
  );

  if (!user && !userCookie) {
    return <Redirect to="/posts" />;
  }

  if (success) {
    return <Redirect to="/posts" />;
  }

  return (
    <Paper className={classes.paper}>
      <form
        className={classes.form}
        onSubmit={handleSubmit((values, dispatch) => {
          dispatch(addNewPost(values));
          setSuccess(true);
        })}
      >
        <Field
          className={classes.input}
          name="title"
          component={renderTextField}
          label="Title"
          variant="outlined"
        />
        <Field
          select
          className={classes.input}
          name="topic"
          component={renderTextField}
          label="Topic"
          variant="outlined"
        >
          <MenuItem value="">None</MenuItem>
          {topics.map((topic: ITopic) => (
            <MenuItem value={topic.name}>{topic.name}</MenuItem>
          ))}
          <MenuItem value="other">Other</MenuItem>
        </Field>
        {topic === "other" ? (
          <Field
            className={classes.input}
            name="otherTopic"
            component={renderTextField}
            label="Other Topic"
            variant="outlined"
          />
        ) : (
          ""
        )}
        <Field
          className={classes.input}
          name="body"
          component={renderTextField}
          label="Body"
          multiline
          variant="outlined"
        />
        <div>
          <Button
            className={classes.button}
            type="submit"
            disabled={pristine || submitting}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
          <Button
            to="/posts"
            className={classes.button}
            component={Link}
            color="secondary"
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Paper>
  );
}

export default reduxForm({
  form: "PostForm",
  validate,
})(AddPost);
