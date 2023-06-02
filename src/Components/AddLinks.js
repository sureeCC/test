import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import KeyboardBackspaceSharpIcon from "@mui/icons-material/KeyboardBackspaceSharp";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { green, pink } from "@mui/material/colors";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { permLinksAdd, permLinksDelete } from "../AccessPermissions/LinksPermissions";
import { permProjectDelete } from "../AccessPermissions/ProjectPermissions";
import { addLink, deleteLink, projectEndpoint } from "../Config/Endpoints";
import DialogBox from "./controls/DialogBox";

const AddLinks = (props) => {
  const navigate = useNavigate();
  const userCapabilities = props.userCapabilities
  const location = useLocation();

  const [testOpsTitleError, setTestOpsTitleError] = useState(false);
  const [testOpsLinkError, setTestOpsLinkError] = useState(false);

  const [addLinks, setAddLinks] = useState([]);
  const [formData, setFormData] = useState([]);
  const [open, setOpen] = useState(false);
  const [projItem, setProjItem] = useState("");

  const isValidURL = (string) => {
    var res = string.match(
      /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z0-9]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  };

  const getProject = async () => {
    try {
      const response = await axios.get(projectEndpoint(location.state.item.id));
      console.log("Individual Project", response.data.data);
      setAddLinks(response.data.data.meta.links);
      //setFormData(addLinks)
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMore = () => {
    //setAddLinks([...addLinks, { title: "", url: "" }])
    setFormData([...formData, { title: "", url: "" }]);
  };

  const handleRemove = (index) => {
    formData.splice(index, 1);
    setFormData([...formData]);
  };

  const handleFormInput = (index, name, value) => {
    console.log(index, name, value);
    //setFormData(addLinks)
    setFormData((curr) => {
      let _curr = curr[index];
      if (!_curr) _curr = {};
      console.log(_curr);
      _curr[name] = value;
      curr[index] = _curr;
      return [...curr];
    });
  };

  const falseAll = () => {
    setTestOpsTitleError(false);
    setTestOpsLinkError(false);
  };

  const handleRemoveItem = (id) => {
    if (addLinks.length > 1) {
      // addLinks.splice(index, 1)
      // setAddLinks([...addLinks])
      // setFormData([...addLinks])
      // console.log("Links", addLinks)
      // console.log('FormData', formData)
      axios
        .delete(deleteLink(location.state.item.id, id))
        .then((response) => {
          console.log(response);
          getProject();
          toast.success("Link Removed Successfully");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      toast.info("Atleast One link is required");
    }
  };

  const handleDeleteProjectBtn = (currentItem) => {
    setOpen(true);
    setProjItem(currentItem);
  };

  const handleSaveItem = (i) => {
    console.log(i);

    if (formData[i].title === "") toast.info("Title should not be empty");

    if (formData[i].url === "") toast.info("Link should not be empty");

    if (!isValidURL(formData[i].url)) {
      toast.error("Link not valid");
    }

    if (formData[i].title && formData[i].url && isValidURL(formData[i].url)) {
      const payload = {
        title: formData[i].title,
        url: formData[i].url,
      };
      console.log("success", formData);
      axios
        .put(addLink(location.state.item.id), payload)
        .then((response) => {
          console.log(response);
          setAddLinks(response.data.data.meta.links);
          setFormData([]);
          toast.success("Link Added Successfully");
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleDeleteProject = (id) => {
    console.log("DeleteProject", id);
    axios
      .delete(projectEndpoint(id))
      .then((res) => {
        console.log(res);
        navigate("/projects");
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
      });
    setOpen(false);
  };

  useEffect(() => {
    //setAddLinks(location.state.item.meta.links)
    //setFormData(addLinks)

    getProject();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    //console.log('form', event)
    falseAll();

    const data = new FormData(event.currentTarget);

    const testOpsTitle = data.get("testOpsTitle");
    const testOpsLink = data.get("testOpsLink");

    console.log("Form-Data", formData);

    if (testOpsTitle === "") setTestOpsTitleError(true);

    if (!isValidURL(testOpsLink)) {
      setTestOpsLinkError(true);
      toast.error("Link not valid");
    }

    if (formData.length >= 1) {
      for (let i = 0; i < formData.length; i++) {
        if (formData[i].title === "" || formData[i].url === "") {
          toast.info("Please fill all fields");
        } else if (!isValidURL(formData[i].url)) {
          toast.error("Link not valid");
          return false;
        } else {
          axios
            .put(projectEndpoint(location.state.item.id), formData)
            .then((response) => {
              //console.log(response.data.status)
              navigate("/projects");
              window.location.reload();
            })
            .catch((error) => {
              console.log(error.response);
              if (error.response.status === 400)
                //setToast({ open: true, message: error.response.data.message })
                console.error(error.response.data.message);
              else toast.warning("something went wrong, please try later");

              console.error(error.response.data.message);
            });
        }
      }
    } else {
      toast.info("No change Made");
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
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
                <Button onClick={() => navigate(-1)} variant="outlined">
                  <KeyboardBackspaceSharpIcon />
                </Button>
              </Grid>
              <Grid item>
                <p className="heading">
                  Add Links to {location.state.item.display_name}
                </p>
              </Grid>
            </Grid>
          </div>

          {userCapabilities.some(e => e === permProjectDelete) &&
            <div>
              <Button
                onClick={() => handleDeleteProjectBtn(location.state.item)}
                variant="outlined"
                color="error"
                sx={{ mr: 1 }}
              >
                Delete Project
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </div>
          }
        </Stack>
      </div>

      <Paper sx={{ p: 5, minWidth: 500 }}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {addLinks?.map((item, index) => {
              return (
                <>
                  <Grid item xs={5} md={4} key={index}>
                    <TextField
                      name="testOpsTitle"
                      disabled
                      required
                      fullWidth
                      defaultValue={item.title}
                      placeholder="Enter Test Ops Title"
                      label={"Title: " + (index + 1)}
                      error={testOpsTitleError}
                      helperText={
                        testOpsTitleError ? "TestOps Title is mandatory" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={5} md={6}>
                    <TextField
                      name="testOpsLink"
                      disabled
                      required
                      fullWidth
                      defaultValue={item.url}
                      placeholder="Enter Test Ops Link"
                      label={"Link: " + (index + 1)}
                      error={testOpsLinkError}
                      helperText={
                        testOpsLinkError
                          ? "Please Enter a valid Test Ops Link!"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={2} md={2}>
                    <Box sx={{ display: "flex" }}>
                      {userCapabilities.some(e => e === permLinksDelete) &&
                        <Tooltip title={"Delete Link"}>
                          <IconButton
                            variant="contained"
                            sx={{ color: pink[600], mt: 1 }}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <CloseSharpIcon />
                          </IconButton>
                        </Tooltip>
                      }
                    </Box>
                  </Grid>
                </>
              );
            })}

            {formData?.map((item, index) => {
              return (
                <>
                  <Grid item xs={5} md={4} key={index}>
                    <TextField
                      name="testOpsTitle"
                      required
                      fullWidth
                      defaultValue={item.title}
                      onChange={(e) =>
                        handleFormInput(index, "title", e.target.value)
                      }
                      placeholder="Enter Test Ops Title"
                      label={"Title"}
                      error={testOpsTitleError}
                      helperText={
                        testOpsTitleError ? "TestOps Title is mandatory" : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={5} md={6}>
                    <TextField
                      onChange={(e) =>
                        handleFormInput(index, "url", e.target.value)
                      }
                      name="testOpsLink"
                      required
                      fullWidth
                      defaultValue={item.url}
                      placeholder="Enter Test Ops Link"
                      label={"Link"}
                      error={testOpsLinkError}
                      helperText={
                        testOpsLinkError
                          ? "Please Enter a valid Test Ops Link!"
                          : ""
                      }
                    />
                  </Grid>


                  <Grid item xs={2} md={2}>
                    <Box sx={{ display: "flex" }}>
                      {userCapabilities.some(e => e === permLinksDelete) &&
                        <Tooltip title={"Delete Link"}>
                          <IconButton
                            variant="contained"
                            sx={{ color: pink[600], mt: 1 }}
                            onClick={() => handleRemove(index)}
                          >
                            <CloseSharpIcon />
                          </IconButton>
                        </Tooltip>
                      }
                      <Tooltip title={"Save Link"}>
                        <IconButton
                          variant="contained"
                          sx={{ color: green[600], mt: 1 }}
                          onClick={() => handleSaveItem(index)}
                        >
                          <DoneSharpIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </>
              );
            })}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={10} md={10}></Grid>
            <Grid item xs={2} md={2}>
              {userCapabilities.some(e => e === permLinksAdd) &&
                <Button
                  onClick={handleAddMore}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 3 }}
                >
                  Add More
                </Button>
              }
            </Grid>
          </Grid>
        </Box>

        <DialogBox
          title={"Delete " + projItem.display_name + "?"}
          open={open}
          setOpen={setOpen}
          onConfirm={() => handleDeleteProject(projItem.id)}
        >
          Are you sure you want to delete {projItem.display_name}?
        </DialogBox>
      </Paper>
    </Box>
  );
};

export default AddLinks;
