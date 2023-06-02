import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
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
import { toast } from "react-toastify";
import {
  permActivityListAdd,
  permActivityListDelete,
  permActivityListEdit,
} from "../../AccessPermissions/ActivityListPermissions";
import { activityListEndpoint } from "../../Config/Endpoints";
import { allowPastSprint } from "../../Utils/AppExtensions";
import { showProgressBar } from "../../Utils/ProgressBar";
import DialogBox from "../controls/DialogBox";
import RecordNotFound from "../RecordNotFound";

const ActivityList = (props) => {
  const userCapabilities = props.userCapabilities ? props.userCapabilities : "";
  const currentSprint = props.currentSprint ? props.currentSprint : {};

  const isBetween = require("dayjs/plugin/isBetween");
  dayjs.extend(isBetween);

  const [data, setdata] = useState({});

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState({});
  const [parms, setParms] = React.useState({});

  const [keyField, setKeyField] = React.useState("");

  const [openAddNewDialog, setOpenAddNewDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [activityName, setActivityName] = React.useState("");
  const [activityNameError, setActivityNameError] = React.useState(false);
  const [editActivityName, setEditActivityName] = React.useState("");
  const [editActivityNameError, setEditActivityNameError] =
    React.useState(false);

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
  }, [parms]);

  const handleKeyPress = (event) => {
    updateParams("key", event.target.value);
  };

  const getData = async (parms) => {
    showProgressBar(true);
    try {
      const response = await axios.get(activityListEndpoint, { params: parms });
      console.log("ActivityList.js", response.data.data);
      setdata(response.data.data);
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
      .delete(activityListEndpoint + id)
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
    setActivityNameError(false);

    if (activityName === "") setActivityNameError(true);
    if (activityName) {
      axios
        .post(activityListEndpoint, { activity_name: activityName })
        .then((res) => {
          getData(parms);
          setOpenAddNewDialog(false);
        })
        .catch((e) => {
          console.error(e);
          setOpenAddNewDialog(false);
        });
    }
  };

  const handleEditActivity = () => {
    setEditActivityNameError(false);

    if (editActivityName === "") setEditActivityNameError(true);
    if (editActivityName) {
      axios
        .put(activityListEndpoint + selectedItem.id, {
          activity_name: editActivityName,
        })
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
    setEditActivityName("");
    setActivityNameError(false);
    setEditActivityNameError(false);
  }, [openAddNewDialog]);

  React.useEffect(() => {
    setEditActivityName(
      selectedItem.activity_name ? selectedItem.activity_name : ""
    );
  }, [openEditDialog, selectedItem.activity_name]);

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
                {userCapabilities.some((e) => e === permActivityListAdd) &&
                  allowPastSprint(
                    currentSprint?.start_date,
                    currentSprint?.end_date
                  ) && (
                    <Button
                      variant="contained"
                      onClick={() => setOpenAddNewDialog(true)}
                    >
                      Add New Activity Name
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.results?.map((currentRow, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  <Typography variant="body2">
                    {currentRow.activity_name}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={2}>
                    {userCapabilities.some(
                      (e) => e === permActivityListEdit
                    ) && (
                      <Tooltip
                        title={"Edit Details of " + currentRow.activity_name}
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
                      (e) => e === permActivityListDelete
                    ) && (
                      <Tooltip title={"Delete " + currentRow.activity_name}>
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
        {data.results?.length ? (
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
          title={"Delete " + selectedItem.activity_name + "?"}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          onConfirm={() => handleDeleteActivity(selectedItem.id)}
        >
          Are you sure you want to delete {selectedItem.activity_name} activity?
          {/* All the data under this activity will be deleted also. */}
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
            <TextField
              fullWidth
              required
              label="Activity Name"
              name="activityName"
              placeholder="Enter Activity Name"
              autoFocus
              onChange={(e) => setActivityName(e.target.value)}
              error={activityNameError}
              helperText={activityNameError ? "Activity Name is mandatory" : ""}
            />
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
            <TextField
              fullWidth
              required
              label="Activity Name"
              placeholder="Enter Activity Name"
              value={editActivityName}
              autoFocus
              onChange={(e) => setEditActivityName(e.target.value)}
              error={editActivityNameError}
              helperText={
                editActivityNameError ? "Activity Name is mandatory" : ""
              }
            />
          </DialogContent>
          <Divider />
          <DialogActions>
            {userCapabilities.some((e) => e === permActivityListDelete) && (
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
      </TableContainer>
    </>
  );
};

export default ActivityList;
