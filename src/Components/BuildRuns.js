import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
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
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getRunsEndPoint, runsEndpoint } from "../Config/Endpoints";
import DialogBox from "./controls/DialogBox";
import RecordNotFound from "./RecordNotFound";
import { permRunsAdd, permRunsDelete } from "../AccessPermissions/RunsPermissions";
import { permLaunchesView } from "../AccessPermissions/LaunchesPermissions";

const BuildRuns = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCapabilities = props.userCapabilities
  const currentActivity = location?.state?.activity ? location?.state?.activity : {};
  const currentSprint = location?.state?.sprint ? location?.state?.sprint : {};
  const currentProject = location?.state?.project;
  const currentBuild = location?.state?.build
  const run = location?.state?.runs

  const [data, setdata] = React.useState();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [parms, setParms] = React.useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [currentRun, setCurrentRun] = React.useState(run);

  const [keyField, setKeyField] = React.useState("");

  const handleClearFilters = () => {
    setKeyField("");
    setParms({});
  };

  const updateParams = (key, value) => {
    setParms((curr) => {
      curr[key] = value;
      return { ...curr };
    });
  };

  const handleKeyPress = (event) => {
    updateParams("key", event.target.value);
  };

  const handleStatusChange = (e) => {
    updateParams("status", e.target.value);
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

  const getData = React.useCallback(async (parms) => {
    try {
      const response = await axios.get(getRunsEndPoint(currentActivity._id), {
        params: parms,
      });
      console.log("Build-Runs-Data", response.data.data);
      setdata(response.data.data);
    } catch (e) {
      console.error(e);
    }
  }, [currentActivity._id]);

  const handleNewRun = () => {
    axios
      .post(runsEndpoint, {
        activity_id: currentActivity._id,
        project_id: currentProject.id,
        project_code: currentProject.display_id,
      })
      .then((response) => {
        toast.success("Run created successfully!");
        setOpen(false);
        getData(parms);
      })
      .catch((err) => {
        toast.error("Something went wrong, please contact admin!");
        setOpen(false);
      });
  };

  const handleDeleteRun = () => {
    axios
      .delete(getRunsEndPoint(currentRun?._id))
      .then((response) => {
        console.log(response);
        toast.success("Run deleted successfully!");
        getData(parms);
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not delete Run. please contact admin");
      });
  };

  React.useEffect(() => {
    getData(parms);
  }, [getData, location.state, parms]);

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
                    navigate("/build-portal", {
                      state: { tabIndex: 1, project: currentProject, build: currentBuild, runs: currentRun, currentSprint: currentSprint },
                    })
                  }
                  variant="outlined"
                >
                  <KeyboardBackspaceSharpIcon />
                </Button>
              </Grid>
              <Grid item>
                <p className="heading">
                  Runs of Activity {currentActivity.display_name}
                </p>
              </Grid>
            </Grid>
          </div>
          <div>
            {userCapabilities.some(e => e === permRunsAdd) &&
              <Button onClick={() => setOpen(true)} variant="contained">
                Create New Run
              </Button>
            }
          </div>
        </Stack>
      </div>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              size="small"
              placeholder="Search"
              onChange={(e) => {
                setKeyField(e.target.value);
                handleKeyPress(e);
              }}
              value={keyField}
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
      </Grid>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow className="table-head-background">
              <TableCell>S. No</TableCell>
              <TableCell>Runs</TableCell>
              <TableCell>Total Launches</TableCell>
              <TableCell>No of Automated Launches</TableCell>
              <TableCell>No of Manual Launches</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.runs?.map((currentRow, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  <span
                    className="hyper-link"
                    onClick={() => {
                      if (userCapabilities.some(e => e === permLaunchesView))
                        navigate("/build-launches", { state: { project: currentProject, activity: currentActivity, runs: currentRow, build: currentBuild } })
                      else toast.info("You are not allowed to perform this operation, please contact admin!")
                    }
                    }
                  >
                    {currentRow.run_name}
                  </span>
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.alaunches?.length + currentRow.mlaunches?.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.alaunches?.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.mlaunches?.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2}>
                    {userCapabilities.some(e => e === permRunsDelete) &&
                      <Tooltip title={"Delete " + currentRow.run_name}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setCurrentRun(currentRow);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data?.runs?.length ? (
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

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth={true}
          maxWidth="sm"
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
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">Create New Run</p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              Are you sure you want to create new run?
            </DialogContentText>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={() => setOpen(false)}>No</Button>
            <Button onClick={handleNewRun} variant="contained" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <DialogBox
          title={"Delete Run " + currentRun?.run_name}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          onConfirm={handleDeleteRun}
        >
          Are you sure you want to delete Run {currentRun?.run_name}?
        </DialogBox>
      </TableContainer>
    </>
  );
};

export default BuildRuns;
