import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import ErrorSharpIcon from "@mui/icons-material/ErrorSharp";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import {
  Button,
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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLE_ID_TESTER, ROLE_ID_VIEW_ONLY } from "../AccessPermissions/AccessRoles";
import { permProjectAdd, permProjectEdit } from "../AccessPermissions/ProjectPermissions";
import { projectEndpoint, projectsEndpoint } from "../Config/Endpoints";
import { getUser } from "../Utils/AppExtensions";
import { showProgressBar } from "../Utils/ProgressBar";
import DialogBox from "./controls/DialogBox";
import RecordNotFound from "./RecordNotFound";

const Projects = (props) => {
  const navigate = useNavigate();
  const userCapabilities = props.userCapabilities

  const [data, setdata] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [parms, setParms] = React.useState({});

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

  React.useEffect(() => {
    getData(parms);
  }, [parms]);

  const handleKeyPress = (event) => {
    updateParams("key", event.target.value);
  };

  const getData = async (parms) => {
    showProgressBar(true)
    try {
      const response = await axios.get(projectsEndpoint, { params: parms });
      console.log("Projects.js", response.data.data);
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

  const handleDeleteIcon = (currentItem) => {
    setOpen(true);
    setSelectedItem(currentItem);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProject = (id) => {
    console.log("Delete", id);
    axios
      .delete(projectEndpoint(id))
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
      });
    setOpen(false);
  };

  const handleNewProjectClick = () => {
    navigate("/new-project");
  };

  const handleEditClick = (item) => {
    console.log("LaunchId: ", item);
    navigate("/new-project", { state: { item: item } });
  };

  const handleAddLinks = (item) => {
    console.log("Selected Item: ", item);
    navigate("/add-links", { state: { item: item } });
  };
  return (
    <>
      <div>
        <div className="float-right">
          {userCapabilities.some(e => e === permProjectAdd) &&
            <Button variant="contained" component={Link} to="/new-project">
              Add New Project
            </Button>
          }
        </div>
        <p className="heading">All Projects</p>
      </div>
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
        {/* <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel >Status</InputLabel>
                        <Select label='Status'
                        >
                            <MenuItem value={10}>Active</MenuItem>
                            <MenuItem value={20}>In-Active</MenuItem>
                        </Select>
                    </FormControl>
                </Grid> */}
      </Grid>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow className="table-head-background">
              <TableCell>S. No</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Code</TableCell>
              <TableCell>Links</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Recent Launches</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.projects?.map((currentRow, index) => (
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
                    onClick={() =>
                      navigate("/project-portal", {
                        state: { item: currentRow.project },
                      })
                    }
                  >
                    {currentRow.project.display_name}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.project.display_id
                    ? currentRow.project.display_id
                    : "----"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.project.meta.links.length}
                </TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.project.is_active ? (
                    <span className="status-passed">Active</span>
                  ) : (
                    <span className="status-failed">In-Active</span>
                  )}
                </TableCell>

                <TableCell component="th" scope="row">
                  {currentRow.projectRuns.length
                    ? currentRow.projectRuns?.map((run, index) => {
                      return (
                        <Tooltip title={run.overallstatus} key={index}>
                          {run.overallstatus === "failed" ? (
                            <CancelSharpIcon color="error" />
                          ) : run.overallstatus === "passed" ? (
                            <CheckCircleSharpIcon color="success" />
                          ) : (
                            <ErrorSharpIcon color="disabled" />
                          )}
                        </Tooltip>
                      );
                    })
                    : "No Recent Launches"}
                </TableCell>
                <TableCell component="th" scope="row">
                  {/* <Tooltip title={"Add Links to : " + currentRow.display_name}>
                                        <IconButton
                                            variant="contained"
                                            onClick={() => (handleAddLinks(currentRow))}
                                            color="warning">
                                            <LinkOutlinedIcon />
                                        </IconButton>
                                    </Tooltip> */}
                  {userCapabilities.some(e => e === permProjectEdit) &&
                    <Tooltip
                      title={
                        "Edit Project Links : " + currentRow.project.display_name
                      }
                    >
                      <IconButton
                        variant="contained"
                        onClick={() => handleAddLinks(currentRow.project)}
                        sx={{ color: "#858C94" }}
                      >
                        <ModeEditOutlineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  }

                  {/* <Tooltip
                    title={
                      "Delete Project : " + currentRow.project.display_name
                    }
                  >
                    <IconButton
                      variant="contained"
                      onClick={() => handleDeleteIcon(currentRow.project)}
                      sx={{ color: "#858C94" }}
                    >
                      <DeleteSharpIcon />
                    </IconButton>
                  </Tooltip> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.projects?.length ? (
          <TablePagination
            rowsPerPageOptions={[1, 5, 10, 15, 20, 25, 30]}
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
          open={open}
          setOpen={setOpen}
          onConfirm={() => handleDeleteProject(selectedItem.id)}
        >
          Are you sure you want to delete {selectedItem.display_name}?
        </DialogBox>
      </TableContainer>
    </>
  );
};

export default Projects;
