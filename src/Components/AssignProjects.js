import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  assignedProjectsEndpoint,
  assignProjectEndpoint,
  projectsEndpoint,
  unAssignedProjects,
  unAssignProjectEndpoint,
} from "../Config/Endpoints";
import "../css/AssignProjects.css";

const AssignProjects = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [projects, setProjects] = React.useState([]);
  const [assignedProjects, setAssignedProjects] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState();
  const [deleteProject, setdeleteProject] = React.useState();

  const handleChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleRemoveChange = (event) => {
    console.log(event.target.value);
    setdeleteProject(event.target.value);
  };

  const handleDeleteProjectBtn = () => {
    if (deleteProject) {
      axios
        .delete(unAssignProjectEndpoint(location.state.user.id, deleteProject))
        .then((response) => {
          console.log("Project removed successfully", response);
          toast.success("Project Removed Successfully");
          getAssignedProjects();
          setAssignedProjects([...assignedProjects]);
          getUnassignedProjects();
          setdeleteProject("");
        })
        .catch((e) => {
          console.error(e);
        });
    }
    // alert('please select atleast one project to delete')
    else toast.info("Please select atleast one project to delete");
  };

  const handleAddProjectBtn = () => {
    if (selectedProject) {
      const payload = {
        testerId: location.state.user.id,
        projectId: selectedProject,
      };
      axios
        .post(assignProjectEndpoint, payload)
        .then((response) => {
          console.log("Project Assigned Successfully successfully");
          toast.success("Project Assigned Successfully");
          getAssignedProjects();
          setAssignedProjects([...assignedProjects]);
          getUnassignedProjects();
        })
        .catch((e) => {
          console.error(e);
        });
    }
    //alert('please select atleast one resource to associate')
    else toast.info("please select atleast one resource to associate");
  };

  const getProjectsData = async () => {
    try {
      const data = await axios.get(projectsEndpoint);
      console.log("Projects-Data", data.data);
      setProjects(data.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getUnassignedProjects = async () => {
    try {
      const data = await axios.get(unAssignedProjects(location.state.user.id));
      console.log("UnAssigned Data", data.data);
      setProjects(data.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getAssignedProjects = async () => {
    try {
      const data = await axios.get(
        assignedProjectsEndpoint(location.state.user.id)
      );
      console.log("AssignedProject: ", data.data);
      setAssignedProjects([...data.data.data]);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    //getProjectsData();
    getUnassignedProjects();
    getAssignedProjects();
  }, []);

  return (
    <>
      {/* <div>Call from : {location.state.row.display_name}</div> */}
      {props.flag === 1 ? null : (
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
                    onClick={() => navigate("/user-management")}
                    variant="outlined"
                  >
                    <KeyboardBackspaceSharpIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <p className="heading">
                    Project Assignment :{" "}
                    {location.state.user.first_name +
                      " " +
                      location.state.user.last_name}
                  </p>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </div>
      )}
      <Paper sx={{ p: 5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <TableContainer component={Paper} className="table-border">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Projects</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!projects.length ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      className="project-cell"
                      sx={{ width: "100vh" }}
                      component="th"
                      scope="row"
                    >
                      No Projects to Assign
                    </TableCell>
                  </TableRow>
                ) : (
                  <FormControl fullWidth sx={{ width: "100%" }}>
                    <RadioGroup fullWidth onChange={handleChange}>
                      {projects.map((project) => {
                        return (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              className="project-cell"
                              sx={{ width: "100vh" }}
                              component="th"
                              scope="row"
                            >
                              <FormControlLabel
                                value={project.id}
                                control={<Radio />}
                                label={project.display_name}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack className="mt-10" direction="column" spacing={0}>
            <Button
              variant="contained"
              endIcon={<ArrowForwardSharpIcon />}
              sx={{ width: 150 }}
              onClick={handleAddProjectBtn}
            >
              Assign
            </Button>
            <br />
            <Button
              color="error"
              variant="contained"
              startIcon={<ArrowBackSharpIcon />}
              sx={{ width: 150 }}
              onClick={handleDeleteProjectBtn}
            >
              Un-assign
            </Button>
          </Stack>

          <TableContainer component={Paper} className="table-border">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assigned Projects</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!assignedProjects.length ? (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      className="project-cell"
                      sx={{ width: "100vh" }}
                      component="th"
                      scope="row"
                    >
                      No Projects Assigned
                    </TableCell>
                  </TableRow>
                ) : (
                  <FormControl fullWidth sx={{ width: "100%" }}>
                    <RadioGroup fullWidth onChange={handleRemoveChange}>
                      {assignedProjects.map((project) => {
                        return (
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              className="project-cell"
                              sx={{ width: "100vh" }}
                              component="th"
                              scope="row"
                            >
                              <FormControlLabel
                                value={project.project_id}
                                control={<Radio />}
                                label={project.project.display_name}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </>
  );
};

export default AssignProjects;
