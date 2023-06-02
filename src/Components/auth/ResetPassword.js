import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer";
import { resetPasswordUrl } from "../../Config/index";
import "./Auth.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.warn(resetPasswordUrl + location.state.token);

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
            Email has been sent!
          </p>
          <Typography sx={{ width: 400, textAlign: "center" }}>
            Please check your inbox and click on the recived link to reset the
            password.
          </Typography>
          <Box
            sx={{
              width: 500,
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 4 }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Box>
          <p className="sign-up-label">
            Didn't receive the link?
            <Link style={{ textDecoration: "none" }} to="/forgot-password">
              Resend
            </Link>{" "}
          </p>
          <Footer />
        </Box>
      </div>
      <div className="image"></div>
    </Box>
  );
};

export default ResetPassword;
