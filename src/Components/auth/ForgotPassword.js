import {
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPasswordEndPoint } from "../../Config/Endpoints";
import { validateEmail } from "../../Utils/AppExtensions";
import "./Auth.css";
import Footer from "../../Components/Footer";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailError(false);

    const data = new FormData(e.currentTarget);
    const email = data.get("email");

    const formData = {
      email: email,
    };

    if (email && validateEmail(email)) {
      console.log(formData);
      axios
        .post(forgotPasswordEndPoint, formData)
        .then((response) => {
          console.log(response.data.debug.reset_link);
          if (response.status === 200) {
            navigate("/reset-password", {
              state: { token: response.data.debug.reset_link },
            });
          } else toast.info("Something went wrong, please try again later!");
        })
        .catch((error) => {
          console.error(error.response.data);
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.info("Something went wrong, please try again later!");
          }
        });
    }

    if (email === "") {
      setEmailError(true);
    }
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
            Forgot Password?
          </p>
          <Typography sx={{ width: 400, textAlign: "center" }}>
            Enter the email associated with your account and we’ll send an email
            with instructions to reset your password.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              width: 500,
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={emailError}
              helperText={
                emailError
                  ? "Email field is either blank or you have not entered the valid email"
                  : ""
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 4 }}
            >
              Send Instructions
            </Button>
          </Box>
          <Link
            className="sign-up-label"
            style={{ textDecoration: "none" }}
            to="/login"
          >
            Back to Login
          </Link>
          <Footer />
        </Box>
      </div>
      <div className="image"></div>
    </Box>
  );
};

export default ForgotPassword;
