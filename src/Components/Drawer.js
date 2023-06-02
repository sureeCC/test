import { AccountCircle, ExpandLess, ExpandMore } from "@mui/icons-material";
import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { permProfile, permSettings } from "../AccessPermissions/AccessRoles";
import {
  permApiMatrixAdd,
  permApiMatrixEdit,
} from "../AccessPermissions/ApiMatrixPermissions";
import {
  permDefectsAdd,
  permDefectsEdit,
} from "../AccessPermissions/DefectPermissions";
import { permLaunchesView } from "../AccessPermissions/LaunchesPermissions";
import {
  permProjectAdd,
  permProjectEdit,
  permProjectSettings,
  permProjectView,
} from "../AccessPermissions/ProjectPermissions";
import { permRunsView } from "../AccessPermissions/RunsPermissions";
import {
  permUserAdd,
  permUserAssign,
  permUserEdit,
  permUserView,
} from "../AccessPermissions/UserPermissions";
import {
  capabilities,
  logoutEndpoint,
  permissions,
  projectsEndpoint,
  tenantsEndPoint,
} from "../Config/Endpoints";
import { permissionTypes } from "../redux/permissions/actionTypes";
import store from "../state/store";
import { getUser, removeUserSession } from "../Utils/AppExtensions";
import AddLinks from "./AddLinks";
import AddManualEntry from "./AddManualEntry";
import AddApiMatrix from "./apiMatrix/AddMatrix";
import EditApiMatrix from "./apiMatrix/EditApiMatrix";
import AssignProjects from "./AssignProjects";
import BuildLaunches from "./BuildLaunches";
import BuildRuns from "./BuildRuns";
import Dashboard from "./Dashboard";
import AddDeffect from "./defects/AddDeffect";
import EditDeffect from "./defects/EditDefects";
import EditManualEntry from "./EditManualEntry";
import EditUser from "./EditUser";
import Footer from "./Footer";
import NewProject from "./NewProject";
import PageNotFound from "./PageNotFound";
import ProjectPortal from "./ProjectPortal";
import Projects from "./Projects";
import ProjectSettings from "./ProjectSettings";
import PublishLaunches from "./publish/PublishLaunches";
import Settings from "./Settings";
import SignUp from "./SignUp";
import TestRecords from "./TestRecords";
import UpdateProfile from "./UpdateProfile";
import UserManagement from "./UserManagement";
import { sprintTypes } from "../redux/sprints/actionTypes";
import { showProgressBar } from "../Utils/ProgressBar";
import { permActivitiesView } from "../AccessPermissions/ActivitiesPermissions";
import Activities from "./activities/activities";
import BuildPortal from "./BuildPortal";
import { addProjectPortalTabIndex } from "../redux/tab-index/actions";
import { permActivityListView } from "../AccessPermissions/ActivityListPermissions";
import ActivityList from "./activity_list/ActivityList";

const drawerWidth = 240;

const ClippedDrawer = () => {
  const userCapabilities = useSelector((state) =>
    state.permissions.permissions ? state.permissions.permissions : []
  );

  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [data, setdata] = React.useState([]);
  const [tenantImage, setTenantImage] = React.useState("../igs_logo.png");
  const [testvizImage, setTestvizImage] = React.useState(
    "../test_viz_logo.png"
  );

  const [openProjects, setOpenProjects] = useState(true);
  const [openProject, setOpenProject] = useState(false);
  const [itemId, setItemId] = useState("");
  const [sideBarArray, setSideBarArray] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const user = getUser();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tenantsData, setTenantsData] = React.useState({});
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setOpenUserMenu(false);
    axios.delete(logoutEndpoint).then((data) => {
      console.log("UserLoggedOutSuccessfully");
      removeUserSession();
      navigate("/login");
    });
  };

  const getProjectsData = async (flag) => {
    try {
      var response = await axios.get(projectsEndpoint);
      console.log("Data", response.data.data);
      setdata(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProjectClick = (item) => {
    console.log("clicked ", item);
    setOpenProject(!openProject);
    setItemId(item.id);
    setActiveItem(activeItem === item.project.id ? null : item.project.id);
    store.dispatch({
      type: sprintTypes.RESET_SPRINT_ID,
    });
    navigate("/project-portal", { state: { item: item.project } });
    addProjectPortalTabIndex(0);
  };

  const handleAllProjects = () => {
    navigate("/projects");
  };

  const handleSettings = () => {
    console.log("settings clicked");
    navigate("/settings");
  };

  const getTenantsData = async () => {
    try {
      const data = await axios.get(tenantsEndPoint);
      console.log("tenants-Data", data.data);
      setTenantsData(data.data.data);
      setTenantImage(data.data.data.logo_url);
    } catch (e) {
      console.error(e);
    }
  };

  const getCapabilities = async () => {
    const arr = [];
    store.dispatch({ type: permissionTypes.GET_PERMISSION_LOADING });
    try {
      const response = await axios.get(capabilities);
      //console.log("Capabilities Data", response.data.data);
      response.data.data.map((item) => {
        arr.push(item.permission_id);
      });
      store.dispatch({
        type: permissionTypes.GET_PERMISSION_SUCCESS,
        payload: arr,
      });
      //getPermissions()
    } catch (e) {
      console.error(e);
      toast.error("An error has occured, please contact Administrator!");
      store.dispatch({ type: permissionTypes.GET_PERMISSION_FAILURE });
    }
  };

  const getPermissions = async () => {
    try {
      const response = await axios.get(permissions);
      //console.warn("Permissions Data", response.data.data);
    } catch (e) {
      console.error(e);
      toast.error("An error has occured, please contact Administrator!");
    }
  };

  useEffect(() => {
    getCapabilities();
    getProjectsData();
    getTenantsData();
  }, []);
  if (userCapabilities.length > 0 && tenantsData)
    return (
      <Box sx={{ display: "flex" }} className="main-panel">
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar className="toolbar">
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <img alt="tenant" height={35} src={tenantImage} />
              <img
                alt="test-viz"
                className="test-viz-logo-header"
                height={24}
                src={testvizImage}
              />
              {/* <p className="test-viz-logo" color='primary' variant="h5">Test-Viz</p> */}
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Box
              onClick={handleProfileMenuOpen}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button disableElevation disableRipple className="profile-label">
                {user?.first_name ? user?.first_name : ""}
                <IconButton
                  disableElevation
                  disableRipple
                  onClick={handleProfileMenuOpen}
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem>
            Welcome {user?.first_name + " " + user?.last_name}
          </MenuItem>
          {userCapabilities.some((e) => e === permProfile) && (
            <MenuItem
              onClick={() => {
                navigate("/update-profile");
                handleMenuClose();
              }}
            >
              {" "}
              Update Profile
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
        <Drawer
          className="drawer"
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItemButton
                className={
                  "/dashboard" === window.location.pathname
                    ? "active-tab"
                    : null
                }
                component={Link}
                to="/dashboard"
              >
                <ListItemIcon>
                  <DashboardSharpIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              {userCapabilities.some((e) => e === permProjectView) && (
                <>
                  <ListItemButton
                    onClick={() => setOpenProjects(!openProjects)}
                  >
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Projects" />
                    {openProjects ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openProjects} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        sx={{ pl: 4 }}
                        className={
                          "/projects" === window.location.pathname
                            ? "active-tab"
                            : null
                        }
                      >
                        <ListItemText
                          onClick={handleAllProjects}
                          primary="All Projects"
                          sx={{ pl: 5 }}
                        />
                      </ListItemButton>
                      {data?.projects?.map((item, index) => (
                        <>
                          <ListItemButton
                            className={
                              activeItem === item?.project?.id &&
                              "/project-portal" === window.location.pathname
                                ? "active-tab"
                                : null
                            }
                            sx={{ pl: 4 }}
                            onClick={() => handleProjectClick(item)}
                          >
                            <ListItemText
                              primary={item.project.display_name}
                              sx={{ pl: 5 }}
                            />
                            {/* {!openProjects ? <ExpandLess /> : <ExpandMore />} */}
                          </ListItemButton>

                          {/* <Collapse in={activeItem === item.project.id} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {item.project.meta.links.map((internalItem, internalIndex) => (
                                                        <ListItemButton sx={{ pl: 12 }}
                                                            onClick={() => window.open(internalItem.url.toString())}>
                                                            <ListItemText primary={internalItem.title} />
                                                        </ListItemButton>
                                                    ))}
                                                </List>
                                            </Collapse> */}
                        </>
                      ))}
                    </List>
                  </Collapse>
                </>
              )}

              {userCapabilities.some((e) => e === permUserEdit) && (
                <ListItemButton
                  className={
                    "/user-management" === window.location.pathname &&
                    "active-tab"
                  }
                  component={Link}
                  to="/user-management"
                >
                  <ListItemIcon>
                    <AccountBoxIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItemButton>
              )}

              {userCapabilities.some((e) => e === permActivityListView) && (
                <ListItemButton
                  className={
                    "/activity-list" === window.location.pathname &&
                    "active-tab"
                  }
                  component={Link}
                  to="/activity-list"
                >
                  <ListItemIcon>
                    <FactCheckRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Manage Activity List" />
                </ListItemButton>
              )}

              {userCapabilities.some((e) => e === permSettings) && (
                <ListItemButton
                  className={
                    "/settings" === window.location.pathname
                      ? "active-tab"
                      : null
                  }
                  onClick={handleSettings}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              )}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route
              path="/update-profile"
              element={
                userCapabilities.some((e) => e === permProfile) ? (
                  <UpdateProfile userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/settings"
              element={
                userCapabilities.some((e) => e === permSettings) ? (
                  <Settings userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/user-management"
              element={
                userCapabilities.some((e) => e === permUserEdit) ? (
                  <UserManagement userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/signup"
              element={
                userCapabilities.some((e) => e === permUserAdd) ? (
                  <SignUp userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/edit-user"
              element={
                userCapabilities.some((e) => e === permUserEdit) ? (
                  <EditUser userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/assign-projects"
              element={
                userCapabilities.some((e) => e === permUserAssign) ? (
                  <AssignProjects userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />

            <Route
              path="/projects"
              element={
                userCapabilities.some((e) => e === permProjectView) ? (
                  <Projects userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/new-project"
              element={
                userCapabilities.some((e) => e === permProjectAdd) ? (
                  <NewProject userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/project-settings"
              element={
                userCapabilities.some((e) => e === permProjectSettings) ? (
                  <ProjectSettings userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />

            <Route
              path="/build-runs"
              element={
                userCapabilities.some((e) => e === permRunsView) ? (
                  <BuildRuns userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/build-launches"
              element={
                userCapabilities.some((e) => e === permLaunchesView) ? (
                  <BuildLaunches userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />

            <Route
              path="/add-defects"
              element={
                userCapabilities.some((e) => e === permDefectsAdd) ? (
                  <AddDeffect userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/edit-defect"
              element={
                userCapabilities.some((e) => e === permDefectsEdit) ? (
                  <EditDeffect userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/activity-list"
              element={
                userCapabilities.some((e) => e === permActivityListView) ? (
                  <ActivityList userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />

            {/* <Route path="/add-links" element={userCapabilities.some(e => e === permLinksAdd) ? <AddLinks userCapabilities={userCapabilities} /> : <PageNotFound />} /> */}
            <Route
              path="/add-links"
              element={
                userCapabilities.some((e) => e === permProjectEdit) ? (
                  <AddLinks userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/add-matrix"
              element={
                userCapabilities.some((e) => e === permApiMatrixAdd) ? (
                  <AddApiMatrix userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/edit-matrix"
              element={
                userCapabilities.some((e) => e === permApiMatrixEdit) ? (
                  <EditApiMatrix userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />
            <Route
              path="/activities"
              element={
                userCapabilities.some((e) => e === permActivitiesView) ? (
                  <Activities userCapabilities={userCapabilities} />
                ) : (
                  <PageNotFound />
                )
              }
            />

            {/* below routes are not specified in permission matrix */}
            <Route
              path="/dashboard"
              element={<Dashboard userCapabilities={userCapabilities} />}
            />
            <Route path="/new-manual-entry" element={<AddManualEntry />} />
            <Route path="/edit-manual-entry" element={<EditManualEntry />} />
            <Route
              path="/publish-manual-launch"
              element={<PublishLaunches />}
            />
            <Route path="*" element={<PageNotFound />} />
            <Route
              path="/project-portal"
              element={<ProjectPortal userCapabilities={userCapabilities} />}
            />
            <Route
              path="/build-portal"
              element={<BuildPortal userCapabilities={userCapabilities} />}
            />
            <Route path="/test-cases" element={<TestRecords />} />
          </Routes>
          <Footer />
        </Box>
      </Box>
    );
  else return showProgressBar(true);
};
export default ClippedDrawer;
