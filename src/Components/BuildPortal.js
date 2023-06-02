import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import {
    Box,
    Button, Grid, Stack, Tab, Tabs, Typography
} from "@mui/material";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Activities from "./activities/activities";
import BuildLevelDashboard from "./BuildLevelDashboard";

const BuildPortal = (props) => {
    const navigate = useNavigate();
    const location = useLocation()
    const currentBuild = location.state.build ? location.state.build : {}
    const currentProject = location.state.project ? location.state.project : {}
    const userCapabilities = props.userCapabilities
    const currentSprint = JSON.parse(sessionStorage.getItem("currentSprint")) ? JSON.parse(sessionStorage.getItem("currentSprint")) : "All"
    console.log(currentSprint)
    const tabIndex = location.state.tabIndex ? location.state.tabIndex : 0
    const loc = location.state.loc === "drawer" ? "dashboard" : "builds"

    const isBetween = require('dayjs/plugin/isBetween')
    dayjs.extend(isBetween)

    const [value, setValue] = React.useState(tabIndex);

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

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
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
                                {
                                    location.state.origin === "dashboard" ?
                                        <Button
                                            onClick={() =>
                                                navigate(-1)
                                            }
                                            variant="outlined"
                                        >
                                            <KeyboardBackspaceSharpIcon />
                                        </Button> :
                                        <Button
                                            onClick={() =>
                                                navigate("/project-portal", {
                                                    state: { origin: loc, item: currentProject, currentSprint: currentSprint },
                                                })
                                            }
                                            variant="outlined"
                                        >
                                            <KeyboardBackspaceSharpIcon />
                                        </Button>
                                }
                            </Grid>
                            <Grid item>
                                <p className="heading">{currentProject.display_name + "/" + currentBuild.build_number}</p>
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
            </div>


            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Dashboard" {...a11yProps(0)} />
                    <Tab label="Activities" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <BuildLevelDashboard userCapabilities={userCapabilities} build={currentBuild} project={currentProject} currentSprint={currentSprint} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Activities userCapabilities={userCapabilities} build={currentBuild} project={currentProject} currentSprint={currentSprint} />
            </TabPanel>
        </>
    );
};

export default BuildPortal;
