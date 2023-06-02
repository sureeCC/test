import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
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
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import * as React from "react";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  permActivitiesAdd,
  permActivitiesDelete,
  permActivitiesEdit,
} from "../../AccessPermissions/ActivitiesPermissions";
import { permRunsView } from "../../AccessPermissions/RunsPermissions";
import {
  activitiesEndPoint,
  activityListEndpoint,
} from "../../Config/Endpoints";
import { allowPastSprint } from "../../Utils/AppExtensions";
import { showProgressBar } from "../../Utils/ProgressBar";
import DialogBox from "../controls/DialogBox";
import RecordNotFound from "../RecordNotFound";

const Activities = (props) => {
  const navigate = useNavigate();
  const userCapabilities = props.userCapabilities ? props.userCapabilities : "";
  const currentBuild = props.build ? props.build : {};
  const currentProject = props.project ? props.project : {};
  const currentSprint = props.currentSprint ? props.currentSprint : {};

  const isBetween = require("dayjs/plugin/isBetween");
  dayjs.extend(isBetween);

  const [data, setdata] = useState({});
  const [activityListData, setActivityListData] = useState();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState({});
  const [parms, setParms] = React.useState({});

  const [keyField, setKeyField] = React.useState("");

  const [openAddNewDialog, setOpenAddNewDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [activityName, setActivityName] = React.useState("");
  const [activityNameError, setActivityNameError] = React.useState(false);
  const [estTimeHours, setEstTimeHours] = React.useState("");
  const [estTimeHoursError, setEstTimeHoursError] = React.useState(false);
  const [estTimeMinutes, seTestTimeMinutes] = React.useState(0);
  const [estTimeMinutesError, seTestTimeMinutesError] = React.useState(false);

  const [comment, setComment] = React.useState("");
  const [commentError, setCommentError] = React.useState(false);
  const [csvData, setCsvData] = React.useState([]);
  const csvLink = React.useRef();

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

  React.useEffect(() => {
    getData(parms);
    getActivityListData();
  }, [parms]);

  const handleKeyPress = (event) => {
    updateParams("key", event.target.value);
  };

  const getData = async (parms) => {
    showProgressBar(true);
    try {
      const response = await axios.get(activitiesEndPoint + currentBuild._id, {
        params: parms,
      });
      console.log("Activities.js", response.data.data);
      setdata(response.data.data);
    } catch (e) {
      console.error(e);
      toast.error(e.response.data.message);
    }
  };

  const getActivityListData = async () => {
    showProgressBar(true);
    try {
      const response = await axios.get(activityListEndpoint + "/all");
      console.log("ActivityList", response.data.data);
      setActivityListData(response.data.data);
    } catch (e) {
      console.error(e);
      toast.error(e.response.data.message);
    }
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

  const handleDeleteActivity = (id) => {
    console.log("Delete", id);
    axios
      .delete(activitiesEndPoint + id)
      .then((res) => {
        console.log(res);
        getData(parms);
      })
      .catch((e) => {
        console.error(e);
      });
    setOpenDeleteDialog(false);
  };

  const handleAddNewActivity = () => {
    setEstTimeHoursError(false);
    seTestTimeMinutesError(false);
    setActivityNameError(false);
    seTestTimeMinutesError(false);
    if (estTimeHours === "") setEstTimeHoursError(true);
    if (estTimeMinutes < 0 || estTimeMinutes > 59) seTestTimeMinutesError(true);
    if (activityName === "") setActivityNameError(true);
    if (estTimeHours && activityName && parseInt(estTimeMinutes) >= 0 && parseInt(estTimeMinutes) < 60) {
      const payload = {
        display_name: activityName,
        estimated_time: (parseInt(estTimeHours * 60)) + parseInt(estTimeMinutes),
        project_id: currentProject.id,
        build_id: currentBuild._id,
      };
      console.log(payload)
      axios
        .post(activitiesEndPoint, payload)
        .then((res) => {
          getData(parms);
          setOpenAddNewDialog(false);
        })
        .catch((e) => {
          console.error(e);
          setOpenAddNewDialog(false);
          toast.error(e.response.data.message)
        });
    }
  };

  const handleEditActivity = () => {
    setEstTimeHoursError(false);
    seTestTimeMinutesError(false);
    seTestTimeMinutesError(false);
    setCommentError(false);
    if (estTimeHours === "") setEstTimeHoursError(true);
    if (estTimeMinutes < 0 || estTimeMinutes > 59) seTestTimeMinutesError(true);
    if (comment === "") setCommentError(true);
    if (estTimeHours && comment && parseInt(estTimeMinutes) >= 0 && parseInt(estTimeMinutes) < 60) {
      const editPayload = {
        estimated_time: parseInt((parseInt(estTimeHours) * 60) + parseInt(estTimeMinutes)),
        comments: comment,
      }
      console.log(editPayload)
      axios
        .put(activitiesEndPoint + selectedItem._id, editPayload)
        .then((res) => {
          getData(parms);
          setOpenEditDialog(false);
          toast.success("Activity Updated");
        })
        .catch((e) => {
          console.error(e);
          toast.error(e.response.data.message);
          setOpenEditDialog(false);
        });
    }
  };

  React.useEffect(() => {
    setActivityName("");
    setEstTimeHours("");
    seTestTimeMinutes("0");
    setActivityNameError(false);
    setEstTimeHoursError(false);
    seTestTimeMinutesError(false);
  }, [openAddNewDialog]);

  React.useEffect(() => {
    setEstTimeHours(selectedItem.estimated_time ? Math.floor(selectedItem.estimated_time / 60) : "");
    seTestTimeMinutes(selectedItem.estimated_time ? selectedItem.estimated_time % 60 : "0");
    setComment(selectedItem.comments ? selectedItem.comments : "");
    setCommentError(false);
  }, [openEditDialog]);

  React.useEffect(() => {
    const { Parser } = require("json2csv");
    const source = data?.activities;

    const fields = [
      {
        label: "Activity Name",
        value: "display_name",
      },
      {
        label: "Activity Id",
        value: "display_id",
      },
      {
        label: "Estimated Time(hrs)",
        value: (item) => item.estimated_time ? Math.floor(item.estimated_time / 60) + "h : " + item.estimated_time % 60 + "m" : "-",
      },
      {
        label: "Actual Time(hrs)",
        value: (item) => item.actual_time ? Math.floor(item.actual_time / 60) + "h : " + item.actual_time % 60 + "m" : "-",
      },
      {
        label: "Variance(hrs)",
        value: "variance",
      },
      {
        label: "Comments",
        value: "comments",
      },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(source);
    setCsvData(csv);
  }, [data]);
  return (
    <>
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
        <Grid item xs={8}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1}
            className="float-right"
          >
            <div>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
              >
                <Button
                  onClick={() => csvLink.current.link.click()}
                  variant="outlined"
                >
                  Download CSV
                </Button>
                <CSVLink
                  data={csvData}
                  filename={currentProject.display_name + "_activities.csv"}
                  className="hidden"
                  ref={csvLink}
                  target="_blank"
                />
                {/* <Button variant="outlined">
                                Build Closure Report
                            </Button> */}
                {userCapabilities.some((e) => e === permActivitiesAdd) &&
                  allowPastSprint(
                    currentSprint?.start_date,
                    currentSprint?.end_date
                  ) && (
                    <Button
                      variant="contained"
                      onClick={() => setOpenAddNewDialog(true)}
                    >
                      Add New Activity
                    </Button>
                  )}
              </Stack>
            </div>
          </Stack>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow className="table-head-background">
              <TableCell>S. No</TableCell>
              <TableCell>Activity Name</TableCell>
              <TableCell>Estimated time</TableCell>
              <TableCell>Actual Time Taken</TableCell>
              <TableCell>Variance (%)</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.activities?.map((currentRow, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  <Typography
                    variant="body2"
                    style={{
                      textTransform: "none",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (userCapabilities.some((e) => e === permRunsView))
                        navigate("/build-runs", {
                          state: {
                            activity: currentRow,
                            project: currentProject,
                            build: currentBuild,
                            sprint: currentSprint,
                          },
                        });
                      else
                        toast.info(
                          "You don't have permission to perform this operation. please contact admin!"
                        );
                    }}
                  >
                    {currentRow.display_name}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* {humanizeDuration(currentRow.estimated_time * 3.6e+6)} */}
                  {Math.floor(currentRow.estimated_time / 60) + "h : " + currentRow.estimated_time % 60 + "m"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* {currentRow.actual_time ? humanizeDuration(currentRow.actual_time * 3.6e+6) : "-"} */}
                  {currentRow.actual_time ?
                    Math.floor(currentRow.actual_time / 60) + "h : " + Math.round(currentRow.actual_time % 60) + "m" : "-"}

                </TableCell>
                <TableCell component="th" scope="row">
                  {/* {currentRow.variance ? humanizeDuration(currentRow.variance * 3.6e+6) : "-"} */}
                  {currentRow.variance
                    ? (Math.round(currentRow.variance * 100) / 100).toFixed(2) +
                    "%"
                    : currentRow.variance === 0
                      ? "0%"
                      : "-"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.comments ? currentRow.comments : "-"}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2}>
                    <Tooltip
                      title={"View Details of " + currentRow.display_name}
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          setOpenViewDialog(true);
                          setSelectedItem(currentRow);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {userCapabilities.some((e) => e === permActivitiesEdit) && (
                      <Tooltip
                        title={"Edit Details of " + currentRow.display_name}
                      >
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOpenEditDialog(true);
                            setSelectedItem(currentRow);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {userCapabilities.some(
                      (e) => e === permActivitiesDelete
                    ) && (
                        <Tooltip title={"Delete " + currentRow.display_name}>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setOpenDeleteDialog(true);
                              setSelectedItem(currentRow);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.activities?.length ? (
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
          title={"Delete " + selectedItem.display_name + "?"}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          onConfirm={() => handleDeleteActivity(selectedItem._id)}
        >
          Are you sure you want to delete {selectedItem.display_name} activity?
          All the data under this activity will be deleted also.
        </DialogBox>

        {/* add new dialog */}
        <Dialog
          open={openAddNewDialog}
          onClose={() => setOpenAddNewDialog(false)}
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
                  onClick={() => setOpenAddNewDialog(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">Add New Activity </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Project Name :
              </Grid>
              <Grid item xs={9}>
                {currentProject.display_name}
              </Grid>
              <Grid item xs={3}>
                Project Code :
              </Grid>
              <Grid item xs={9}>
                {currentProject.display_id}
              </Grid>
              <Grid item xs={3}>
                Build Name :
              </Grid>
              <Grid item xs={9}>
                {currentBuild.build_number}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="activityName"
                  fullWidth
                  value={activityName}
                  select
                  label="Activity Name"
                  onChange={(e) => {
                    setActivityName(e.target.value);
                  }}
                  InputLabelProps={{ shrink: true }}
                  error={activityNameError}
                  helperText={
                    activityNameError ? "Activity Name is mandatory" : ""
                  }
                >
                  {activityListData?.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.activity_name}>
                        {item.activity_name}
                      </MenuItem>
                    );
                  })}
                  <Divider />
                  <MenuItem onClick={() => navigate("/activity-list")} value="">
                    <Typography variant="caption">Add New</Typography>
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <p className="body1">Estimate Time</p>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    required
                    label="Hours"
                    name="estimateTime"
                    placeholder="Enter Estimate Time in (hrs)"
                    autoFocus
                    type={"number"}
                    onChange={(e) =>
                      setEstTimeHours(
                        e.target.value <= 0
                          ? ""
                          : e.target.value
                      )
                    }
                    error={estTimeHoursError}
                    helperText={
                      estTimeHoursError
                        ? "Estimate Hours Time is mandatory and should be a valid number"
                        : ""
                    }
                  />

                  <TextField
                    fullWidth
                    label="Minutes"
                    name="estimateTime"
                    placeholder="Enter Estimate Time in (Minutes)"
                    autoFocus
                    type={"number"}
                    onChange={(e) => e.target.value ? seTestTimeMinutes(e.target.value) : seTestTimeMinutes(0)}
                    error={estTimeMinutesError}
                    helperText={
                      estTimeMinutesError
                        ? "Minutes must be between 0-59"
                        : ""
                    }
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setOpenAddNewDialog(false)}
            >
              cancel
            </Button>
            <Button
              onClick={handleAddNewActivity}
              variant="contained"
              autoFocus
            >
              save
            </Button>
          </DialogActions>
        </Dialog>

        {/* edit dialog */}

        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
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
                  onClick={() => setOpenEditDialog(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">Edit Activity </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Activity ID :
              </Grid>
              <Grid item xs={3}>
                {selectedItem.display_id}
              </Grid>
              <Grid item xs={3}>
                Project Name :
              </Grid>
              <Grid item xs={3}>
                {currentProject.display_name}
              </Grid>
              <Grid item xs={3}>
                Activity Name :
              </Grid>
              <Grid item xs={3}>
                {selectedItem.display_name}
              </Grid>
              <Grid item xs={3}>
                Project Code :
              </Grid>
              <Grid item xs={3}>
                {currentProject.display_id}
              </Grid>
              <Grid item xs={3}>
                Estimate Time :
              </Grid>
              <Grid item xs={3}>
                {/* {humanizeDuration(selectedItem.estimated_time * 3.6e+6)} */}
                {selectedItem.estimated_time}
              </Grid>
              <Grid item xs={3}>
                Build Name :
              </Grid>
              <Grid item xs={3}>
                {currentBuild.build_number}
              </Grid>
              <Grid item xs={12}>
                <p className="body1">Estimate Time</p>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    required
                    label="Hours"
                    name="estimateTime"
                    placeholder="Enter Estimate Time in (hrs)"
                    autoFocus
                    type={"number"}
                    value={estTimeHours}
                    onChange={(e) =>
                      setEstTimeHours(
                        e.target.value <= 0
                          ? ""
                          : e.target.value
                      )
                    }
                    error={estTimeHoursError}
                    helperText={
                      estTimeHoursError
                        ? "Estimate Hours Time is mandatory and should be a valid number"
                        : ""
                    }
                  />

                  <TextField
                    fullWidth
                    label="Minutes"
                    name="estimateTime"
                    placeholder="Enter Estimate Time in (Minutes)"
                    type={"number"}
                    value={estTimeMinutes}
                    onChange={(e) => e.target.value ? seTestTimeMinutes(e.target.value) : seTestTimeMinutes(0)}
                    error={estTimeMinutesError}
                    helperText={
                      estTimeMinutesError
                        ? "Minutes must be between 0-59"
                        : ""
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Comments"
                  name="comments"
                  placeholder="Enter Comments"
                  value={comment}
                  multiline
                  rows={5}
                  onChange={(e) => setComment(e.target.value)}
                  error={commentError}
                  helperText={commentError ? "Comment is mandatory" : ""}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            {userCapabilities.some((e) => e === permActivitiesDelete) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenEditDialog(false);
                  setOpenDeleteDialog(true);
                }}
              >
                Delete
              </Button>
            )}
            <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
              cancel
            </Button>
            <Button onClick={handleEditActivity} variant="contained">
              save
            </Button>
          </DialogActions>
        </Dialog>

        {/* view dialog */}
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
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
                  onClick={() => setOpenViewDialog(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">View Activity Details </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Activity ID :
              </Grid>
              <Grid item xs={3}>
                {selectedItem.display_id}
              </Grid>
              <Grid item xs={3}>
                Project Name :
              </Grid>
              <Grid item xs={3}>
                {currentProject.display_name}
              </Grid>
              <Grid item xs={3}>
                Activity Name :
              </Grid>
              <Grid item xs={3}>
                {selectedItem.display_name}
              </Grid>
              <Grid item xs={3}>
                Project Code :
              </Grid>
              <Grid item xs={3}>
                {currentProject.display_id}
              </Grid>
              <Grid item xs={3}>
                Estimate Time :
              </Grid>
              <Grid item xs={3}>
                {/* {humanizeDuration(selectedItem.estimated_time * 3.6e+6)} */}
                {selectedItem.estimated_time ?
                  Math.floor(selectedItem.estimated_time / 60) + "h : " + selectedItem.estimated_time % 60 + "m" : "-"}
              </Grid>
              <Grid item xs={3}>
                Build Name :
              </Grid>
              <Grid item xs={3}>
                {currentBuild.build_number}
              </Grid>
              <Grid item xs={3}>
                Actual Time(hrs) :
              </Grid>
              <Grid item xs={9}>
                {selectedItem.actual_time ?
                  Math.floor(selectedItem.actual_time / 60) + "h : " + Math.round(selectedItem.actual_time % 60) + "m" : "-"}
              </Grid>
              <Grid item xs={3}>
                Variance (%) :
              </Grid>
              <Grid item xs={9}>
                {selectedItem.variance ? selectedItem.variance : "-"}
              </Grid>
              <Grid item xs={3}>
                Comments :
              </Grid>
              <Grid item xs={9}>
                {selectedItem.comments ? selectedItem.comments : "-"}
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            {userCapabilities.some((e) => e === permActivitiesEdit) && (
              <Button
                onClick={() => {
                  setOpenViewDialog(false);
                  setOpenEditDialog(true);
                }}
                variant="contained"
                autoFocus
              >
                edit
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
};

export default Activities;
