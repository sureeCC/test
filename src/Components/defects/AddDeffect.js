import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import { Button, Grid, InputAdornment, MenuItem, Paper, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { defects, getBuildsEndPoint } from "../../Config/Endpoints";
import { getDaysDifference } from "../../Utils/AppExtensions";
import Input from "../controls/Input";
import { Form, useForm } from "../useForm";

const initialFValues = {
  defectId: "",
  //aging: "",
};

const AddDeffect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = location?.state?.project;
  const currentSprint = location?.state?.currentSprint;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("defectId" in fieldValues)
      temp.defectId = fieldValues.defectId
        ? ""
        : "Defect Id field is required.";
    // if ("aging" in fieldValues)
    //   temp.aging = fieldValues.aging ? "" : "Defect aging field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const [buildsData, setBuildsData] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState("");
  const [selectedBuildError, setSelectedBuildError] = useState("");
  const [openEntryDatePicker, setOpenEntryDatePicker] = useState(false);
  const [entryDate, setEntryDate] = useState("");
  const [entryDateError, setEntryDateError] = useState(false);
  const [openReportedDatePicker, setOpenReportedDatePicker] = useState(false);
  const [reportedDate, setReportedDate] = useState("");
  const [reportedDateError, setReportedDateError] = useState(false);
  const [openClosedDatePicker, setOpenClosedDatePicker] = useState(false);
  const [closedDate, setClosedDate] = useState("");
  const [closedDateError, setClosedDateError] = useState(false);
  const [redirectToSamePage, setRedirectToSamePage] = useState(false);
  const [defectsAge, setDefectsAge] = useState();
  const [defectsTitle, setDefectsTitle] = useState("");

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const falseAllErrors = () => {
    setEntryDateError(false);
    setReportedDateError(false);
    setClosedDateError(false);
    setSelectedBuildError(false)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    falseAllErrors();

    if (validate() && entryDate && selectedBuild) {
      const payload = {
        display_name: defectsTitle,
        display_id: values.defectId,
        entry_date: entryDate,
        project_id: currentProject.id,
        project_code: currentProject.display_id,
        reported_date: reportedDate,
        status: "open",
        //closed_date: closedDate,
        //defect_age: defectsAge,
        build_id: selectedBuild
      };
      axios.post(defects, payload).then((response) => {
        toast.success("Defect entry submission successfull!");
        console.log(response.data);
        if (redirectToSamePage) window.location.reload();
        else
          navigate("/project-portal", {
            state: { origin: "defects", item: currentProject },
          });
        setRedirectToSamePage(false);
      });
    }
    if (entryDate === "" || entryDate === null) setEntryDateError(true);
    if (reportedDate === "" || reportedDate === null)
      setReportedDateError(true);
    // if (closedDate === "" || closedDate === null) setClosedDateError(true);
    if (selectedBuild === "" || selectedBuild === null) setSelectedBuildError(true);
  };

  const getBuildsData = useCallback(async (sprintId, projectId) => {
    try {
      const response = await axios.get(getBuildsEndPoint(projectId), {
        params: { sprintId: sprintId },
      });
      console.log("Builds-Data", response.data.data);
      setBuildsData(response.data.data);
    } catch (e) {
      console.error(e);
    }
  }, [])

  useEffect(() => {
    getBuildsData(currentSprint._id, currentProject.id)
  }, [currentProject.id, currentSprint._id, getBuildsData]);

  // useEffect(() => {
  //   setDefectsAge(getDaysDifference(reportedDate, closedDate))
  // }, [reportedDate, closedDate]);
  return (
    <>
      <Form noValidate onSubmit={handleSubmit}>
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
                  <Button
                    onClick={() =>
                      navigate("/project-portal", {
                        state: { origin: "defects", item: currentProject },
                      })
                    }
                    variant="outlined"
                  >
                    <KeyboardBackspaceSharpIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <p className="heading">Add New Defect</p>
                </Grid>
              </Grid>
            </div>
            <div>
              <Button
                onClick={() =>
                  navigate("/project-portal", {
                    state: { origin: "defects", item: currentProject },
                  })
                }
                variant="outlined"
                sx={{ mr: 1 }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                onClick={() => setRedirectToSamePage(true)}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Save &#38; Add New
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </div>
          </Stack>
        </div>
        <Paper sx={{ p: 2 }}>
          {/* <p className="body1">Launch Details</p> */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="sprint"
                value={currentSprint}
                select
                label="Sprint"
                disabled
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={currentSprint}>
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      {currentSprint.sprint_name}
                    </Grid>
                  </Grid>
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                name="buildName"
                value={selectedBuild}
                label="Build Name"
                onChange={(e) => setSelectedBuild(e.target.value)}
                error={selectedBuildError}
                helperText={selectedBuildError ? "Build Name is required." : ""}
              // InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="">
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <em>Select Build Name</em>
                    </Grid>
                  </Grid>
                </MenuItem>
                {buildsData?.builds?.map(item => {
                  return (
                    <MenuItem value={item._id}>
                      <Grid container spacing={2}>
                        <Grid item xs={7}>
                          {item.build_number}
                        </Grid>
                      </Grid>
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    open={openEntryDatePicker}
                    onOpen={() => setOpenEntryDatePicker(true)}
                    onClose={() => setOpenEntryDatePicker(false)}
                    label="Entry Date"
                    value={entryDate}
                    disableFuture
                    minDate={new Date("2022-01-01")}
                    onChange={(newValue) => {
                      setEntryDate(newValue);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          required
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText={
                            entryDateError ? "Entry Date is required!" : ""
                          }
                          error={entryDateError}
                          onClick={(e) => setOpenEntryDatePicker(true)}
                        />
                      );
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <Input
                label="Defect ID"
                name="defectId"
                defaultValue={values.defectId}
                onChange={handleInputChange}
                error={errors.defectId}
                placeholder="Enter defect id"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Defect Title"
                name="defectId"
                defaultValue={defectsTitle}
                onChange={(e) => setDefectsTitle(e.target.value)}
                placeholder="Enter defect Title"
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    open={openReportedDatePicker}
                    onOpen={() => setOpenReportedDatePicker(true)}
                    onClose={() => setOpenReportedDatePicker(false)}
                    label="Reported Date"
                    value={reportedDate}
                    disableFuture
                    minDate={new Date("2022-01-01")}
                    onChange={(newValue) => {
                      setReportedDate(newValue);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          required
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText={
                            reportedDateError
                              ? "Reported Date is required!"
                              : ""
                          }
                          error={reportedDateError}
                          onClick={(e) => setOpenReportedDatePicker(true)}
                        />
                      );
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>

        {/* <Paper sx={{ p: 2, mt: 3 }}>
          <p className="body1">Defect Ageing Data</p>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    open={openReportedDatePicker}
                    onOpen={() => setOpenReportedDatePicker(true)}
                    onClose={() => setOpenReportedDatePicker(false)}
                    label="Reported Date"
                    value={reportedDate}
                    disableFuture
                    minDate={new Date("2022-01-01")}
                    onChange={(newValue) => {
                      setReportedDate(newValue);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          required
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText={
                            reportedDateError
                              ? "Reported Date is required!"
                              : ""
                          }
                          error={reportedDateError}
                          onClick={(e) => setOpenReportedDatePicker(true)}
                        />
                      );
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    open={openClosedDatePicker}
                    onOpen={() => setOpenClosedDatePicker(true)}
                    onClose={() => setOpenClosedDatePicker(false)}
                    label="Closed Date"
                    value={closedDate}
                    disableFuture
                    minDate={reportedDate}
                    onChange={(newValue) => {
                      setClosedDate(newValue);
                      values.aging = 10
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          required
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText={
                            closedDateError ? "Closed Date is required!" : ""
                          }
                          error={closedDateError}
                          onClick={(e) => setOpenClosedDatePicker(true)}
                        />
                      );
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Defects Age"
                disabled
                name="aging"
                value={defectsAge}
                onChange={(e) => setDefectsAge(e.target.value)}
                error={errors.aging}
                type="number"
                placeholder="0"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Days</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper> */}
      </Form>
    </>
  );
};

export default AddDeffect;
