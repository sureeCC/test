import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import axios from "axios";
import PropTypes from "prop-types";
import * as React from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import {
  apiKeyEndpoint,
  putTenantsEndPoint,
  tenantsEndPoint,
  uploadLogoEndPoint,
} from "../Config/Endpoints";
import { getUser } from "../Utils/AppExtensions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

const Settings = (props) => {
  const userRole = props.userRole
  const user = getUser();
  const [value, setValue] = React.useState(0);
  const [editMode, setEditMode] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");
  const [companyInformation, setCompanyInformation] = React.useState();

  const [acceptedFile, setAcceptedFile] = React.useState();
  const [uploadButton, setUploadButton] = React.useState(true);
  const [tenantsData, setTenantsData] = React.useState({});
  const [apiKey, setApiKey] = React.useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleCompanyInformationChange = (e) => {
    setCompanyInformation(e.target.value);
  };

  const getTenantsData = async () => {
    try {
      const data = await axios.get(tenantsEndPoint);
      console.log("tenants-Data", data.data);
      setTenantsData(data.data.data);
      setCompanyName(data.data.data.title);
    } catch (e) {
      console.error(e);
    }
  };

  const getApiKey = async () => {
    try {
      const data = await axios.get(apiKeyEndpoint);
      console.log("APIKEY", data.data);
      setApiKey(data.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getTenantsData();
    getApiKey();
  }, [apiKey]);

  const uploadImage = () => {
    if (acceptedFile) {
      var formData = new FormData();
      formData.append("logo", acceptedFile[0]);
      axios
        .post(uploadLogoEndPoint(user.tenant.tenant_id), formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((data) => {
          console.log(data);
          setUploadButton(false);
          getTenantsData();
        })
        .catch(console.log("error"));
    }
  };

  const handleEdit = () => {
    if (editMode) {
      console.log("update", companyName, companyInformation);
      axios
        .put(putTenantsEndPoint(user.tenant.tenant_id), { title: companyName })
        .then((response) => {
          console.log("update successfull", response);
          getTenantsData();
          toast.success("Company Name updated!");
          window.location.reload()
          setEditMode(!editMode);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setEditMode(!editMode);
    }
  };

  const handleRegenerate = () => {
    axios
      .post(apiKeyEndpoint, {})
      .then((response) => {
        console.log(response);
        setApiKey(...apiKey, response.data.data);
        //getApiKey()
        toast.success("New API Key generation successfull!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClickToCopyKey = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.info("Testviz Access Token Copied!");
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to copy Testviz Access Token, please try manual copying!"
      );
    }
  };

  return (
    <>
      <p className="heading">Settings</p>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Account" {...a11yProps(0)} />
            <Tab label="TestViz Access Token" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Paper sx={{ p: 5 }}>
            <Button
              className="float-right"
              variant="contained"
              onClick={handleEdit}
            >
              {!editMode ? "Edit" : "Update"}
            </Button>
            <Typography variant="h6" sx={{ mb: 8 }}>
              Account
            </Typography>
            <Grid container spacing={2}>
              {!editMode ? (
                <>
                  <Grid item xs={4}>
                    <Typography sx={{ p: 3 }} variant="body2">
                      Logo
                    </Typography>
                    <Typography sx={{ p: 3, mt: 1 }} variant="body2">
                      Company Name
                    </Typography>
                    {/* <Typography sx={{ p: 3 }} variant="body2">
                      Copyright Information
                    </Typography> */}
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ pl: 3 }}>
                      <img src={tenantsData.logo_url} height={68} />
                    </Box>
                    <Typography sx={{ p: 3 }} variant="body2">
                      {tenantsData.title}
                    </Typography>
                    {/* <Typography sx={{ p: 3 }} variant="body2">
                      ©IGS India 2022. All rights resevred.
                    </Typography> */}
                  </Grid>
                </>
              ) : (
                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      label="Company Name"
                      name="key"
                      onChange={handleCompanyNameChange}
                      defaultValue={companyName}
                    />
                    {/* <br />
                    <TextField
                      sx={{ mt: 3 }}
                      required
                      fullWidth
                      onChange={handleCompanyInformationChange}
                      label="Copyright Information"
                      name="key"
                      defaultValue={companyInformation}
                    /> */}
                  </Grid>
                  {/* <Grid item xs={6}>
                                        <Dropzone
                                            maxSize={2000000}
                                            multiple={false}
                                            onDrop={acceptedFiles => console.log(acceptedFiles)}>
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <p className='drop-file-box'>Drag 'n' drop some files here, or click to select files</p>
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                    </Grid> */}

                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: 2,
                        padding: 3
                      }}
                    >
                      <Typography variant="h6">Logo</Typography>

                      {tenantsData.logo_url ? (
                        <img
                          className="dp-image"
                          width={90}
                          alt=""
                          src={tenantsData.logo_url}
                        />
                      ) : null}
                      <br />
                      <Dropzone
                        maxSize={2000000}
                        multiple={false}
                        onDrop={(acceptedFiles) => {
                          setAcceptedFile(acceptedFiles);
                          setUploadButton(true);
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <Typography
                                className="drop-file-box"
                                variant="body1"
                              >
                                {" "}
                                Drag and drop Image here to change the logo, or
                                click to select file
                              </Typography>
                            </div>
                            <aside>
                              {acceptedFile?.length ? (
                                acceptedFile?.map((file) => {
                                  return uploadButton ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        mt: 4,
                                      }}
                                    >
                                      <img
                                        width={150}
                                        alt=""
                                        src={window.URL.createObjectURL(file)}
                                      />
                                    </Box>
                                  ) : null;
                                })
                              ) : (
                                <h4 className="mt-5">
                                  {setUploadButton(true)}
                                </h4>
                              )}
                            </aside>
                          </section>
                        )}
                      </Dropzone>

                      {uploadButton ? (
                        <Button
                          onClick={uploadImage}
                          variant="outlined"
                          disabled={!acceptedFile?.length > 0}
                          color="secondary"
                          sx={{ mt: 4 }}
                        >
                          Upload Image
                        </Button>
                      ) : null}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Paper sx={{ p: 5 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              TestViz Access Token
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  label="API Key"
                  name="key"
                  disabled
                  defaultValue={apiKey}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleClickToCopyKey(apiKey)}
                        // onMouseDown={handleMouseDownPassword}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={handleRegenerate}
                  sx={{ mt: 1 }}
                  variant="outlined"
                >
                  Regenerate
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>
      </Box>
    </>
  );
};

export default Settings;
