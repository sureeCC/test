import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import { Box, Button, Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { permSprintView } from "../AccessPermissions/SprintsPermissions";
import ProjectInformation from "./ProjectInformation";
import ProjectUsers from "./ProjectUsers";
import Sprints from "./sprints/Sprints";
import TabLinks from "./TabLinks";

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

const ProjectSettings = (props) => {
    const location = useLocation();
    const navigate = useNavigate()
    const userCapabilities = props.userCapabilities
    const currentProject = location?.state?.project;
    const tabIndex = location.state.tabIndex ? location.state.tabIndex : 0;

    const [value, setValue] = React.useState(tabIndex);
    const [tabArray, setTabArray] = React.useState([]);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderTabs = () => {
        const sprints = { title: "Sprints", component: <Sprints currentProject={currentProject} userCapabilities={userCapabilities} tabIndex={value} /> }
        const links = { title: "Links", component: <TabLinks links={currentProject.meta.links} tabIndex={value} /> }
        const info = { title: "Information", component: <ProjectInformation project={currentProject} /> }
        const users = { title: "Users", component: <ProjectUsers project={currentProject} /> }


        if (userCapabilities.some(e => e === permSprintView))
            setTabArray((oldArray) => oldArray.concat(sprints))
        setTabArray((oldArray) => oldArray.concat(links))
        setTabArray((oldArray) => oldArray.concat(info))
        setTabArray((oldArray) => oldArray.concat(users))
    }

    React.useEffect(() => {
        setTabArray([])
        renderTabs()
    }, [value]);

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
                                <Button onClick={() =>
                                    navigate("/project-portal", {
                                        state: { origin: location?.state?.origin, item: currentProject },
                                    })
                                }
                                    variant="outlined">
                                    <KeyboardBackspaceSharpIcon />
                                </Button>
                            </Grid>
                            <Grid item>
                                <p className="heading">{currentProject.display_name}</p>
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
            </div>

            <Box sx={{ width: "98%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={value} onChange={handleTabChange}>
                        {tabArray.map(item => {
                            return (
                                <Tab label={item.title} />
                            )
                        })}
                    </Tabs>
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

export default ProjectSettings;
