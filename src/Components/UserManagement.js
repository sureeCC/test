import AddTaskIcon from "@mui/icons-material/AddTask";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import DoNotDisturbAltSharpIcon from "@mui/icons-material/DoNotDisturbAltSharp";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLE_ID_ADMIN } from "../AccessPermissions/AccessRoles";
import { permUserActivate, permUserAdd, permUserAssign, permUserEdit } from "../AccessPermissions/UserPermissions";
import {
  activateUserEndpoint,
  deActivateUser,
  rolesEndPoint,
  testersEndPoint,
} from "../Config/Endpoints";
import { getUser, shortDateFormat } from "../Utils/AppExtensions";
import DialogBox from "./controls/DialogBox";
import RecordNotFound from "./RecordNotFound";

export default function UserManagement(props) {
  const navigate = useNavigate();
  const userCapabilities = props.userCapabilities
  const user = getUser()

  const [data, setdata] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState({});
  const [roles, setRoles] = React.useState([]);
  const [total, setTotal] = React.useState(10);
  const [parms, setParms] = React.useState({});

  const [keyField, setKeyField] = React.useState("");
  const [roleField, setRoleField] = React.useState("");
  const [statusField, setStatusField] = React.useState("");

  const handleClearFilters = () => {
    //document.getElementById("keyField").value = "";
    setKeyField("");
    setStatusField("");
    setRoleField("");
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

  const handleRoleChange = (e) => {
    updateParams("role", e.target.value);
  };

  const handleStatusChange = (e) => {
    updateParams("status", e.target.value);
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

  const getData = async (parms) => {
    try {
      const response = await axios.get(testersEndPoint, { params: parms });
      console.log("Testers-Data", response.data.data);
      setdata(response.data.data.results);
      setTotal(response.data.data.total);
    } catch (e) {
      console.error(e);
      toast.error("An error has occured, please contact Administrator!");
    }
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(rolesEndPoint);
      console.log("Roles-Data", response.data.data);
      setRoles(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeactivateIcon = (currentItem) => {
    //console.error(currentItem.id)
    setOpen(true);
    setSelectedItem(currentItem);
  };

  const handleActivateIcon = (currentItem) => {
    //console.error(currentItem.id)
    axios
      .put(activateUserEndpoint(currentItem.id))
      .then((response) => {
        console.log("User activated", response);
        getData(parms);
        toast.success({ open: true, message: "User Activated Successfully" });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeactivate = () => {
    console.error(selectedItem);
    axios
      .put(deActivateUser(selectedItem.id))
      .then((response) => {
        console.log("putUserResponse", response.data);
        setOpen(false);
        getData(parms);
        toast.success({
          open: true,
          message: "User De-activated Successfully",
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleAssignProjects = (item) => {
    console.log("assignProjectToUserClicked", item);
    navigate("/assign-projects", { state: { user: item } });
  };

  const handleEditClick = (item) => {
    console.log("EditUserClicked", item);
    navigate("/edit-user", { state: { user: item } });
  };

  React.useEffect(() => {
    getRoles();
  }, []);

  return (
    <>
      <div>
        <div className="float-right">
          {userCapabilities.some(e => e === permUserAdd) &&
            <Button variant="contained" component={Link} to="/signup">
              Add New User
            </Button>}
        </div>
        <p className="heading">User Management</p>
      </div>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              id="keyField"
              onChange={(e) => {
                setKeyField(e.target.value);
                handleKeyPress(e);
              }}
              value={keyField}
              size="small"
              placeholder="Search"
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
        <Grid item xs={4}>
          <TextField
            fullWidth
            size="small"
            select
            value={roleField}
            label="Role"
            onChange={(e) => {
              setRoleField(e.target.value);
              handleRoleChange(e);
            }}
          >
            <MenuItem value={""}>All</MenuItem>
            {roles.map((role) => {
              return (
                <MenuItem key={role.id} value={role.id}>
                  {role.display_name}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            select
            size="small"
            label="Status"
            value={statusField}
            onChange={(e) => {
              setStatusField(e.target.value);
              handleStatusChange(e);
            }}
          >
            <MenuItem value={""}>All</MenuItem>
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>In-Active</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              {/* <TableCell>S. No</TableCell> */}
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((currentRow, index) => (
              <TableRow
                key={currentRow.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* <TableCell align="left">{index + 1}</TableCell> */}
                <TableCell component="th" scope="row">
                  <Typography
                    className="project-name-cells"
                    variant="subtitle2"
                  >
                    {currentRow.first_name}
                  </Typography>
                </TableCell>
                <TableCell>{currentRow.last_name}</TableCell>
                <TableCell>{currentRow.phone_number}</TableCell>
                <TableCell>{currentRow.email}</TableCell>
                <TableCell>
                  {currentRow.is_active ? (
                    <span className="status-passed">Active</span>
                  ) : (
                    <span className="status-failed">In-Active</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(currentRow.created_at).toLocaleString("en-IN", shortDateFormat)}
                </TableCell>
                <TableCell>
                  {currentRow.is_active ? (
                    userCapabilities.some(e => e === permUserActivate) &&
                    <Tooltip
                      title={"De-activate User : " + currentRow.first_name}
                    >
                      <IconButton
                        disabled={currentRow?.roles[0].role_id === ROLE_ID_ADMIN}
                        variant="contained"
                        sx={{ color: "#DA1414" }}
                        onClick={() => handleDeactivateIcon(currentRow)}
                      >
                        <DoNotDisturbAltSharpIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    userCapabilities.some(e => e === permUserActivate) &&
                    <Tooltip
                      title={"Activate User : " + currentRow.first_name}
                    >
                      <IconButton
                        disabled={currentRow?.roles[0].role_id === ROLE_ID_ADMIN}
                        variant="contained"
                        sx={{ color: "#287D3C" }}
                        onClick={() => handleActivateIcon(currentRow)}
                      >
                        <CheckCircleOutlineSharpIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {userCapabilities.some(e => e === permUserEdit) &&
                    <Tooltip title={"Edit User : " + currentRow.first_name}>
                      <IconButton
                        sx={{ color: "#858C94" }}
                        variant="contained"
                        onClick={() => handleEditClick(currentRow)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  }

                  {userCapabilities.some(e => e === permUserAssign) &&
                    <Tooltip
                      title={"Assign Projects to : " + currentRow.first_name}
                    >
                      <IconButton
                        disabled={!currentRow.is_active}
                        variant="contained"
                        onClick={() => handleAssignProjects(currentRow)}
                        color="primary"
                      >
                        <AddTaskIcon />
                      </IconButton>
                    </Tooltip>
                  }

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : (
          <RecordNotFound onClearFilters={handleClearFilters} />
        )}

        <DialogBox
          title={"Deactivate " + selectedItem.first_name + "?"}
          open={open}
          setOpen={setOpen}
          onConfirm={() => handleDeactivate(selectedItem.id)}
        >
          Are you sure you want to deactivate{" "}
          {selectedItem.first_name + " " + selectedItem.last_name}?
        </DialogBox>
      </TableContainer>
    </>
  );
}
