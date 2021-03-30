import { makeStyles } from "@material-ui/core/styles";
const marginRight = '20px';
const marginTop = '20px';
const useStyles = makeStyles((theme) => ({
    loginButton: {
        position:'relative',
        fontWeight: "600",
        backgroundColor: "#333333",
        color: "#d4d4d4",
        paddingTop: "8px",
        paddingBottom:"8px",
        lineHeight: "16px",
        transition: "0.6s",
        "&:hover": {
          backgroundColor: "#2b2b2b",
          color: "orange",
        },
      },
  }));

  export {useStyles}