import { makeStyles } from "@material-ui/core/styles";

const backgroundColor = "#333333";
const hoverBackgroundColor = "#2b2b2b";
const color = "#d4d4d4";
const hoverColor = "orange";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    display: "flex",
    direction: "row",
  },
  IconButton: {
    position: "relative",
    backgroundColor: `${backgroundColor}`,
    color: `${color}`,
    transition: "0.6s",
    "&:hover": {
      backgroundColor: `${hoverBackgroundColor}`,
      color: `${hoverColor}`,
    },
  },
  MenuItem: {
    color: `${color}`,
    "&:hover": {
      color: `${hoverColor}`,
    },
  },
  MenuItemDisabled: {
    color: "grey",
  },
}));

export {useStyles}