import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { createMuiTheme } from '@material-ui/core/styles';

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  let theme = createMuiTheme({
    overrides: {
      MuiOutlinedInput: {
        root: {
          "& $notchedOutline": {
            borderColor: "white"
          },
          "&:hover $notchedOutline": {
            borderColor: "white"
          },
          "&$focused $notchedOutline": {
            borderColor: "white"
          }
        }
      }
    },
    palette: {
      primary: {
        light: '#4791db',
        main: '#3a8dff',
        dark: '#115293',
        black: "black",
        gray: "#BFC9DB"
      },
      secondary: {
        light: '#ffd95a',
        main: '#f9a825',
        dark: '#c17900',
        contrastText: '#212121',
      },
      message: {
        bubble: "#f4f6fa",
        messageBubbleLeft: `linear-gradient(225deg, #6cc1ff 0%, #3a8dff 100%)`,
        messageBubbleText: "#91a3c0",
        label: "#BECCE2"
      },
      background: {
        default: '#ffffff',
      },
      icon: {
        default: '#D1D9E6',
        online: "#1CED84"
      },
      notification: {
        default: "#3F92FF"
      }
    },
    typography: {
      useNextVariants: true,
      button: {
        textTransform: 'none'
      },
      h4: {
        fontSize: 26,
      },
      subtitle1: {
        fontSize: 19
      }
    },
    buttonHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      minHeight: '100vh',
      paddingTop: 23
    },
    box: {
      padding: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      maxWidth: 900,
      margin: 'auto'
    },
    noAccBtn: {
      color: '#b0b0b0',
      fontWeight: 400,
      textAlign: 'center',
      marginRight: 21,
      whiteSpace: 'nowrap'
    },
    welcome: {
      paddingBottom: 20,
      color: '#000000',
      fontWeight: 500
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={1} autoHideDuration={3000}>
        <BrowserRouter>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </BrowserRouter>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
