import { createTheme, ThemeProvider } from "@mui/material";
import axios from "axios";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { getToken, removeUserSession } from "./Utils/AppExtensions";

axios.interceptors.request.use(
  (req) => {
    // Add configurations here
    const token = getToken();
    req.headers.Authorization = token ? `Bearer ${token}` : "";
    return req;
  },
  (err) => {
    //console.log("interceptors-request", err);
    return Promise.reject(err);
  }
);
// For POST requests
axios.interceptors.response.use(
  (res) => {
    //console.warn("intercept-response", res);
    // Add configurations here
    if (res.status === 200) {
      //console.log('Posted Successfully');
    } else if (res.status === 404) console.log("unauthorised");
    return res;
  },
  (err) => {
    //console.warn("interceptors-response", err.response);
    if (err.response.status === 401) {
      //alert("Session Expired, unauthorised")
      if ("/login" !== window.location.pathname) {
        window.location.href = "/login";
        removeUserSession();
      }
    } else if (err.response.status === 404) {
      //alert("API NOT Found")
    }
    else if (err.response.status === 403) {
      //toast.error("Access Denied")
    }
    return Promise.reject(err);
  }
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a2668",
      portGore: "#302752",
      veniceBlue: "#06527e",
      mySin: "#ffb421",
      flamingo: "#f16629",
    },
    secondary: {
      main: "#6294ba",
      balticSea: "#171518",
      midGray: "#636468",
      iron: "#d8dgdg",
      ziggurat: "#b4ccde",
    },
    danger: {
      main: "#df4759",
    },
  },
  typography: {
    fontFamily: ["arial", "serif"].join(","),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
