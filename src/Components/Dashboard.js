import { Checkbox, Grid, ListItemText, MenuItem, Stack, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_ID_TESTER, ROLE_ID_VIEW_ONLY } from "../AccessPermissions/AccessRoles";
import { permProjectAdd } from "../AccessPermissions/ProjectPermissions";
import { projectsEndpoint } from "../Config/Endpoints";
import { getUser } from "../Utils/AppExtensions";
import { showProgressBar } from "../Utils/ProgressBar";
import { activitiesChartEndpoint, buildsDefectsChartEndpoint, buildsLaunchesChartEndpoint, testExecCoverageChartEndpoint, tilesEndpoint } from "./charts/ChartService";
import Graphs from "./charts/Graphs";
import Tiles from "./charts/Tiles";

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Dashboard = (props) => {
  const navigate = useNavigate()
  const userCapabilities = props.userCapabilities
  const user = getUser()

  const [tilesData, setTilesData] = useState([]);
  const [buildsDefectsData, setBuildsDefectsData] = useState([]);
  const [activities, setActivites] = useState([]);
  const [testExecCoverageData, setTestExecCoverageData] = useState([]);

  const [selectedProject, setSelectedProject] = useState();
  const [projectData, setProjectData] = useState([]);
  const [progressFlag, setProgressFlag] = useState(true);

  const [projectNames, setprojectNames] = React.useState([]);
  const [projectIds, setprojectIds] = React.useState([]);
  const [projectTitles, setprojectTitles] = React.useState([]);

  const isBetween = require('dayjs/plugin/isBetween')
  dayjs.extend(isBetween)

  const handleChange = (event) => {
    const arr = event.target.value
    if (arr[arr.length - 1] === "ALD") {
      projectData.projects.map(item => {
        // setprojectIds([...projectIds, item.project.id])
        // setprojectTitles([...projectTitles, item.project.display_name])
        setprojectIds([])
        setprojectTitles([])
      })
      return;
    }

    const {
      target: { value },
    } = event;
    setprojectNames(
      typeof value === 'string' ? value.split(',') : value,
    );
    event.target.value.map(name => {
      if (!projectIds.includes(name.id)) {
        setprojectIds([...projectIds, name.id])
        setprojectTitles([...projectTitles, name.display_name])
      }
      else {
        var i = projectIds.indexOf(name.id)
        var it = projectTitles.indexOf(name.display_name)
        if (i !== -1 && it !== -1) {
          projectIds.splice(i, 1);
          projectTitles.splice(it, 1);
          setprojectIds([...projectIds])
          setprojectTitles([...projectTitles])
        }
      }
    })
  };

  const getProjects = async (parms) => {
    try {
      const response = await axios.get(projectsEndpoint);
      console.log("Projects.js", response.data.data);
      setProjectData(response.data.data);
      //setSelectedProject(response.data.data.projects[0].project)
      setSelectedProject("ALD") // account level dashboard
      setProgressFlag(false)
    } catch (e) {
      console.error(e);
      setProgressFlag(false)
      //toast.error("An error has occured, please contact Administrator!");
    }
  };

  const handleAddNewProject = () => {
    navigate("/new-project")
  }

  useEffect(() => {
    getProjects();
  }, []);

  const getTilesData = useCallback(
    async (_projectIds, sprint) => {
      try {
        const response = await axios.get(tilesEndpoint(), {
          params: {
            projectIds: _projectIds
          }
        });
        console.log("TilesData", response.data.data);
        setTilesData(response.data.data);
      } catch (e) {
        console.error(e);
      }
    }, []
  )

  const getBuildsDefectsData = useCallback(
    async (_projectIds, sprint) => {
      try {
        const response = await axios.get(buildsDefectsChartEndpoint(), {
          params: {
            projectIds: _projectIds
          }
        });
        console.log("Builddefects/Chart", response.data.data);
        setBuildsDefectsData(response.data.data);
      } catch (e) {
        console.error(e);
      }
    }, []
  )

  const getActivitiesData = useCallback(
    async (project) => {
      try {
        const response = await axios.get(activitiesChartEndpoint(project?.id));
        console.log("Activities/Chart", response.data.data);
        setActivites(response.data.data);
      } catch (e) {
        console.error(e);
      }
    }, []
  )

  const getBuildLaunchesData = useCallback(
    async (_projectIds, sprint) => {
      try {
        const response = await axios.get(buildsLaunchesChartEndpoint(), {
          params: {
            projectIds: _projectIds
          }
        });
        console.log("BuildLaunches/Chart", response.data.data);
        //setBuildLaunchesData(response.data.data);
      } catch (e) {
        console.error(e);
      }
    }, []
  )

  const getTestExecCoverageData = useCallback(
    async (_projectIds, sprint) => {
      try {
        const response = await axios.get(testExecCoverageChartEndpoint(), {
          params: {
            projectIds: _projectIds
          }
        });
        console.log("TestExecCoverage/Chart", response.data.data);
        setTestExecCoverageData(response.data.data);
      } catch (e) {
        console.error(e);
      }
    }, []
  )
  useEffect(() => {
    if (!selectedProject) return;
    //console.info(selectedProject)
    getTilesData(projectIds);
    getBuildsDefectsData(projectIds)
    getActivitiesData(selectedProject)
    //getBuildLaunchesData(selectedProject)
    getTestExecCoverageData(projectIds)
  }, [getActivitiesData, getBuildLaunchesData, getBuildsDefectsData, getTestExecCoverageData, getTilesData, selectedProject, projectIds]);

  if (projectData.projects?.length > 0)
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <p className="heading">
              Dashboard {selectedProject.display_name}
            </p>
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth size="small" >
                <InputLabel>Projects</InputLabel>
                <Select
                  multiple
                  value={projectTitles}
                  onChange={handleChange}
                  input={<OutlinedInput label="Projects" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="ALD">
                  <Checkbox checked={projectTitles.length === projectData.projects.length || projectTitles.length===0}
                        indeterminate={projectTitles.length > 0 && projectTitles.length < projectData.projects.length} />
                    <ListItemText primary="All Projects" />
                  </MenuItem>
                  {projectData?.projects?.map((item, i) => (
                    <MenuItem key={i} value={item.project}>
                      <Checkbox checked={projectTitles.length===0?true:projectTitles.indexOf(item.project.display_name) > -1} />
                      <ListItemText primary={item.project?.display_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>

        {/* tiles */}
        <Tiles currentProject={selectedProject} tilesData={tilesData} testExecCoverageData={testExecCoverageData} buildsDefectsData={buildsDefectsData} activitiesData={activities} varianceParms={projectIds} />
        {/* graphs */}
        <Graphs testExecCoverageData={testExecCoverageData} buildsDefectsData={buildsDefectsData} activitiesData={activities} showDropdown={selectedProject} />
      </div >
    );
  else
    return (
      <>
        {showProgressBar(progressFlag)}
        <p className="heading">
          Dashboard
        </p>
        <Stack className="center-screen" direction="column" spacing={2}>
          <img src="../no_records.svg" alt="record not found" />
          <p className="heading">No Project Added yet</p>
          {userCapabilities.some(e => e === permProjectAdd) &&
            <>
              <Typography variant="body1">
                Please go ahead by creating a New Project.
              </Typography>
              <p onClick={handleAddNewProject} className="btn-clear-filter">
                Add New Project
              </p>
            </>
          }

          {(user.roles[0].role_id === ROLE_ID_VIEW_ONLY || user.roles[0].role_id === ROLE_ID_TESTER) &&
            <Typography variant="body1">
              You won't be able to see the Dashboard and Project records until an admin assigns you a Project!
            </Typography>
          }
        </Stack>
      </>
    );

};

export default Dashboard;