import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
} from "@mui/material";
import axios from "axios";
import { React, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDefectsEndPoint } from "../../Config/Endpoints";
import DialogBox from "../controls/DialogBox";
import { toast } from "react-toastify";
import RecordNotFound from "../RecordNotFound";
import { permDefectsAdd, permDefectsDelete, permDefectsEdit } from "../../AccessPermissions/DefectPermissions";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { allowPastSprint, shortDateFormat } from "../../Utils/AppExtensions";

const Defects = (props) => {
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
  const [currentDeffect, setCurrentDefect] = useState({});

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
      const response = await axios.get(getDefectsEndPoint(props.project.id), {
        params: parms,
      });
      console.log("Defects-Data", response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDeleteDefect = () => {
    axios
      .delete(getDefectsEndPoint(currentDeffect?._id))
      .then((response) => {
        console.log(response);
        toast.success("Defect deleted successfully!");
        getData(parms, props);
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not delete Defect. please contact admin");
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
            {userCapabilities.some(e => e === permDefectsAdd) && allowPastSprint(props.currentSprint?.start_date, props.currentSprint?.end_date) &&
              < Button
                className="float-right"
                onClick={() =>
                  navigate("/add-defects", { state: { project: currentProject, tabIndex: props.tabIndex, currentSprint: props.currentSprint } })
                }
                variant="contained"
              >
                Add New Defect
              </Button>
            }
          </Grid>
        </Grid>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Defect Id</TableCell>
              <TableCell>Defect Title</TableCell>
              <TableCell>Entry Date</TableCell>
              <TableCell>Defect Reported Date</TableCell>
              <TableCell>Defect Closed Date</TableCell>
              <TableCell>Defect Age</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.defects?.map((currentRow, index) => (
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
                    {currentRow.display_id}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.display_name ? currentRow.display_name : "---"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(currentRow.entry_date).toLocaleString("en-IN", shortDateFormat)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {new Date(currentRow.reported_date).toLocaleString("en-IN", shortDateFormat)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.closed_date ? new Date(currentRow.closed_date).toLocaleString("en-IN", shortDateFormat) : "-"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.defect_age ? currentRow.defect_age : "-"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.status === "open" ? <span className="status-passed">Open</span> :
                    <span className="status-failed">Closed</span>}
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* <Button 
                                        variant='outlined'
                                        size='small'
                                    >See Detail</Button> */}
                  <Stack direction="row" spacing={2}>
                    {userCapabilities.some(e => e === permDefectsEdit) &&
                      <Tooltip title={"Edit Details of " + currentRow.display_id}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate("/edit-defect", {
                              state: {
                                defect: currentRow,
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
                    {userCapabilities.some(e => e === permDefectsDelete) &&
                      <Tooltip title={"Delete " + currentRow.display_id}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setCurrentDefect(currentRow);
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
        {data?.defects?.length ? (
          <TablePagination
            rowsPerPageOptions={[1, 5, 10, 15, 20]}
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
          title={"Delete Defect " + currentDeffect?.display_id}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          onConfirm={handleDeleteDefect}
        >
          Are you sure you want to delete Defect {currentDeffect?.display_id}?
        </DialogBox>
      </TableContainer>
    </div >
  );
};

export default Defects;
