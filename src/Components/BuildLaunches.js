import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment, MenuItem,
  OutlinedInput,
  Paper, Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import PropTypes from "prop-types";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { permLaunchesAdd } from "../AccessPermissions/LaunchesPermissions";
import { getAutomationLaunches } from "../Config/Endpoints";
import { shortFullDateFormat } from "../Utils/AppExtensions";
import DialogBox from "./controls/DialogBox";
import ManualLaunches from "./ManualLaunches";
import RecordNotFound from "./RecordNotFound";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BuildLaunches = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCapabilities = props.userCapabilities
  const currentProject = location?.state?.project;
  const currentBuild = location?.state?.build;
  const currentRun = location?.state?.runs;
  const currentActivity = location?.state?.activity
  const tabIndex = location.state.tabIndex ? location.state.tabIndex : 0;
  console.log(currentRun)

  const [data, setData] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [value, setValue] = React.useState(tabIndex);
  const [item, setItem] = React.useState({});
  const [parms, setParms] = React.useState({});
  const [startDate, setStartDate] = React.useState(null);
  const [openStart, setOpenStart] = React.useState(false);
  const [endDate, setEndDate] = React.useState();
  const [openEnd, setOpenEnd] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [currentLaunch, setCurrentLaunch] = React.useState({});

  const [keyField, setKeyField] = React.useState("");
  const [sourceField, setSourceField] = React.useState("");
  const [execDateField, setExecDateField] = React.useState("");

  const handleClearFilters = () => {
    setKeyField("");
    setSourceField("");
    setStartDate(null);
    setParms({});
  };

  const handleKeyPress = (event) => {
    updateParams("key", event.target.value);
  };

  const handleStatusChange = (e) => {
    updateParams("source", e.target.value);
  };

  const updateParams = (key, value) => {
    setParms((curr) => {
      curr[key] = value;
      return { ...curr };
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBuildClick = (item) => {
    console.log("LaunchId: ", item);
    //navigate('/test-reports', { state: { item: item } })
    setItem(item);
  };

  const getData = async (parms) => {
    try {
      const response = await axios.get(getAutomationLaunches(currentRun._id), {
        params: parms,
      });
      console.log("Automation-Launches-Data", response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLaunch = () => {
    axios
      .delete(getAutomationLaunches(currentLaunch?._id))
      .then((response) => {
        console.log(response);
        toast.success("Launch deleted successfully!");
        getData(parms);
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not delete Launch. please contact admin");
      });
  };

  React.useEffect(() => {
    getData(parms);
    //console.warn(currentProject, currentBuild, currentRun)
  }, [parms]);
  return (
    <>
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
                    navigate("/build-runs", {
                      state: { build: currentBuild, project: currentProject, activity: currentActivity, runs: currentRun, },
                    })
                  }
                  variant="outlined"
                >
                  <KeyboardBackspaceSharpIcon />
                </Button>
              </Grid>
              <Grid item>
                <p className="heading">Launches of Run {currentRun.run_name} / {currentActivity.display_name}</p>
              </Grid>
            </Grid>
          </div>
          <div>
            {/* <Button
                            onClick={() => navigate(-2)}
                            variant="outlined"
                            sx={{ mr: 1 }}>Cancel
                        </Button> */}
            {userCapabilities.some(e => e === permLaunchesAdd) &&
              <Button
                onClick={() =>
                  navigate("/new-manual-entry", {
                    state: {
                      project: currentProject,
                      runs: currentRun,
                      build: currentBuild,
                      activity: currentActivity
                    },
                  })
                }
                variant="contained"
              >
                Add New Manual Entry
              </Button>
            }
          </div>
        </Stack>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabChange}>
          <Tab label="Manual" {...a11yProps(0)} />
          <Tab label="Automated" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={1}>
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <OutlinedInput
                  size="small"
                  placeholder="Search"
                  value={keyField}
                  onChange={(e) => {
                    setKeyField(e.target.value);
                    handleKeyPress(e);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <SearchSharpIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                select
                size="small"
                label="Source"
                value={sourceField}
                onChange={(e) => {
                  setSourceField(e.target.value);
                  handleStatusChange(e);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="selenium">Selenium</MenuItem>
                <MenuItem value="katalon">Katalon</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    inputFormat="dd/MM/yyyy"
                    open={openStart}
                    onOpen={() => setOpenStart(true)}
                    onClose={() => setOpenStart(false)}
                    label="Execution Date"
                    value={startDate}
                    disableFuture
                    minDate={new Date("2022-01-01")}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      updateParams("startDate", newValue);
                    }}
                    renderInput={(params) => {
                      return (
                        <TextField
                          size="small"
                          {...params}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onClick={(e) => setOpenStart(true)}
                        />
                      );
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow className="table-head-background">
                <TableCell>S. No</TableCell>
                <TableCell>Launch Name</TableCell>
                <TableCell>Suite Name</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Passed</TableCell>
                <TableCell>Failed</TableCell>
                <TableCell>Skipped</TableCell>
                <TableCell>Executed Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Overall Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.launches?.map((currentRow, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{index + 1}</TableCell>
                  {/* <TableCell component="th" scope="row"><Link variant="body2" className='cursor-pointer' onClick={() => handleBuildClick(currentRow)} > {currentRow.build_number} </Link></TableCell> */}
                  <TableCell component="th" scope="row">
                    <span
                      className="hyper-link"
                      onClick={() =>
                        navigate("/test-cases", {
                          state: {
                            project: currentProject,
                            runs: currentRun,
                            build: currentBuild,
                            launch: currentRow,
                            activity: currentActivity
                          },
                        })
                      }
                    >
                      {currentRow.launch_name}
                    </span>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.suite_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.environment}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.source}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.total_testcases}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.passed_testcases}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.failed_testcases}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.skipped_testcases}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {new Date(currentRow.start_time).toLocaleString("en-IN", shortFullDateFormat)}
                  </TableCell>
                  {/* <TableCell component="th" scope="row">{new Date(currentRow.end_time).toLocaleString("en-IN",shortDateFormat)}</TableCell> */}
                  <TableCell component="th" scope="row">
                    {/* {humanizeDuration(currentRow?.duration, { units: ["ms"] })} */}
                    {Math.floor(currentRow?.duration / 3.6e+6)}h {Math.ceil(currentRow?.duration / 60000 % 60)}m
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currentRow.overallstatus === "failed" ? (
                      <span className="status-failed">
                        {currentRow.overallstatus}
                      </span>
                    ) : currentRow.overallstatus === "passed" ? (
                      <span className="status-passed">
                        {currentRow.overallstatus}
                      </span>
                    ) : (
                      <span className="status-skipped">
                        {currentRow.overallstatus}
                      </span>
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Stack direction="row" spacing={2}>
                      <Tooltip title={"Delete " + currentRow.launch_name}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setCurrentLaunch(currentRow);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data?.launches?.length ? (
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              component="div"
              count={data?.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          ) : (
            <RecordNotFound onClearFilters={handleClearFilters} />
          )}
          <DialogBox
            title={"Delete Launch " + currentLaunch?.launch_name}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
            onConfirm={handleDeleteLaunch}
          >
            Are you sure you want to delete Launch {currentLaunch?.launch_name}?
          </DialogBox>
        </TableContainer>
      </TabPanel>
      <TabPanel value={value} index={0}>
        <ManualLaunches />
      </TabPanel>
    </>
  );
};

export default BuildLaunches;
