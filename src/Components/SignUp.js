import {
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { rolesEndPoint, testersEndPoint } from "../Config/Endpoints";
import { validateEmail, validateMobileNumber } from "../Utils/AppExtensions";

export default function SignUp(props) {
  const navigate = useNavigate();
  const userRole = props.userRole

  const [firstNameError, setFirstNameError] = React.useState(false);
  const [mobileError, setmobileError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);

  const [roleError, setRoleError] = React.useState(false);
  const [roles, setRoles] = React.useState([]);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFirstNameError(false);
    setmobileError(false);
    setEmailError(false);
    setPasswordError(false);
    setRoleError(false);

    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const mobile = data.get("mobile");
    const email = data.get("email");
    const password = data.get("password");
    const isActive = data.get("isActive");
    const role = data.get("role");

    if (
      firstName &&
      mobile &&
      email &&
      password &&
      role &&
      validateMobileNumber(mobile) &&
      validateEmail(email)
    ) {
      const signupData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: mobile,
        email: email,
        password: password,
        is_active: isActive,
        role_id: role,
      };

      axios
        .post(testersEndPoint, signupData)
        .then((response) => {
          console.log(response);
          navigate("/assign-projects", { state: { user: response.data.data } });
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    }

    if (firstName === "") setFirstNameError(true);

    if (mobile === "") {
      setmobileError(true);
    }

    if (email === "") setEmailError(true);

    if (password === "") setPasswordError(true);
    if (role === "") setRoleError(true);
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(rolesEndPoint);
      console.log("Roles-Data", response.data.data);
      setRoles(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getRoles()
  }, []);

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <div>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={() => navigate(-1)} variant="outlined">
                  <KeyboardBackspaceSharpIcon />
                </Button>
              </Grid>
              <Grid item>
                <p className="heading">Add New User</p>
              </Grid>
            </Grid>
          </div>
          <div>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save and Next
            </Button>
          </div>
        </Stack>
      </div>

      <Paper sx={{ p: 5, minWidth: 500 }}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <RadioGroup row name="isActive" defaultValue={true}>
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Active"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Not Active"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoFocus
                  placeholder="Enter your email address"
                  autoComplete="email"
                  error={emailError}
                  helperText={
                    emailError
                      ? "Email Id is mandatory and must be Valid email"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="mobile"
                  label="Mobile Number"
                  name="mobile"
                  placeholder="Enter your Mobile Number"
                  type="number"
                  error={mobileError}
                  helperText={
                    mobileError
                      ? "Mobile number is mandatory and must be 10 digits"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  placeholder="Enter your first name"
                  label="First Name"
                  error={firstNameError}
                  helperText={firstNameError ? "First Name is mandatory" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="role"
                  required
                  fullWidth
                  select // tell TextField to render select
                  label="Role"
                  error={roleError}
                  helperText={roleError ? "Role is mandatory" : ""}
                >
                  {roles.map(item => {
                    return (
                      <MenuItem value={item.id}>{item.display_name}</MenuItem>
                    )
                  })}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  error={passwordError}
                  helperText={emailError ? "Password is Mandatory" : ""}
                  InputProps={{
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
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
