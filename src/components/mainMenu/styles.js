import { makeStyles } from "@material-ui/core/styles";

const backgroundColor = "#1a1a1a";
const hoverBackgroundColor = "#111111";
const color = "#fff6ee";
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
      backgroundColor: `${hoverBackgroundColor}`,
      color: `${hoverColor}`,
    },
  },
  MenuItemDisabled: {
    color: "grey",
  },
}));

export {useStyles}