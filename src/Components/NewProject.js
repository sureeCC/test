import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { projectsEndpoint } from "../Config/Endpoints";
import dayjs from "dayjs";

const NewProject = () => {
  const navigate = useNavigate();
  const [displayNameError, setDisplayNameError] = useState(false);

  const [testOpsTitleError, setTestOpsTitleError] = useState(false);
  const [testOpsLinkError, setTestOpsLinkError] = useState(false);

  const [sprintName, setSprintName] = useState("");
  const [sprintNameError, setSprintNameError] = useState(false);
  const [openStartDate, setopenStartDate] = useState(false);
  const [startDate, setstartDate] = useState("");
  const [startDateError, setstartDateError] = useState(false);
  const [openEndDate, setopenEndDate] = useState(false);
  const [endDate, setendDate] = useState("");
  const [endDateError, setendDateError] = useState(false);

  const isValidURL = (string) => {
    var res = string.match(
      /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  };

  const falseAll = () => {
    setDisplayNameError(false);
    setTestOpsTitleError(false);
    setTestOpsLinkError(false);
    setDisplayNameError(false);
    setendDateError(false)
    setstartDateError(false)
  };

  const isValidDisplayName = (str) => {
    const regex = /^\S*$/;
    return regex.test(str);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    falseAll();

    const data = new FormData(event.currentTarget);
    const displayName = data.get("displayName");

    const testOpsTitle = data.get("testOpsTitle");
    const testOpsLink = data.get("testOpsLink");

    console.log("display name", isValidDisplayName(displayName));

    if (
      displayName &&
      testOpsTitle &&
      isValidURL(testOpsLink) &&
      isValidDisplayName(displayName) &&
      sprintName && startDate && endDate
    ) {
      const payload = {
        display_name: displayName,
        title: testOpsTitle,
        url: testOpsLink,
        sprint_name: sprintName,
        sprint_start_date: dayjs(startDate).startOf('day').toISOString(),
        sprint_end_date: dayjs(endDate).endOf('day').toISOString()
      };
      console.log(payload);

      axios
        .post(projectsEndpoint, payload)
        .then((response) => {
          console.log("ReportPortalTests", response.data.data);
          navigate("/project-portal", { state: { item: response.data.data } });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error.response);
          // if (error.response.status === 400)
          //     alert(error.response.data.message)
          toast.error(error.response.data.message);
        });
    }

    if (displayName === "") {
      setDisplayNameError(true);
    }
    if (sprintName === "") {
      setSprintNameError(true);
    }
    if (startDate === "") {
      setstartDateError(true);
    }
    if (endDate === "") {
      setendDateError(true);
    }

    if (testOpsTitle === "") {
      setTestOpsTitleError(true);
    }

    if (!isValidURL(testOpsLink)) {
      setTestOpsLinkError(true);
    }

    if (!isValidDisplayName(displayName)) {
      setDisplayNameError(true);
      toast.warning("No multiple words allowed");
    }
  };
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
                <p className="heading">Add New Project</p>
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
              Save
            </Button>
          </div>
        </Stack>
        {/* <Alert severity="warning">
          Note : You can't change the project code of a project once it's been
          created, so choose wisely!
        </Alert> */}
      </div>

      <Paper sx={{ mt: 2, p: 2, minWidth: 500 }}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            {/* <Grid item xs={6}>
              <TextField
                name="code"
                id="code"
                required
                fullWidth
                disabled
                defaultValue={"1001"}
                placeholder="Enter Project Code"
                label="Project Code"
                autoFocus
              />
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                name="displayName"
                id="lastName"
                required
                fullWidth
                placeholder="Enter Project Name"
                label="Project Name"
                autoFocus
                error={displayNameError}
                helperText={displayNameError ? "Project Name is mandatory" : ""}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mt: 2, minWidth: 500 }}>
        <p className="body1">Sprint </p>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              name="sprintName"
              required
              fullWidth
              placeholder="Enter Sprint Name"
              label="Sprint Name"
              onChange={(e) => setSprintName(e.target.value)}
              error={sprintNameError}
              helperText={sprintNameError ? "Sprint Name is mandatory" : ""}
            />
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                open={openStartDate}
                onOpen={() => setopenStartDate(true)}
                onClose={() => setopenStartDate(false)}
                label="Start Date"
                value={startDate}
                minDate={new Date("2022-01-01")}
                onChange={(newValue) => {
                  setstartDate(newValue);
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      required
                      fullWidth
                      {...params}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={
                        startDateError
                          ? "Sprint Start Date is required!"
                          : ""
                      }
                      error={startDateError}
                      onClick={(e) => setopenStartDate(true)}
                    />
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat="dd/MM/yyyy"
                open={openEndDate}
                onOpen={() => setopenEndDate(true)}
                onClose={() => setopenEndDate(false)}
                label="End Date"
                value={endDate}
                minDate={startDate}
                onChange={(newValue) => {
                  setendDate(newValue);
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      required
                      fullWidth
                      {...params}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={
                        endDateError ? "Sprint Close Date is required!" : ""
                      }
                      error={endDateError}
                      onClick={(e) => setopenEndDate(true)}
                    />
                  );
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mt: 2, p: 2, minWidth: 500 }}>
        <p className="body1">Link</p>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                name="testOpsTitle"
                id="testOpsTitle"
                required
                fullWidth
                placeholder="Enter Title"
                label="Title"
                error={testOpsTitleError}
                helperText={testOpsTitleError ? "Title is mandatory" : ""}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="testOpsLink"
                id="testOpsLink"
                required
                fullWidth
                placeholder="Enter Link"
                label="Link"
                error={testOpsLinkError}
                helperText={
                  testOpsLinkError ? "Please Enter a valid Link!" : ""
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewProject;
