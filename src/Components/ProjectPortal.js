import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Grid, IconButton, MenuItem, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import * as React from "react";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { permBuildsView } from "../AccessPermissions/BuildsPermissions";
import { permDefectsView } from "../AccessPermissions/DefectPermissions";
import { permProjectSettings } from "../AccessPermissions/ProjectPermissions";
import { sprintsEndPoint } from "../Config/Endpoints";
import { addProjectPortalTabIndex } from '../redux/tab-index/actions';
import { getDaysDifference } from "../Utils/AppExtensions";
import { showProgressBar } from "../Utils/ProgressBar";
import Builds from "./Builds";
import Defects from "./defects/Defects";
import ProjectAnalytics from "./ProjectAnalytics";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


const ProjectPortal = (props) => {
  const location = useLocation();
  const navigate = useNavigate()
  const userCapabilities = props.userCapabilities
  const currentProject = location?.state?.item;
  const index = useSelector(state => state.tabIndex)
  console.log("Redux Index",index.tabIndex)

  //const tabIndex = location?.state?.tabIndex ? location?.state?.tabIndex : 0;

  const [value, setValue] = React.useState(0);
  const [tabArray, setTabArray] = React.useState([]);
  const [sprints, setSprints] = React.useState([]);
  const [currentSprint, setCurrentSprint] = React.useState(null);
  const [progressFlag, setProgressFlag] = React.useState(true);


  const isBetween = require('dayjs/plugin/isBetween')
  dayjs.extend(isBetween)

  const handleTabChange = (event, newValue) => {
    addProjectPortalTabIndex(newValue)
    //setValue(newValue);
  };

  const renderTabs = React.useCallback(
    (currentSprint, userCapabilities, currentProject, value) => {
      setTabArray([])
      const builds = { title: "Builds", component: <Builds currentSprint={currentSprint} userCapabilities={userCapabilities} project={currentProject} tabIndex={value} /> }
      const defects = { title: "Defects", component: <Defects currentSprint={currentSprint} userCapabilities={userCapabilities} project={currentProject} tabIndex={value} /> }
      //const apiMatrix = { title: "API Matrix", component: <ApiMatrix currentSprint={currentSprint} userCapabilities={userCapabilities} project={currentProject} tabIndex={value} /> }
      const analytics = { title: "Dashboard", component: <ProjectAnalytics currentSprint={currentSprint} userCapabilities={userCapabilities} project={currentProject} tabIndex={value} /> }



      setTabArray((oldArray) => oldArray.concat(analytics))
      if (userCapabilities.some(e => e === permBuildsView))
        setTabArray((oldArray) => oldArray.concat(builds))
      if (userCapabilities.some(e => e === permDefectsView))
        setTabArray((oldArray) => oldArray.concat(defects))
      // if (userCapabilities.some(e => e === permApiMatrixView))
      //   setTabArray((oldArray) => oldArray.concat(apiMatrix))
    }, []
  )

  const setCurrent = (s) => {
    // store.dispatch({
    //   type: sprintTypes.ADD_SPRINT_ID,
    //   payload: sprint._id,
    // })
    setCurrentSprint(s)
  }

  const getSprintData = React.useCallback(async (currentProject, location) => {
    try {
      const response = await axios.get(sprintsEndPoint + currentProject.id + '?all=true');
      console.log("Sprints.js", response.data.data);
      setSprints(response.data.data.sprints);

      if (location.state.currentSprint === "All") {
        console.error("inside")
        setCurrent("All")
        setProgressFlag(false)
        return
      }
      if (location.state.currentSprint) {
        response.data.data.sprints.map(sprint => {
          if (location.state.currentSprint?._id === sprint._id) {
            return (
              setCurrent(sprint)
            )
          }
        })
      }
      else {
        setCurrent(response.data.data.sprints[0])
        response.data.data.sprints.map(sprint => {
          if (dayjs().isBetween(dayjs(sprint.start_date), dayjs(sprint.end_date))) {
            return (
              setCurrent(sprint)
            )
          }
        })
      }
      setProgressFlag(false)
    } catch (e) {
      console.error(e);
      setProgressFlag(false)
      //toast.error("An error has occured, please contact Administrator!");
    }
  }, []);

  const handleSprintChange = (e) => {
    console.log(e.target.value)
    setCurrentSprint(e.target.value)
    // store.dispatch({
    //   type: sprintTypes.ADD_SPRINT_ID,
    //   payload: e.target.value._id
    // })
  }

  // React.useEffect(() => {
  //   return () => {
  //     store.dispatch({
  //       type: sprintTypes.RESET_SPRINT_ID
  //     })
  //   }
  // }, [currentProject]);



  const setTabValue = (location) => {
    const origin = location.state.origin ? location.state.origin : ""
    console.log(origin)
    if (origin === "builds")
      setValue(1)
    else if (origin === "defects")
      setValue(2)
    else
      setValue(0)
  }

  const getOrigin = () => {
    if (value === 0)
      return "dashboard"
    else if (value === 1)
      return "builds"
    else if (value === 2)
      return "defects"
  }

  React.useEffect(() => {

    setValue(index.tabIndex)
  }, [index.tabIndex]);

  React.useEffect(() => {
    setTabValue(location)
  }, [location]);

  React.useEffect(() => {
    getSprintData(currentProject, location)
  }, [currentProject, getSprintData, location]);

  React.useEffect(() => {
    sessionStorage.setItem("currentSprint", JSON.stringify(currentSprint))
    renderTabs(currentSprint, userCapabilities, currentProject, value)
  }, [userCapabilities, currentSprint, renderTabs, currentProject, value, index.tabIndex]);

  return (
    <>
      {showProgressBar(progressFlag)}
      <div>
        <div className="float-right">
          {userCapabilities.some(e => e === permProjectSettings) &&
            <Tooltip title="Project Settings" placement="left-start">
              <IconButton onClick={() => navigate("/project-settings", { state: { origin: getOrigin(), project: currentProject } })}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            // <Button variant="outlined" size="large" onClick={() => navigate("/project-settings", { state: { project: currentProject } })}>
            //   Project Settings
            // </Button>
          }
        </div>
        <p className="heading">{currentProject.display_name}</p>
      </div>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Tabs value={value} onChange={handleTabChange}>
                {tabArray.map(item => {
                  return (
                    <Tab label={item.title} />
                  )
                })}
              </Tabs>
            </Grid>
            <Grid item xs={4}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  {(currentSprint  && currentSprint!=="All" ) &&
                    <>
                      <span className="sprint-date-lbl">
                        {new Date(currentSprint.start_date).toLocaleDateString("en-IN", { day: 'numeric', month: '2-digit' }) + " - " +
                          new Date(currentSprint.end_date).toLocaleDateString("en-IN", { day: 'numeric', month: '2-digit' })}</span >
                      {dayjs().isBetween(dayjs(currentSprint.start_date), dayjs(currentSprint.end_date)) ?
                        <span className="sprint-days-lbl">{getDaysDifference(new Date(currentSprint.end_date), new Date()) + " Days Remaining"}</span> :
                        <span className="sprint-days-lbl">{getDaysDifference(new Date(currentSprint.end_date), new Date(currentSprint.start_date)) + " Days"}</span>
                      }
                    </>}
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    name="role"
                    value={currentSprint}
                    select
                    size="small"
                    label="Sprint"
                    onChange={(e) => {
                      handleSprintChange(e);
                    }}
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="All">
                      <Grid container spacing={2}>
                        <Grid item xs={7}>
                          <em>All Sprints</em>
                        </Grid>
                      </Grid>
                    </MenuItem>
                    {sprints?.map(sprint => {
                      return (
                        <MenuItem value={sprint}>
                          <Grid container spacing={2}>
                            <Grid item xs={7}>
                              {sprint.sprint_name}
                              {/* {sprint._id} */}
                            </Grid>
                            <Grid item xs={5}>
                              {dayjs().isBetween(dayjs(sprint.start_date), dayjs(sprint.end_date)) ?
                                <span className="sprint-drp-label-current">Current</span> :
                                dayjs().isAfter(dayjs(sprint.start_date), 'day') ?
                                  <span className="sprint-drp-label-past">Past</span> :
                                  <span className="sprint-drp-label-past">Future</span>
                              }
                            </Grid>
                          </Grid>
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
        {tabArray.map((item, index) => {
          return (
            <TabPanel value={value} index={index}>
              {item.component}
            </TabPanel>
          )
        })}
      </Box>
    </>
  );
};

export default ProjectPortal;
