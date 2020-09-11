import { ListItem, FormControlLabel, Checkbox } from "@material-ui/core";
import React from "react";
import { IGoal } from "../../helpers/types";

interface IProps {
  goal: IGoal;
}

export default function CheckBox(props: IProps) {
  const { goal } = props;

  function handleClick() {}

  return (
    <ListItem button onClick={handleClick}>
      <FormControlLabel
        control={<Checkbox checked={goal.progress === 100} color="primary" />}
        label={goal.text}
      />
    </ListItem>
  );
}
