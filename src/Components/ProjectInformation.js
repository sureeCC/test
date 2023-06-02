import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Grid, IconButton, Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiKeyEndpoint } from "../Config/Endpoints";
import { getUser, shortFullDateFormat } from "../Utils/AppExtensions";

const ProjectInformation = (props) => {
  const user = getUser();
  const [testVizAccessToken, setTestVizAccessToken] = useState("");
  const handleCopyToClipboard = async (text) => {
    let accessToken = "testviz_access_token=" + testVizAccessToken;
    let tenantId = "\ntenant_id=" + user.tenant?.tenant_id;
    let projectName = "\nproject_name=" + props.project.display_name;
    let projectCode = "\nproject_code=" + props.project.display_id;
    let endPoint = "\nendpoint=http://65.2.74.248:5000";
    let runName = "\nrun_name=run#1(edit the run name as required)";
    let activityId = "\nactivity_id=ac#1(edit the activity id as required)";
    let buildNo = "\nbuild_number=v1.0.1(edit the build number as required)";
    let environment = "\nenvironment=development/production";
    try {
      await navigator.clipboard.writeText(
        text.concat(
          accessToken,
          tenantId,
          projectName,
          projectCode,
          endPoint,
          runName,
          activityId,
          buildNo,
          environment
        )
      );
      toast.info("Configuration Copied");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy Configuration, please try manual copying!");
    }
  };

  useEffect(() => {
    const getTestvizAccessToken = async () => {
      try {
        const data = await axios.get(apiKeyEndpoint);
        console.log("testVizAccessToken", data.data);
        setTestVizAccessToken(data.data.data);
      } catch (e) {
        console.error(e);
      }
    };
    getTestvizAccessToken();
  }, []);
  return (
    <>
      <Box component={Paper} sx={{ p: 2 }}>
        <p className="sub-heading">Basic Details</p>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            Project Code
          </Grid>
          <Grid item xs={9}>
            {props.project.display_id}
          </Grid>
          <Grid item xs={3}>
            Project Name
          </Grid>
          <Grid item xs={9}>
            {props.project.display_name}
          </Grid>
          <Grid item xs={3}>
            Project Id
          </Grid>
          <Grid item xs={9}>
            {props.project.id}
          </Grid>
          <Grid item xs={3}>
            Created Date
          </Grid>
          <Grid item xs={9}>
            {new Date(props.project.created_at).toLocaleString("en-IN", shortFullDateFormat)}
          </Grid>
        </Grid>
      </Box>
      <Box component={Paper} sx={{ p: 2, mt: 3 }}>
        <p className="sub-heading">Configuration Properties</p>
        <p className="body1">Copy and save it as a config.properties file</p>
        <p className="caption">
          You can change build-number, run-name, environment according to your
          usage
        </p>
        <Box sx={{ p: 4 }} className="set-background">
          <code>testviz_access_token={testVizAccessToken}</code>
          <br />
          <code>tenant_id={user.tenant?.tenant_id}</code>
          <br />
          <code>project_code={props.project.display_id}</code>
          <br />
          <code>endpoint=http://65.2.74.248:5000</code>
          <br />
          <code>build_number=v1.0.1(edit the build number as required)</code>
          <br />
          <code>run_name=run#1(edit the run name as required)</code>
          <br />
          <code>activity_id=ac#1(edit the activity id as required)</code>
          <br />
          <IconButton
            className="float-right"
            onClick={() => handleCopyToClipboard("")}
          >
            <ContentCopyIcon />
          </IconButton>
          <code>environment=development/production</code>
        </Box>
      </Box>
    </>
  );
};

export default ProjectInformation;
