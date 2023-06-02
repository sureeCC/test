import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyDomainEndPoint } from "../Config/Endpoints";
import { domainLink } from "../Config/index";
import Footer from "./Footer";

const DomainCheck = () => {
  const [domainNameError, setDomainNameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setDomainNameError(false);

    const data = new FormData(event.currentTarget);
    const domainName = data.get("domain");

    if (domainName) {
      console.log("test");
      axios
        .get(verifyDomainEndPoint(domainName))
        .then((response) => {
          console.log(response.status);
          if (response.status === 200) {
            console.log("success");
            // window.open(domainName+'.local-dev:3000/')
            // window.location.replace(domainName+'.local-dev:3000/login');
            window.open("http://" + domainName + domainLink);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400)
          //toast.error(error.response.data.message);
          {
            setDomainNameError(true)
            setErrorMessage(error.response.data.message)
          }
        });
    }

    if (domainName === "") {
      setDomainNameError(true);
      setErrorMessage("Domain Name is Mandatory")
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
            Please enter the domain
          </p>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              width: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              name="domain"
              id="domain"
              required
              fullWidth
              placeholder="Enter Domain"
              label="Domain Name"
              autoFocus
              error={domainNameError}
              helperText={domainNameError ? errorMessage : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">.testviz.io</InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Continue
            </Button>
          </Box>
          {/* <Link
            className="sign-up-label"
            style={{ textDecoration: "none" }}
            to="/"
          >
            Back to Registration
          </Link> */}
          <Footer />
        </Box>
      </div>
      <div className="image"></div>
    </Box>
  );
};

export default DomainCheck;
