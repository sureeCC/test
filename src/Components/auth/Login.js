import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../Components/Footer";
import { loginEndpoint } from "../../Config/Endpoints";
import { getToken, setUserSession } from "../../Utils/AppExtensions";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, []);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(false);
    setEmailError(false);

    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    const payload = {
      email: email,
      password: password,
    };

    if (email && password) {
      axios
        .post(loginEndpoint, payload)
        .then((response) => {
          console.warn(response);
          if (response.status === 200) {
            setUserSession(response.data.token, response.data.user);
            navigate("/dashboard");
          } else {
            toast.error("Something went wrong, please try again later!");
          }
        })
        .catch((e) => {
          console.error(e.response);
          if (e.response.status === 401)
            toast.error("Invalid email/password");
          // toast.error(e.response.data.message);
        });
    }

    if (email === "") setEmailError(true);

    if (password === "") setPasswordError(true);
  };

  return (
    <Box>
      <div className="login-fields">
        <Box className="inner-panel">
          <Box>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <img width="100" src="../../igs_logo.png" />
              <p className="test-viz-logo" color="primary" variant="h5">
                Test-Viz
              </p>
            </Stack>
          </Box>
          <p className="welcome-text" sx={{ mt: 3 }}>
            Welcome Back
          </p>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              width: 500,
            }}
          >
            <TextField
              name="email"
              margin="normal"
              label="Email"
              placeholder="your_name@example.com"
              required
              fullWidth
              autoFocus
              error={emailError}
              helperText={
                emailError
                  ? "Email field is either blank or you have not entered the valid email"
                  : ""
              }
            />
            <TextField
              name="password"
              margin="normal"
              label="Password"
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              error={passwordError}
              helperText={passwordError ? "Please Enter the Password" : ""}
              InputProps={{
                // <-- This is where the toggle button is added.
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Link to="/forgot-password" className="forgot-password-label">
              Forgot Password?
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 4 }}
            >
              Log In
            </Button>
          </Box>
          {/* <p className="sign-up-label">
            Don't have an account?
            <Link style={{ textDecoration: "none" }} to="/sign-up">
              Sign-up
            </Link>{" "}
          </p> */}
          <Footer />
        </Box>
      </div>
      <div className="image"></div>
    </Box>
  );
};

export default Login;
