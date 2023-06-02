import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import { Button, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, Paper, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { defects } from "../../Config/Endpoints";
import { getDaysDifference } from "../../Utils/AppExtensions";
import Input from "../controls/Input";
import { Form, useForm } from "../useForm";

const EditDeffect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = location?.state?.project;
  const currentDefect = location?.state?.defect;

  const initialFValues = {
    defectId: currentDefect.display_id,
    aging: currentDefect.defect_age,
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("defectId" in fieldValues)
      temp.defectId = fieldValues.defectId
        ? ""
        : "Defect Id field is required.";
    if ("aging" in fieldValues)
      temp.aging = fieldValues.aging ? "" : "Defect aging field is required.";

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const [openEntryDatePicker, setOpenEntryDatePicker] = useState(false);
  const [entryDate, setEntryDate] = useState(currentDefect.entry_date);
  const [entryDateError, setEntryDateError] = useState(false);
  const [openReportedDatePicker, setOpenReportedDatePicker] = useState(false);
  const [reportedDate, setReportedDate] = useState(currentDefect.reported_date);
  const [reportedDateError, setReportedDateError] = useState(false);
  const [openClosedDatePicker, setOpenClosedDatePicker] = useState(false);
  const [closedDate, setClosedDate] = useState(currentDefect.closed_date ? currentDefect.closed_date : null);
  const [closedDateError, setClosedDateError] = useState(false);
  const [defectsTitle, setDefectsTitle] = useState(currentDefect.display_name);
  const [defectsAge, setDefectsAge] = useState();

  const [statusValue, setStatusValue] = useState(currentDefect.status);


  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const falseAllErrors = () => {
    setEntryDateError(false);
    setReportedDateError(false);
    setClosedDateError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    falseAllErrors();

    if (entryDate && reportedDate) {
      var payload = {}
      if (statusValue === "open")
        payload = {
          display_id: values.defectId,
          entry_date: entryDate,
          //reported_date: reportedDate,
          defect_age: defectsAge,
          display_name: defectsTitle,
          status: statusValue,
        }
      else payload = {
        display_id: values.defectId,
        entry_date: entryDate,
        defect_age: defectsAge,
        display_name: defectsTitle,
        status: statusValue,
        closed_date: closedDate
      }
      axios
        .put(defects + currentDefect._id, payload)
        .then((response) => {
          toast.success("Defect entry Update successfull!");
          console.log(response.data);
          navigate("/project-portal", {
            state: { origin: "defects", item: currentProject },
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            err.response.data.message
          );
        });
    }
    if (entryDate === "" || entryDate === null) setEntryDateError(true);
    if (reportedDate === "" || reportedDate === null)
      setReportedDateError(true);
    if (statusValue === "closed") if (closedDate === "" || closedDate === null) setClosedDateError(true);
  };

  useEffect(() => {
    console.log(getDaysDifference(currentDefect.reported_date, closedDate ? closedDate : currentDefect.reported_date))
    setDefectsAge(getDaysDifference(currentDefect.reported_date, closedDate ? closedDate : currentDefect.reported_date))
    if (statusValue === "open")
      setClosedDate(null)
  }, [closedDate, statusValue]);
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
                  <p className="heading">
                    Update Defect ID-{currentDefect.display_id}
                  </p>
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
              <Button type="submit" variant="contained">
                Save
              </Button>
            </div>
          </Stack>
        </div>
        <Paper sx={{ p: 2 }}>
          {/* <p className="body1">Launch Details</p> */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <RadioGroup
                  row
                  value={statusValue}
                  onChange={handleStatusChange}
                >
                  <FormControlLabel disabled={statusValue === "closed"} value="open" control={<Radio />} label="Open" />
                  <FormControlLabel value="closed" control={<Radio />} label="Closed" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              Sprint Name :
            </Grid>
            <Grid item xs={9}>
              {currentDefect.sprint?.sprint_name}
            </Grid>
            <Grid item xs={3}>
              Build Name
            </Grid>
            <Grid item xs={9}>
              {currentDefect.build?.build_number}
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }}>
              <Input
                label="Defect ID"
                name="defectId"
                defaultValue={values.defectId}
                onChange={handleInputChange}
                error={errors.defectId}
                placeholder="Enter defect id"
              />
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
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
            {/* </Grid>
          </Paper>

          <Paper sx={{ p: 2, mt: 3 }}>
          <p className="body1">Defect Ageing Data</p>
          <Grid container spacing={2}> */}
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    disabled
                    inputFormat="dd/MM/yyyy"
                    // open={openReportedDatePicker}
                    open={false}
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
                          disabled
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
                    disabled={statusValue === "open"}
                    inputFormat="dd/MM/yyyy"
                    open={openClosedDatePicker && statusValue === "closed"}
                    onOpen={() => setOpenClosedDatePicker(true)}
                    onClose={() => setOpenClosedDatePicker(false)}
                    label="Closed Date"
                    value={closedDate}
                    disableFuture
                    minDate={new Date(reportedDate)}
                    onChange={(newValue) => {
                      setClosedDate(newValue);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          disabled={statusValue === "open"}
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
        </Paper>
      </Form>
    </>
  );
};

export default EditDeffect;
