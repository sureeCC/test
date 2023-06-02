import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button, Dialog, DialogActions,
  DialogContent,
  DialogTitle, Divider, FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import humanizeDuration from "humanize-duration";
import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getManualLaunchesEndPoint } from "../Config/Endpoints";
import { shortFullDateFormat } from "../Utils/AppExtensions";
import DialogBox from "./controls/DialogBox";
import RecordNotFound from "./RecordNotFound";

const ManualLaunches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = location?.state?.project;
  const currentBuild = location?.state?.build;
  const currentRun = location?.state?.runs;
  const currentActivity = location?.state?.activity;

  const [data, setData] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState(0);
  const [parms, setParms] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [currentLaunch, setCurrentLaunch] = React.useState({});

  const [keyField, setKeyField] = React.useState("");
  const [execDateField, setExecDateField] = React.useState("");

  const handleClearFilters = () => {
    setKeyField("");
    setStartDate(null);
    setParms({});
  };

  const getData = async (parms) => {
    try {
      const response = await axios.get(
        getManualLaunchesEndPoint(currentRun._id),
        { params: parms }
      );
      console.log("Manual-Launches-Data", response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleKeyPress = (event) => {
    updateParams("key", event.target.value);
  };

  const updateParams = (key, value) => {
    setParms((curr) => {
      curr[key] = value;
      return { ...curr };
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    updateParams("pageNumber", newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    updateParams("pageSize", event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDeleteLaunch = () => {
    axios
      .delete(getManualLaunchesEndPoint(currentLaunch?._id))
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
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={3}>
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

          <Grid item xs={3}>
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
              <TableCell>Executed TC's</TableCell>
              <TableCell>Passed</TableCell>
              <TableCell>Failed</TableCell>
              <TableCell>Total Defects Found</TableCell>
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
                {/* <TableCell component="th" scope="row"><Link variant="body2" className='cursor-pointers' > {currentRow.lName} </Link></TableCell> */}
                <TableCell component="th" scope="row">
                  <span
                    className="hyper-link"
                    onClick={() =>
                    // navigate("/edit-manual-entry", {
                    //   state: {
                    //     project: currentProject,
                    //     runs: currentRun,
                    //     build: currentBuild,
                    //     mLaunch: currentRow,
                    //   },
                    // })
                    {
                      setOpenViewDialog(true);
                      setCurrentLaunch(currentRow);
                    }
                    }
                  >
                    {currentRow.launch_name}
                  </span>
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow?.metrics?.executed_testcases}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.metrics?.passed_testcases}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.metrics?.failed_testcases}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.defect_finding_data?.total_defects}
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(currentRow.execution_date).toLocaleString("en-IN", shortFullDateFormat)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* {Math.floor(currentRow.metrics?.execution_time / 3.6e+6)}h {Math.ceil(currentRow.metrics?.execution_time / 60000 % 60)}m */}
                  {Math.floor(currentRow.metrics?.execution_time / 60)}h {Math.ceil(currentRow.metrics?.execution_time % 60)}m
                </TableCell>
                <TableCell>
                  {currentRow.metrics?.overallstatus === "failed" ? (
                    <span className="status-failed">
                      {currentRow.metrics?.overallstatus}
                    </span>
                  ) : currentRow.metrics?.overallstatus === "passed" ? (
                    <span className="status-passed">
                      {currentRow.metrics?.overallstatus}
                    </span>
                  ) : (
                    <span className="status-skipped">
                      {currentRow.metrics?.overallstatus}
                    </span>
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2}>
                    <Tooltip title={"Edit Details of " + currentRow.launch_name}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setOpenViewDialog(false);
                          navigate("/edit-manual-entry", {
                            state: {
                              project: currentProject,
                              runs: currentRun,
                              build: currentBuild,
                              mLaunch: currentRow,
                              activity: currentActivity
                            },
                          });
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
            count={data.total}
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

        {/* view dialog goes from here */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            <div>
              <Tooltip title="Close">
                <IconButton
                  style={{
                    float: "right",
                    cursor: "pointer",
                    marginTop: "-5px",
                  }}
                  onClick={() => setOpenViewDialog(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">
                Launch Detail of Launch {currentLaunch?.launch_name}{" "}
              </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Project Name :
              </Grid>
              <Grid item xs={3}>
                {currentProject.display_name}
              </Grid>
              <Grid item xs={3}>
                Created Date :
              </Grid>
              <Grid item xs={3}>
                {new Date(currentLaunch?.createdAt).toLocaleString("en-IN", shortFullDateFormat)}
              </Grid>

              <Grid item xs={3}>
                Build Name :
              </Grid>
              <Grid item xs={3}>
                {currentBuild.build_number}
              </Grid>
              <Grid item xs={3}>
                Last Updated Date :
              </Grid>
              <Grid item xs={3}>
                {new Date(currentBuild.updatedAt).toLocaleString("en-IN", shortFullDateFormat)}
              </Grid>

              <Grid item xs={3}>
                Run Name :
              </Grid>
              <Grid item xs={3}>
                {currentRun.run_name}
              </Grid>
              <Grid item xs={3}>
                Executed Date :
              </Grid>
              <Grid item xs={3}>
                {new Date(currentLaunch?.execution_date).toLocaleString("en-IN", shortFullDateFormat)}
              </Grid>
              <Grid item xs={3}>
                Launch Name :
              </Grid>
              <Grid item xs={3}>
                {currentLaunch?.launch_name}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <p className="body1">Defect Finding Data</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      Blockers :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_finding_data?.blockers}
                    </Grid>

                    <Grid item xs={6}>
                      Critical :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_finding_data?.critical_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Major :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_finding_data?.major_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Minor :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_finding_data?.minor_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Rejected :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_finding_data?.rejected_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Total :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_finding_data?.total_defects}
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <p className="body1">Test Execution Volumetric</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      Planned TCs :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.metrics?.planned_testcases}
                    </Grid>

                    <Grid item xs={6}>
                      Executed TCs :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.metrics?.executed_testcases}
                    </Grid>

                    <Grid item xs={6}>
                      Passed TCs :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.metrics?.passed_testcases}
                    </Grid>

                    <Grid item xs={6}>
                      Failed TCs :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.metrics?.failed_testcases}
                    </Grid>

                    <Grid item xs={6}>
                      Blocked TCs :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.metrics?.blocked_testcases}
                    </Grid>

                    <Grid item xs={6}>
                      Execution Time :
                    </Grid>
                    <Grid item xs={6}>
                      {/* {humanizeDuration(currentLaunch?.metrics?.execution_time)} */}
                      {Math.floor(currentLaunch.metrics?.execution_time / 60)}h {Math.ceil(currentLaunch.metrics?.execution_time % 60)}m
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <p className="body1">Defect Fix Data</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      Defect Retested :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_fix_data?.retested_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Defect Fixed :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_fix_data?.fixed_defects}
                    </Grid>
                  </Grid>
                </Stack>
                <br />
                <p className="body1">Defect Rejected Data</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      Blockers:
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_rejected_data?.blockers}
                    </Grid>

                    <Grid item xs={6}>
                      Critical :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_rejected_data?.critical_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Major :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_rejected_data?.major_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Minor :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.defect_rejected_data?.minor_defects}
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <p className="body1">New Testcases Added</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      P0 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.new_testcases_added?.p0}
                    </Grid>

                    <Grid item xs={6}>
                      P1 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.new_testcases_added?.p1}
                    </Grid>

                    <Grid item xs={6}>
                      P2 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.new_testcases_added?.p2}
                    </Grid>

                    <Grid item xs={6}>
                      P3 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.new_testcases_added?.p3}
                    </Grid>

                    <Grid item xs={6}>
                      P4 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.new_testcases_added?.p4}
                    </Grid>

                    <Grid item xs={6}>
                      Total TC's :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.new_testcases_added?.total_new_testcases}
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

              <Grid item xs={6}></Grid>

              <Grid item xs={6}>
                <p className="body1">Testcases Updated</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      P0 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.testcases_updated?.p0}
                    </Grid>

                    <Grid item xs={6}>
                      P1 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.testcases_updated?.p1}
                    </Grid>

                    <Grid item xs={6}>
                      P2 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.testcases_updated?.p2}
                    </Grid>

                    <Grid item xs={6}>
                      P3 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.testcases_updated?.p3}
                    </Grid>

                    <Grid item xs={6}>
                      P4 :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.testcases_updated?.p4}
                    </Grid>

                    <Grid item xs={6}>
                      Total TC's :
                    </Grid>
                    <Grid item xs={6}>
                      {currentLaunch?.testcases_updated?.total_updated_testcases}
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>

            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ mt: 1, mb: 1 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setOpenDeleteDialog(true);
              }}
            >
              Delete
            </Button>
            <Button
              sx={{ width: 95, mr: 2 }}
              variant="contained"
              onClick={() => {
                setOpenViewDialog(false);
                navigate("/edit-manual-entry", {
                  state: {
                    project: currentProject,
                    runs: currentRun,
                    build: currentBuild,
                    mLaunch: currentLaunch,
                    activity: currentActivity
                  },
                });
              }}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
};

export default ManualLaunches;
