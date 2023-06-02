import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Stack,
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import axios from "axios";
import { React, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiMatrixEndPoint, getDefectsEndPoint } from "../../Config/Endpoints";
import DialogBox from "../controls/DialogBox";
import { toast } from "react-toastify";
import RecordNotFound from "../RecordNotFound";
import { permApiMatrixAdd, permApiMatrixDelete, permApiMatrixEdit } from "../../AccessPermissions/ApiMatrixPermissions";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { allowPastSprint, shortFullDateFormat } from "../../Utils/AppExtensions";

const ApiMatrix = (props) => {
  const sprintId = props.currentSprint?._id
  const navigate = useNavigate();
  const location = useLocation();
  const userCapabilities = props.userCapabilities
  const currentProject = location?.state?.item;

  const [data, setData] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [parms, setParms] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentApiMatrix, setCurrentApiMatrix] = useState({});

  const [keyField, setKeyField] = useState("");

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    updateParams("pageNumber", newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    updateParams("pageSize", event.target.value);
  };

  const getData = useCallback(async (parms, props) => {
    try {
      const response = await axios.get(apiMatrixEndPoint + props.project.id, {
        params: parms,
      });
      console.log("API-MAtrix-Data", response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDeleteApiMatrix = () => {
    axios
      .delete(apiMatrixEndPoint + currentApiMatrix?._id)
      .then((response) => {
        console.log(response);
        toast.success("API Matrix deleted successfully!");
        getData(parms, props);
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not delete API Matrix. please contact admin");
      });
  };

  useEffect(() => {
    if (!sprintId) return
    updateParams("sprintId", sprintId)
  }, [sprintId]);

  useEffect(() => {
    getData(parms, props);
  }, [getData, parms, props]);

  return (
    <div>
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
          <Grid item xs={8}>
            {userCapabilities.some(e => e === permApiMatrixAdd) && allowPastSprint(props.currentSprint?.start_date, props.currentSprint?.end_date) &&
              <Button
                className="float-right"
                onClick={() =>
                  navigate("/add-matrix", { state: { project: currentProject, tabIndex: props.tabIndex, currentSprint: props.currentSprint } })
                }
                variant="contained"
              >
                Add New API Matrix
              </Button>
            }
          </Grid>
        </Grid>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Module Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Total Api's</TableCell>
              <TableCell>Manual Test Coverage</TableCell>
              <TableCell>Automation Test Coverage</TableCell>
              <TableCell>Automated Blocked Execution</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.apimatrixes?.map((currentRow, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  <Typography
                    className="project-name-cells"
                    variant="subtitle2"
                  >
                    {currentRow.module}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.priority}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.total_apis}
                </TableCell>
                <TableCell component="th" scope="row">
                  {(Math.round(currentRow.MT_coverage * 100) / 100).toFixed(2)}%
                </TableCell>
                <TableCell component="th" scope="row">
                  {(Math.round(currentRow.AT_coverage * 100) / 100).toFixed(2)}%
                </TableCell>
                <TableCell component="th" scope="row">
                  {(
                    Math.round(currentRow.blocked_execution * 100) / 100
                  ).toFixed(2)}
                  %
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* <Button 
                                        variant='outlined'
                                        size='small'
                                    >See Detail</Button> */}
                  <Stack direction="row" spacing={2}>
                    <Tooltip title={"View Details of " + currentRow.module}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setOpenViewDialog(true);
                          setCurrentApiMatrix(currentRow);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {userCapabilities.some(e => e === permApiMatrixEdit) &&
                      <Tooltip title={"Edit Details of " + currentRow.module}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate("/edit-matrix", {
                              state: {
                                apiMatrix: currentRow,
                                project: currentProject,
                                tabIndex: props.tabIndex,
                                currentSprint: props?.currentSprint,
                              },
                            })
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                    {userCapabilities.some(e => e === permApiMatrixDelete) &&
                      <Tooltip title={"Delete " + currentRow.module}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setCurrentApiMatrix(currentRow);
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
        {data?.apimatrixes?.length ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
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
          title={"Delete API Matrix " + currentApiMatrix?.module}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          onConfirm={handleDeleteApiMatrix}
        >
          Are you sure you want to delete {currentApiMatrix?.module}?
        </DialogBox>

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
              <p className="sub-heading">View Detail </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                Module Name :
              </Grid>
              <Grid item xs={3}>
                {currentApiMatrix.module}
              </Grid>
              <Grid item xs={3}>
                Created Date :
              </Grid>
              <Grid item xs={3}>
                {new Date(currentApiMatrix.createdAt).toLocaleString("en-IN", shortFullDateFormat)}
              </Grid>

              <Grid item xs={3}>
                Priority :
              </Grid>
              <Grid item xs={3}>
                {currentApiMatrix.module}
              </Grid>
              <Grid item xs={3}>
                Last Updated Date :
              </Grid>
              <Grid item xs={3}>
                {new Date(currentApiMatrix.createdAt).toLocaleString("en-IN", shortFullDateFormat)}
              </Grid>

              <Grid item xs={3}>
                Total API's :
              </Grid>
              <Grid item xs={9}>
                {currentApiMatrix.total_apis}
              </Grid>
              <Grid item xs={3}>
                Total TC's :
              </Grid>
              <Grid item xs={9}>
                {currentApiMatrix.total_TCs}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <p className="body1">Automation Highlights</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      Blocked Test Cases:
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.blocked_tests}
                    </Grid>

                    <Grid item xs={6}>
                      No of Defects :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.total_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Open Defects :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.open_defects}
                    </Grid>

                    <Grid item xs={6}>
                      Total Feasible TC's :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.total_feasible_TCs}
                    </Grid>

                    <Grid item xs={6}>
                      Total TC's Automated :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.total_TCs_automated}
                    </Grid>

                    {/* <Grid item xs={6}>
                                            Total Executable :
                                        </Grid>
                                        <Grid item xs={6}>
                                        {currentApiMatrix.total_TCs_exec}
                                        </Grid> */}
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <p className="body1">Manual testcase Execution Highlights</p>
                <Stack direction="row" spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      Total Executed :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.total_TCs_exec}
                    </Grid>

                    <Grid item xs={6}>
                      Total Passed :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.total_TCs_pass}
                    </Grid>

                    <Grid item xs={6}>
                      Total Failed :
                    </Grid>
                    <Grid item xs={6}>
                      {currentApiMatrix.total_TCs_fail}
                    </Grid>

                    <Grid item xs={12}>
                      <p className="body1">Coverage</p>
                    </Grid>

                    <Grid item xs={6}>
                      Manual Test Coverage :
                    </Grid>
                    <Grid item xs={6}>
                      {(
                        Math.round(currentApiMatrix.MT_coverage * 100) / 100
                      ).toFixed(2)}
                      %
                    </Grid>

                    <Grid item xs={6}>
                      Automation Test Coverage :
                    </Grid>
                    <Grid item xs={6}>
                      {(
                        Math.round(currentApiMatrix.AT_coverage * 100) / 100
                      ).toFixed(2)}
                      %
                    </Grid>

                    <Grid item xs={6}>
                      Automated Blocked Execution :
                    </Grid>
                    <Grid item xs={6}>
                      {(
                        Math.round(currentApiMatrix.blocked_execution * 100) /
                        100
                      ).toFixed(2)}
                      %
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ mt: 1, mb: 1 }}>
            {userCapabilities.some(e => e === permApiMatrixDelete) &&
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setOpenDeleteDialog(true);
                }}
              >
                Delete
              </Button>
            }
            {userCapabilities.some(e => e === permApiMatrixEdit) &&
              <Button
                sx={{ width: 95, mr: 2 }}
                variant="contained"
                onClick={() => {
                  setOpenViewDialog(false);
                  navigate("/edit-matrix", {
                    state: {
                      apiMatrix: currentApiMatrix,
                      project: currentProject,
                      tabIndex: props.tabIndex
                    },
                  });
                }}
              >
                Edit
              </Button>
            }
          </DialogActions>
        </Dialog>
      </TableContainer>
    </div>
  );
};

export default ApiMatrix;
