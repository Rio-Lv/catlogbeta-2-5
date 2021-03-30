import React, { useEffect, useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { useStyles } from "./styles";

function MainMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
        typography: {
          fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
          fontSize: 16,
          fontWeightLight: 300,
          fontWeightRegular: 400,
          fontWeightMedium: 500,
        },
      }),
    [prefersDarkMode]
  );
  useEffect(() => {
    const array = [];
    const able = (enable) => {
      if (enable === true) {
        return classes.MenuItem;
      } else {
        return classes.MenuItemDisabled;
      }
    };
    props.menuItems.forEach((item) => {
      array.push(
        <MenuItem
          className={able(item.type === "public" || props.user !== null)}
          onClick={() => {
            handleClose();

            // only open account setting if user is present
            if (item.type === "public") {
              props.setSelected(item.name);
            }
            if (item.type === "account") {
              if (props.user !== null) {
                props.setSelected(item.name);
              } else {
                console.log("no user detected");
              }
            }
          }}
        >
          {item.name}
        </MenuItem>
      );
    });
    setMenuItems(array);
  }, [props,classes.MenuItem,classes.MenuItemDisabled]);

  return (
    <div style={{position:'fixed',left:'5px',top:'5px'}}>
      <ThemeProvider theme={theme}>
        <IconButton 
          className={classes.IconButton}
          variant="contained"
          aria-controls="simple-menu"
          aria-haspopup="true"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
          size ="small"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {menuItems}
        </Menu>
      </ThemeProvider>
    </div>
  );
}

export default MainMenu;
