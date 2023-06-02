import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { manualLaunchesEndpoint } from "../Config/Endpoints";
import Input from "./controls/Input";
import { Form, useForm } from "./useForm";

const EditManualEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = location?.state?.project;
  const currentBuild = location?.state?.build;
  const currentRun = location?.state?.runs;
  const currentMLaunch = location?.state?.mLaunch;
  const currentActivity = location?.state?.activity
  const [environment, setEnvironment] = useState(currentMLaunch?.environment);
  // const [hoursArray, setHoursArray] = useState([]);
  // const [minutesArray, setMinutesArray] = useState([]);
  // const [hours, setHours] = useState(Math.floor((currentMLaunch?.metrics?.execution_time / 1000) / 3600));
  // const [minutes, setMinutes] = useState(((currentMLaunch?.metrics?.execution_time / 1000) / 60) % 60);
  // const [hoursError, setHoursError] = useState(false);
  // const [minutesError, setMinutesError] = useState(false);

  const initialFValues = {
    blockers: currentMLaunch.defect_finding_data.blockers,
    critical: currentMLaunch.defect_finding_data.critical_defects,
    major: currentMLaunch.defect_finding_data.major_defects,
    minor: currentMLaunch.defect_finding_data.minor_defects,
    rejected: currentMLaunch.defect_finding_data.rejected_defects,
    total: currentMLaunch.defect_finding_data.total_defects,
    defectsRetested: currentMLaunch.defect_fix_data.retested_defects,
    defectsFixed: currentMLaunch.defect_fix_data.fixed_defects,
    plannedTcs: currentMLaunch.metrics.planned_testcases,
    executedTcs: currentMLaunch.metrics.executed_testcases,
    passedTcs: currentMLaunch.metrics.passed_testcases,
    failedTcs: currentMLaunch.metrics.failed_testcases,
    blockedTcs: currentMLaunch.metrics.blocked_testcases,
    totalTcs: currentMLaunch.metrics.total_testcases,
    executionTimeHours: Math.floor(currentMLaunch.metrics?.execution_time / 60),
    executionTimeMinutes: currentMLaunch.metrics?.execution_time % 60,
    p0: currentMLaunch.new_testcases_added.p0,
    p1: currentMLaunch.new_testcases_added.p1,
    p2: currentMLaunch.new_testcases_added.p2,
    p3: currentMLaunch.new_testcases_added.p3,
    p4: currentMLaunch.new_testcases_added.p4,
    r_blockers: currentMLaunch.defect_rejected_data?.blockers,
    r_critical: currentMLaunch.defect_rejected_data?.critical_defects,
    r_major: currentMLaunch.defect_rejected_data?.major_defects,
    r_minor: currentMLaunch.defect_rejected_data?.minor_defects,
    p0_updated: currentMLaunch.testcases_updated?.p0,
    p1_updated: currentMLaunch.testcases_updated?.p1,
    p2_updated: currentMLaunch.testcases_updated?.p2,
    p3_updated: currentMLaunch.testcases_updated?.p3,
    p4_updated: currentMLaunch.testcases_updated?.p4,
  };

  const validate = (fieldValues = values) => {
    console.log(fieldValues)
    let temp = { ...errors }
    if ('blockers' in fieldValues)
      temp.blockers = fieldValues.blockers !== null ? (fieldValues.blockers < 0 || fieldValues.blockers % 1 !== 0) ? "Not a valid Number" : "" : "Blockers field is required."
    if ('critical' in fieldValues)
      temp.critical = fieldValues.critical !== null ? (fieldValues.critical < 0 || fieldValues.critical % 1 !== 0) ? "Not a valid Number" : "" : "Critical field is required."
    if ('major' in fieldValues)
      temp.major = fieldValues.major !== null ? (fieldValues.major < 0 || fieldValues.major % 1 !== 0) ? "Not a valid Number" : "" : "Major field is required."
    if ('minor' in fieldValues)
      temp.minor = fieldValues.minor !== null ? (fieldValues.minor < 0 || fieldValues.minor % 1 !== 0) ? "Not a valid Number" : "" : "Minor field is required."
    if ('rejected' in fieldValues)
      temp.rejected = fieldValues.rejected !== null ? (fieldValues.rejected < 0 || fieldValues.rejected % 1 !== 0) ? "Not a valid Number" : "" : "Rejected field is required."
    if ('defectsRetested' in fieldValues)
      temp.defectsRetested = fieldValues.defectsRetested !== null ? (fieldValues.defectsRetested < 0 || fieldValues.defectsRetested % 1 !== 0) ? "Not a valid Number" : "" : "Defects Retested field is required."
    if ('defectsFixed' in fieldValues)
      temp.defectsFixed = fieldValues.defectsFixed !== null ? (fieldValues.defectsFixed < 0 || fieldValues.defectsFixed % 1 !== 0) ? "Not a valid Number" : "" : "Defects Fixed field is required."
    if ('plannedTcs' in fieldValues)
      temp.plannedTcs = fieldValues.plannedTcs !== null ? (fieldValues.plannedTcs < 0 || fieldValues.plannedTcs % 1 !== 0) ? "Not a valid Number" : "" : "Planned Tcs field is required."
    if ('executedTcs' in fieldValues)
      temp.executedTcs = fieldValues.executedTcs !== null ? (fieldValues.executedTcs < 0 || fieldValues.executedTcs % 1 !== 0) ? "Not a valid Number" : "" : "Executed Tcs field is required."
    if ('passedTcs' in fieldValues)
      temp.passedTcs = fieldValues.passedTcs !== null ? (fieldValues.passedTcs < 0 || fieldValues.passedTcs % 1 !== 0) ? "Not a valid Number" : "" : "Passed Tcs field is required."
    if ('failedTcs' in fieldValues)
      temp.failedTcs = fieldValues.failedTcs !== null ? (fieldValues.failedTcs < 0 || fieldValues.failedTcs % 1 !== 0) ? "Not a valid Number" : "" : "Failed Tcs field is required."
    if ('blockedTcs' in fieldValues)
      temp.blockedTcs = fieldValues.blockedTcs !== null ? (fieldValues.blockedTcs < 0 || fieldValues.blockedTcs % 1 !== 0) ? "Not a valid Number" : "" : "Blocked Tcs field is required."
    if ('p0' in fieldValues)
      temp.p0 = fieldValues.p0 !== null ? (fieldValues.p0 < 0 || fieldValues.p0 % 1 !== 0) ? "Not a valid Number" : "" : "P0 field is required."
    if ('p1' in fieldValues)
      temp.p1 = fieldValues.p1 !== null ? (fieldValues.p1 < 0 || fieldValues.p1 % 1 !== 0) ? "Not a valid Number" : "" : "P1 field is required."
    if ('p2' in fieldValues)
      temp.p2 = fieldValues.p2 !== null ? (fieldValues.p2 < 0 || fieldValues.p2 % 1 !== 0) ? "Not a valid Number" : "" : "P2 field is required."
    if ('p3' in fieldValues)
      temp.p3 = fieldValues.p3 !== null ? (fieldValues.p3 < 0 || fieldValues.p3 % 1 !== 0) ? "Not a valid Number" : "" : "P3 field is required."
    if ('p4' in fieldValues)
      temp.p4 = fieldValues.p4 !== null ? (fieldValues.p4 < 0 || fieldValues.p4 % 1 !== 0) ? "Not a valid Number" : "" : "P4 field is required."
    if ('p0_updated' in fieldValues)
      temp.p0_updated = fieldValues.p0_updated !== null ? (fieldValues.p0_updated < 0 || fieldValues.p0_updated % 1 !== 0) ? "Not a valid Number" : "" : "P0 in update field is required."
    if ('p1_updated' in fieldValues)
      temp.p1_updated = fieldValues.p1_updated !== null ? (fieldValues.p1_updated < 0 || fieldValues.p1_updated % 1 !== 0) ? "Not a valid Number" : "" : "P1 in update field is required."
    if ('p2_updated' in fieldValues)
      temp.p2_updated = fieldValues.p2_updated !== null ? (fieldValues.p2_updated < 0 || fieldValues.p2_updated % 1 !== 0) ? "Not a valid Number" : "" : "P2 in update  field is required."
    if ('p3_updated' in fieldValues)
      temp.p3_updated = fieldValues.p3_updated !== null ? (fieldValues.p3_updated < 0 || fieldValues.p3_updated % 1 !== 0) ? "Not a valid Number" : "" : "P3 in update  field is required."
    if ('p4_updated' in fieldValues)
      temp.p4_updated = fieldValues.p4_updated !== null ? (fieldValues.p4_updated < 0 || fieldValues.p4_updated % 1 !== 0) ? "Not a valid Number" : "" : "P4 in update  field is required."
    if ('r_blockers' in fieldValues)
      temp.r_blockers = fieldValues.r_blockers !== null ? (fieldValues.r_blockers < 0 || fieldValues.r_blockers % 1 !== 0) ? "Not a valid Number" : "" : "Rejected blocker field is required."
    if ('r_critical' in fieldValues)
      temp.r_critical = fieldValues.r_critical !== null ? (fieldValues.r_critical < 0 || fieldValues.r_critical % 1 !== 0) ? "Not a valid Number" : "" : "Rejected critical field is required."
    if ('r_major' in fieldValues)
      temp.r_major = fieldValues.r_major !== null ? (fieldValues.r_major < 0 || fieldValues.r_major % 1 !== 0) ? "Not a valid Number" : "" : "Rejected major field is required."
    if ('r_minor' in fieldValues)
      temp.r_minor = fieldValues.r_minor !== null ? (fieldValues.r_minor < 0 || fieldValues.r_minor % 1 !== 0) ? "Not a valid Number" : "" : "Rejected minor field is required."
    //if ('executionTime' in fieldValues)
    //temp.executionTime = fieldValues.executionTime ? (fieldValues.executionTime < 0 || fieldValues.executionTime % 1 !== 0) ? "Not a valid Number" : "" : "Execution Time field is required."
    if ('executionTimeHours' in fieldValues)
      temp.executionTimeHours = fieldValues.executionTimeHours !== null ? (fieldValues.executionTimeHours < 0 || fieldValues.executionTimeHours % 1 !== 0) ? "Not a valid Number" : "" : "Execution Time Hours field is required."
    if ('executionTimeMinutes' in fieldValues)
      temp.executionTimeMinutes = fieldValues.executionTimeMinutes !== null ? (fieldValues.executionTimeMinutes < 0 || fieldValues.executionTimeMinutes % 1 !== 0 || fieldValues.executionTimeMinutes >= 60) ? "Not a valid Number" : "" : "Execution Time Minutes field is required."

    setErrors({
      ...temp
    })

    if (fieldValues === values)
      return Object.values(temp).every(x => x === "")
  }

  const [openExecutedDatePicker, setOpenExecutedDatePicker] = useState(false);
  const [executedDate, setExecutedDate] = useState(
    currentMLaunch.execution_date
  );
  const [released, setReleased] = useState(currentMLaunch.released);
  const [executedDateError, setExecutedDateError] = useState(false);
  const [releasedError, setReleasedError] = useState(false);

  const [totalTcs, setTotalTcs] = useState(0);
  const [totalUpdatedTcs, setTotalUpdatedTcs] = useState(0);
  const [totalDefects, setTotalDefects] = useState(0);
  const [totalTcsError, setTotalTcsError] = useState(false);
  const [totalUpdatedTcsError, setTotalUpdatedTcsError] = useState(false);
  const [totalDefectsError, setTotalDefectsError] = useState(false);

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  const handleReleaseChange = (e) => {
    setReleased(e.target.value);
  };
  console.log(currentMLaunch);

  const handleSubmit = (e) => {
    console.log("hours and minutes", values.executionTimeHours, values.executionTimeMinutes)
    e.preventDefault();
    setReleasedError(false)
    setExecutedDateError(false)
    setTotalDefectsError(false)
    setTotalTcsError(false)
    setTotalUpdatedTcsError(false)
    // setHoursError(false)
    // setMinutesError(false)

    if (executedDate === null)
      setExecutedDateError(true)
    if (released === null)
      setReleasedError(true)
    if (totalDefects < 0)
      setTotalDefectsError(true)
    if (totalTcs < 0)
      setTotalTcsError(true)
    if (totalUpdatedTcs < 0)
      setTotalUpdatedTcsError(true)
    // if (hours === null)
    //   setHoursError(true)
    // if ((hours <= 0 && minutes <= 0) || minutes === null)
    //   setMinutesError(true)

    if (validate() && executedDate && environment && totalDefects >= 0 && totalTcs >= 0) {
      const payload = {
        execution_date: executedDate,
        released: released,
        defect_finding_data: {
          total_defects: totalDefects,
          blockers: parseInt(values.blockers),
          critical_defects: parseInt(values.critical),
          major_defects: parseInt(values.major),
          minor_defects: parseInt(values.minor),
          rejected_defects: parseInt(values.rejected)
        },
        defect_fix_data: {
          retested_defects: parseInt(values.defectsRetested),
          fixed_defects: parseInt(values.defectsFixed)
        },
        metrics: {
          planned_testcases: parseInt(values.plannedTcs),
          executed_testcases: parseInt(values.executedTcs),
          passed_testcases: parseInt(values.passedTcs),
          failed_testcases: parseInt(values.failedTcs),
          blocked_testcases: parseInt(values.blockedTcs),
          execution_time: ((parseInt(values.executionTimeHours) * 60) + parseInt(values.executionTimeMinutes))
        },
        new_testcases_added: {
          p0: parseInt(values.p0),
          p1: parseInt(values.p1),
          p2: parseInt(values.p2),
          p3: parseInt(values.p3),
          p4: parseInt(values.p4),
          total_new_testcases: totalTcs
        },
        testcases_updated: {
          p0: parseInt(values.p0_updated),
          p1: parseInt(values.p1_updated),
          p2: parseInt(values.p2_updated),
          p3: parseInt(values.p3_updated),
          p4: parseInt(values.p4_updated),
          total_updated_testcases: totalUpdatedTcs
        },
        defect_rejected_data: {
          blockers: parseInt(values.r_blockers),
          critical_defects: parseInt(values.r_critical),
          major_defects: parseInt(values.r_major),
          minor_defects: parseInt(values.r_minor)
        }
      };
      axios
        .put(manualLaunchesEndpoint + currentMLaunch._id, payload)
        .then((response) => {
          toast.success("Update successfull!");
          navigate("/build-launches", {
            state: {
              tabIndex: 0,
              project: currentProject,
              build: currentBuild,
              runs: currentRun,
              activity: currentActivity
            },
          });
          console.log(response.data);
        })
        .catch((err) => {
          toast.error(
            "Could not update the manual launch, kindly contact admin"
          );
        });
    } else toast.info("Please fill all required fields!");

    //setEnableControls(!enableControls);
  };
  // useEffect(() => {
  //   for (var i = 0; i < 100; i++) {
  //     hoursArray.push(i)
  //     if (i > 59) return
  //     minutesArray.push(i)
  //   }
  // }, [hoursArray, minutesArray]);

  useEffect(() => {

    // if (values.plannedTcs >= 0 && values.executedTcs >= 0 && values.blockedTcs >= 0) {
    // const totalTcs = parseInt(values.plannedTcs) - ((parseInt(values.executedTcs) + parseInt(values.blockedTcs)))
    const totalTcs = parseInt(values.p0) + parseInt(values.p1) + parseInt(values.p2) + parseInt(values.p3) + parseInt(values.p4)
    setTotalTcs(totalTcs)
    // }
    //if (values.blockers >= 0 && values.critical && values.major && values.minor) {
    const td = (parseInt(values.blockers) + parseInt(values.critical) + parseInt(values.major) + parseInt(values.minor))
    console.log(td)
    setTotalDefects(td)
    //}
    const totalUpdatedTcs = parseInt(values.p0_updated) + parseInt(values.p1_updated) + parseInt(values.p2_updated) + parseInt(values.p3_updated) + parseInt(values.p4_updated)
    setTotalUpdatedTcs(totalUpdatedTcs)
  }, [values.blockedTcs, values.blockers, values.critical, values.executedTcs, values.major, values.minor, values.p0, values.p0_updated, values.p1, values.p1_updated, values.p2, values.p2_updated, values.p3, values.p3_updated, values.p4, values.p4_updated, values.plannedTcs]);
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
                      navigate('/build-launches', {
                        state: {
                          tabIndex: 0,
                          project:
                            currentProject,
                          build: currentBuild,
                          activity: currentActivity,
                          runs: currentRun
                        }
                      })}
                    variant='outlined'>
                    <KeyboardBackspaceSharpIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <p className="heading">
                    Update Launch Detail of Launch {currentMLaunch.launch_name}
                  </p>
                </Grid>
              </Grid>
            </div>
            <div>
              <Button
                onClick={() =>
                  navigate("/build-launches", {
                    state: {
                      tabIndex: 0,
                      project: currentProject,
                      build: currentBuild,
                      runs: currentRun,
                      activity: currentActivity
                    },
                  })
                }
                variant="outlined"
                sx={{ mr: 1 }}
              >
                cancel
              </Button>
              <Button onClick={(e) => handleSubmit(e)} variant="contained">
                Save
              </Button>
            </div>
          </Stack>
        </div>
        <Paper sx={{ p: 2 }}>
          <p className="body1">Launch Details</p>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body2">Project Name</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                {currentProject.display_name}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Run Name</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">{currentRun.run_name}</Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="body2">Project Code</Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body2">
                {currentProject.display_id}
              </Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    open={openExecutedDatePicker}
                    onOpen={() => setOpenExecutedDatePicker(true)}
                    onClose={() => setOpenExecutedDatePicker(false)}
                    label="Excecuted Date"
                    value={executedDate}
                    disableFuture
                    minDate={new Date("2022-01-01")}
                    onChange={(newValue) => {
                      setExecutedDate(newValue);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          helperText={
                            executedDateError
                              ? "Executed Date is required!"
                              : ""
                          }
                          onClick={(e) => setOpenExecutedDatePicker(true)}
                          error={executedDateError}
                        />
                      );
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3} sx={{ mt: 1 }}>
              <TextField
                name="environment"
                fullWidth
                value={environment}
                select
                label="Environment"
                onChange={(e) => {
                  setEnvironment(e.target.value);
                }}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="production">
                  Production
                </MenuItem>
                <MenuItem value="development">
                  Development
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} sx={{ mt: 1 }}>
              <FormControl error={releasedError}>
                <FormLabel>
                  <Typography variant="body2">Release</Typography>
                </FormLabel>
                <RadioGroup
                  row
                  name="row-radio-buttons-group"
                  defaultValue={currentMLaunch.released}
                  onChange={(e) => handleReleaseChange(e)}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio size="small" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio size="small" />}
                    label="No"
                  />
                </RadioGroup>
                {releasedError ? (
                  <FormHelperText color>
                    Release option is mandatory!
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* new testcases added */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <p className="body1">New Testcases Added</p>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Input
                label="P0"
                name="p0"
                defaultValue={values.p0}
                onChange={handleInputChange}
                error={errors.p0}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P1"
                name="p1"
                defaultValue={values.p1}
                onChange={handleInputChange}
                error={errors.p1}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P2"
                name="p2"
                defaultValue={values.p2}
                onChange={handleInputChange}
                error={errors.p2}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P3"
                name="p3"
                defaultValue={values.p3}
                onChange={handleInputChange}
                error={errors.p3}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P4"
                name="p4"
                defaultValue={values.p4}
                onChange={handleInputChange}
                error={errors.p4}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                disabled
                label="Total TCs"
                name="totalTcs"
                value={totalTcs}
                error={totalTcsError}
                onChange={(e) => setTotalTcs(e.target.value)}
                helperText={totalTcsError ? "Please enter valid values" : ""}
                type='number'
                placeholder='0'
              />
            </Grid>
          </Grid>
        </Paper>

        {/* testcases updated */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <p className="body1"> Testcases Updated</p>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Input
                label="P0"
                name="p0_updated"
                defaultValue={values.p0_updated}
                onChange={handleInputChange}
                error={errors.p0_updated}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P1"
                name="p1_updated"
                defaultValue={values.p1_updated}
                onChange={handleInputChange}
                error={errors.p1_updated}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P2"
                name="p2_updated"
                defaultValue={values.p2_updated}
                onChange={handleInputChange}
                error={errors.p2_updated}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P3"
                name="p3_updated"
                defaultValue={values.p3_updated}
                onChange={handleInputChange}
                error={errors.p3_updated}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="P4"
                name="p4_updated"
                defaultValue={values.p4_updated}
                onChange={handleInputChange}
                error={errors.p4_updated}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                disabled
                label="Total Updated TCs"
                name="totalTcs"
                value={totalUpdatedTcs}
                error={totalUpdatedTcsError}
                helperText={totalUpdatedTcsError ? "Please enter valid values" : ""}
                type='number'
                placeholder='0'
              />
            </Grid>
          </Grid>
        </Paper>
        {/* Test Execution Volumetric */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <p className="body1">Test Execution Volumetric</p>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Input
                label="Planned TCs"
                name="plannedTcs"
                defaultValue={values.plannedTcs}
                onChange={handleInputChange}
                error={errors.plannedTcs}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Executed TCs"
                name="executedTcs"
                defaultValue={values.executedTcs}
                onChange={handleInputChange}
                error={errors.executedTcs}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Passed TCs"
                name="passedTcs"
                defaultValue={values.passedTcs}
                onChange={handleInputChange}
                error={errors.passedTcs}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Failed TCs"
                name="failedTcs"
                defaultValue={values.failedTcs}
                onChange={handleInputChange}
                error={errors.failedTcs}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Blocked TCs"
                name="blockedTcs"
                defaultValue={values.blockedTcs}
                onChange={handleInputChange}
                error={errors.blockedTcs}
                type="number"
                placeholder="0"
              />
            </Grid>
            {/* <Grid item xs={2}>
              <TextField
                disabled
                label="Total TCs"
                name="totalTcs"
                value={totalTcs}
                error={totalTcsError}
                onChange={(e) => setTotalTcs(e.target.value)}
                helperText={totalTcsError ? "Please enter valid values" : ""}
                type='number'
                placeholder='0'
              />
            </Grid> */}
          </Grid>
          <p className="body1">Execution Time</p>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              {/* <TextField
                                fullWidth
                                size='small'
                                select
                                label="Hours"
                                name="hours"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                error={hoursError}
                                helperText={hoursError ? "Select Hours" : ""}
                            >
                                {hoursArray.map(i => {
                                    return (
                                        <MenuItem value={i}>{i}</MenuItem>
                                    )
                                })}
                            </TextField> */}
              <Input
                label="Hours"
                name="executionTimeHours"
                defaultValue={values.executionTimeHours}
                onChange={handleInputChange}
                error={errors.executionTimeHours}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={2}>
              {/* <TextField
                                fullWidth
                                size='small'
                                select
                                label="Minutes"
                                name="minutes"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                error={minutesError}
                                helperText={minutesError ? "Select Minutes" : ""}
                            >
                                {minutesArray.map(i => {
                                    return (
                                        <MenuItem value={i}>{i}</MenuItem>
                                    )
                                })}
                            </TextField> */}
              <Input
                label="Minutes"
                name="executionTimeMinutes"
                defaultValue={values.executionTimeMinutes}
                onChange={handleInputChange}
                error={errors.executionTimeMinutes}
                type='number'
                placeholder='0'
              />
            </Grid>
          </Grid>
        </Paper>
        {/* defect finding data */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <p className="body1">Defect Finding Data</p>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Input
                name="blockers"
                label="Blockers"
                defaultValue={values.blockers}
                onChange={handleInputChange}
                error={errors.blockers}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Critical"
                name="critical"
                defaultValue={values.critical}
                onChange={handleInputChange}
                error={errors.critical}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Major"
                name="major"
                defaultValue={values.major}
                onChange={handleInputChange}
                error={errors.major}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Minor"
                name="minor"
                defaultValue={values.minor}
                onChange={handleInputChange}
                error={errors.minor}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <Input
                label="Rejected"
                name="rejected"
                defaultValue={values.rejected}
                onChange={handleInputChange}
                error={errors.rejected}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                disabled
                label="Total"
                name="total"
                value={totalDefects}
                onChange={(e) => setTotalDefects(e.target.value)}
                error={totalDefectsError}
                helperText={totalDefectsError ? "Please enter valid values" : ""}
                type='number'
                placeholder='0'
              />
            </Grid>
          </Grid>
        </Paper>
        {/* Defect Rejected Data */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <p className="body1">Defect Rejected Data</p>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Input
                name="r_blockers"
                label="Blockers"
                defaultValue={values.r_blockers}
                onChange={handleInputChange}
                error={errors.r_blockers}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                label="Critical"
                name="r_critical"
                defaultValue={values.r_critical}
                onChange={handleInputChange}
                error={errors.r_critical}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                label="Major"
                name="r_major"
                defaultValue={values.r_major}
                onChange={handleInputChange}
                error={errors.r_major}
                type='number'
                placeholder='0'
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                label="Minor"
                name="r_minor"
                defaultValue={values.r_minor}
                onChange={handleInputChange}
                error={errors.r_minor}
                type='number'
                placeholder='0'
              />
            </Grid>
          </Grid>
        </Paper>
        {/* defect fix data */}
        <Paper sx={{ p: 2, mt: 2 }}>
          <p className="body1">Defect Fix Data</p>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Input
                label="Defects Retested"
                name="defectsRetested"
                defaultValue={values.defectsRetested}
                onChange={handleInputChange}
                error={errors.defectsRetested}
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                label="Defects Fixed"
                name="defectsFixed"
                defaultValue={values.defectsFixed}
                onChange={handleInputChange}
                error={errors.defectsFixed}
                type="number"
                placeholder="0"
              />
            </Grid>
          </Grid>
        </Paper>
      </Form>
    </>
  );
};

export default EditManualEntry;
