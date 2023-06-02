import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid, IconButton,
  InputAdornment, OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
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
import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { React, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { permActivitiesView } from "../AccessPermissions/ActivitiesPermissions";
import { permBuildsAdd, permBuildsDelete, permBuildsEdit } from "../AccessPermissions/BuildsPermissions";
import { buildsEndpoint, getBuildsEndPoint, getBuildsExecutionTimeEndPoint } from "../Config/Endpoints";
import { allowPastSprint } from "../Utils/AppExtensions";
import DialogBox from "./controls/DialogBox";
import RecordNotFound from "./RecordNotFound";

const Builds = (props) => {
  const sprintId = props.currentSprint?._id ? props.currentSprint?._id : null
  const navigate = useNavigate();
  const userCapabilities = props.userCapabilities
  const location = useLocation();
  const currentProject = props.project;

  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [openEditBuildDialog, setOpenEditBuildDialog] = useState(false);
  const [openBuildClosure, setOpenBuildClosure] = useState(false);
  const [openEditClosureDialog, setOpenEditClosureDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [parms, setParms] = useState({});
  const [currentBuild, setCurrentBuild] = useState({});
  const [executionTime, setExecutionTime] = useState([]);

  const [keyField, setKeyField] = useState("");

  const [statusValue, setStatusValue] = useState(null);
  const [closureReport, setClosureReport] = useState("");
  const [buildNameError, setBuildNameError] = useState(false);
  const [buildSummaryError, setBuildSummaryError] = useState(false);

  const isBetween = require('dayjs/plugin/isBetween')
  dayjs.extend(isBetween)

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setBuildNameError(false)
    setBuildSummaryError(false)
    const data = new FormData(e.currentTarget);
    const buildNumber = data.get("buildName");
    const buildSummary = data.get("buildSummary");
    const payload = {
      build_number: buildNumber,
      project_id: currentProject.id,
      sprint_id: sprintId,
      summary: buildSummary
    };

    if (buildNumber === "")
      setBuildNameError(true)
    if (buildSummary === "")
      setBuildSummaryError(true)

    if (buildNumber && buildSummary) {
      axios
        .post(buildsEndpoint, payload)
        .then((response) => {
          console.log(response);
          setOpen(false);
          getData(parms, props);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const getData = useCallback(async (parms, props) => {
    try {
      const response = await axios.get(getBuildsEndPoint(props.project.id), {
        params: parms,
      });
      console.log("Builds-Data", response.data.data);
      setData(response.data.data);
    } catch (e) {
      console.error(e);
    }
  }, [])

  const getExecutionTime = useCallback(async (props) => {
    try {
      const response = await axios.get(getBuildsExecutionTimeEndPoint(props.project.id), {
        params: { sprintId: props.currentSprint?._id },
      });
      console.log("BuildsExecutionTimeData", response.data.data);
      setExecutionTime(response.data.data)
    } catch (e) {
      console.error(e);
    }
  }, [])

  const handleDeleteBuild = () => {
    axios
      .delete(getBuildsEndPoint(currentBuild?._id))
      .then((response) => {
        console.log(response);
        toast.success("Build deleted successfully!");
        getData(parms, props);
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not delete build. please contact admin");
      });
  };

  const handleEditBuild = () => {
    axios
      .put(getBuildsEndPoint(currentBuild?._id), { status: statusValue })
      .then((response) => {
        console.log(response);
        toast.success("Build Updated successfully!");
        getData(parms, props);
        setOpenEditBuildDialog(false)
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not Update build. please contact admin");
        setOpenEditBuildDialog(false)
      });
  }

  const handleEditClosure = () => {
    axios
      .put(getBuildsEndPoint(currentBuild?._id + "/addreport"), { report: closureReport })
      .then((response) => {
        console.log(response);
        toast.success("Build Closure Report Added successfully!");
        getData(parms, props);
        setOpenEditClosureDialog(false)
      })
      .catch((err) => {
        console.error(err);
        toast.info("Could not Update Build Closure Report. Please try again!");
        setOpenEditClosureDialog(false)
      });
  }

  const handleClose = () => {
    setOpen(false)
    setBuildSummaryError(false)
    setBuildNameError(false)
  }

  const handleDownloadPdf = (e) => {

    const but = e.target;
    but.style.display = "none";
    let input = window.document.getElementsByClassName("div2PDF")[0];

    html2canvas(input, { scale: 1.5 }).then((canvas) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "A4", true);
      pdf.setFillColor(245);
      pdf.rect(0, 0, 210, 700, "F");

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        img,
        "png",
        2,
        2,
        width - 5,
        height - 5
      );
      pdf.save("chart.pdf");
      but.style.display = "block";
    });
  }

  const handleDownloadBuildReport = () => {
    setOpenBuildClosure(false)
  }

  const renderExecutionTime = (execTime) => {

    const h = Math.trunc(execTime)
    const m = Math.ceil((execTime - Math.trunc(execTime)) * 60)

    return (h + "h " + m + "m")
  }

  useEffect(() => {
    updateParams("sprintId", sprintId)
  }, [sprintId]);

  useEffect(() => {
    getData(parms, props);
    getExecutionTime(props)
  }, [getData, getExecutionTime, parms, props]);

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
            {userCapabilities.some(e => e === permBuildsAdd) && allowPastSprint(props.currentSprint?.start_date, props.currentSprint?.end_date) && props.currentSprint !== "All" &&
              <Button
                className="float-right"
                variant="contained"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Add New Build
              </Button>
            }
            <Button style={{display:"none"}}
              className="float-right"
              sx={{ mr: 1 }}
              variant="outlined"
              onClick={(e) => handleDownloadPdf(e)}
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Build Name</TableCell>
              <TableCell>No of Activities</TableCell>
              <TableCell>No of Runs</TableCell>
              <TableCell>No of Manual Launches</TableCell>
              <TableCell>No of Automation Launches</TableCell>
              <TableCell>Execution Time</TableCell>
              <TableCell>Overall Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.builds.map((currentRow, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  <span
                    className="hyper-link"
                    onClick={() => {
                      if (userCapabilities.some(e => e === permActivitiesView))
                        navigate("/build-portal", { state: { build: currentRow, project: currentProject, currentSprint: props.currentSprint } })
                      else toast.info("You don't have permission to perform this operation. please contact admin!")
                    }
                    }
                  >
                    {currentRow.build_number}
                  </span>
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.activities.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.runs.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.mlaunches.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.alaunches.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {executionTime?.map(item => {
                    return (currentRow._id === item?._id ? renderExecutionTime(item.executionTime) : "")
                  })}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.status ?
                    currentRow.status === "passed" ? <span className="status-passed">Passed</span> :
                      currentRow.status === "failed" ? <span className="status-failed">Failed</span> :
                        <span className="status-skipped">Onhold</span>
                    : "-"}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Stack direction="row" spacing={0}>

                    {userCapabilities.some(e => e === permBuildsEdit) &&

                      <Tooltip placement="top" title={"Edit " + currentRow.build_number}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setStatusValue(currentRow.status ? currentRow.status : null)
                            setCurrentBuild(currentRow);
                            setOpenEditBuildDialog(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }

                    <Tooltip placement="top" title={"View Build Closure Report of " + currentRow.build_number}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setOpenBuildClosure(true);
                          setCurrentBuild(currentRow);
                        }}
                      >
                        <InsertDriveFileIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {userCapabilities.some(e => e === permBuildsDelete) && allowPastSprint(props.currentSprint?.start_date, props.currentSprint?.end_date) &&
                      <Tooltip title={"Delete " + currentRow.build_number}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setOpenDeleteDialog(true);
                            setCurrentBuild(currentRow);
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
        {data?.builds?.length ? (
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
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="sm"
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <DialogTitle>
              <div>
                <Tooltip title="Close">
                  <IconButton
                    style={{
                      float: "right",
                      cursor: "pointer",
                      marginTop: "-5px",
                    }}
                    onClick={handleClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
                <p className="sub-heading">Add New Build </p>
              </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box sx={{ p: 1 }}>
                <Stack spacing={3}>
                  <TextField
                    autoComplete="build-name"
                    name="buildName"
                    required
                    fullWidth
                    placeholder="Enter build name"
                    label="Build Name"
                    autoFocus
                    error={buildNameError}
                    helperText={buildNameError ? "Build Name is Mandatory" : ""}
                  />

                  <TextField
                    autoComplete="build-summary"
                    name="buildSummary"
                    required
                    fullWidth
                    placeholder="Enter build Summary"
                    label="Build Summary"
                    multiline
                    rows={5}
                    error={buildSummaryError}
                    helperText={buildSummaryError ? "Build Summary is Mandatory" : ""}
                  />

                  {/* <TextField
                    autoComplete="environment"
                    name="environment"
                    required
                    fullWidth
                    placeholder="Select environment"
                    label="Environment"
                    select
                  >
                    <MenuItem value="prod">Production</MenuItem>
                    <MenuItem value="dev">Development</MenuItem>
                  </TextField> */}
                </Stack>
              </Box>
            </DialogContent>
            <Divider />
            <DialogActions>
              <Button variant="outlined" onClick={handleClose}>
                No
              </Button>
              <Button type="submit" variant="contained" autoFocus>
                Save
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
        <DialogBox
          title={"Delete Build " + currentBuild?.build_number}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          onConfirm={handleDeleteBuild}
        >
          Are you sure you want to delete {currentBuild?.build_number}? All the data under this build will be deleted also.
        </DialogBox>

        {/* view build closure report dialog */}
        <Dialog
          open={openBuildClosure}
          onClose={() => setOpenBuildClosure(false)}
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
                  onClick={() => setOpenBuildClosure(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">View Build Closure Report </p>
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
              <Grid item xs={3}>
                Build Summary :
              </Grid>
              <Grid item xs={9}>
                {currentBuild.summary}
              </Grid>
              <Grid item xs={3}>
                Closure Report:
              </Grid>
              <Grid item xs={9}>
                {currentBuild.report?.content ? currentBuild.report.content : "-"}
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button style={{display:"none"}} variant="outlined" onClick={handleDownloadBuildReport}>
              Download Build Report
            </Button>
            {userCapabilities.some(e => e === permBuildsEdit) &&
              <Button onClick={() => {
                setOpenBuildClosure(false)
                setOpenEditClosureDialog(true)
              }} variant="contained" autoFocus>
                Edit
              </Button>
            }
          </DialogActions>
        </Dialog>

        {/* edit build dialog */}

        <Dialog
          open={openEditBuildDialog}
          onClose={() => setOpenEditBuildDialog(false)}
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
                  onClick={() => setOpenEditBuildDialog(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">Edit Build </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <RadioGroup
                row
                value={statusValue}
                onChange={handleStatusChange}
              >
                <FormControlLabel value="passed" control={<Radio />} label="Passed" />
                <FormControlLabel value="failed" control={<Radio />} label="Failed" />
                <FormControlLabel value="onhold" control={<Radio />} label="Onhold" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpenEditBuildDialog(false)}>
              cancel
            </Button>
            <Button onClick={handleEditBuild} variant="contained" autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* edit closure dialog */}

        <Dialog
          open={openEditClosureDialog}
          onClose={() => setOpenEditClosureDialog(false)}
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
                  onClick={() => setOpenEditClosureDialog(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <p className="sub-heading">Edit Build Closure Report </p>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                Sprint Name
              </Grid>
              <Grid item xs={8}>
                {props.currentSprint?.sprint_name}
              </Grid>
              <Grid item xs={4}>
                Build Name :
              </Grid>
              <Grid item xs={8}>
                {currentBuild?.build_number}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Closure Report"
                  placeholder="Write here your build closure..."
                  value={closureReport}
                  multiline
                  rows={5}
                  onChange={(e) => setClosureReport(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button variant="outlined" onClick={() => setOpenEditClosureDialog(false)}>
              cancel
            </Button>
            <Button onClick={handleEditClosure} variant="contained">
              save
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </div>
  );
};

export default Builds;
