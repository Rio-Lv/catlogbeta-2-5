import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
    loginButton: {
        position:'relative',
        fontWeight: "600",
        backgroundColor: "#1a1a1a",
        color: "#ffe1c8",
        paddingTop: "8px",
        paddingBottom:"8px",
        lineHeight: "16px",
        transition: "0.6s",
        "&:hover": {
          backgroundColor: "#111111",
          color: "orange",
        },
      },
  }));

  export {useStyles}