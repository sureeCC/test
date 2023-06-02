import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  Typography
} from "@mui/material";
import axios from "axios";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  activateUserEndpoint,
  deActivateUser,
  projectUsersEndPoint,
  rolesEndPoint
} from "../Config/Endpoints";
import { shortDateFormat } from "../Utils/AppExtensions";
import RecordNotFound from "./RecordNotFound";

export default function ProjectUsers(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = location?.state?.item;
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
      const response = await axios.get(projectUsersEndPoint(props.project.id), {
        params: parms,
      });
      console.log("ProjectUsers-Data", response.data.data);
      setdata(response.data.data);
      //setTotal(response.data.data.total)
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

  const getRoleNameById = (roleId) => {
    var temp
    roles.map(role => {
      if (role.id === roleId)
        temp = role.name
    })
    return temp?.replace(/_/g, " ")
  }

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
        getData();
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
        getData();
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
  }, [currentProject]);

  return (
    <>
      <div>
        <div className="float-right">
          {/* <Button
                        variant='contained'
                        onClick={() => navigate('/signup', { state: { project: props.project } })}>
                        Add New User</Button> */}
        </div>
        <p className="heading">Project Users</p>
      </div>
      {/* <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              onChange={(e) => {
                setKeyField(e.target.value);
                handleKeyPress(e);
              }}
              value={keyField}
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
        <Grid item xs={3}>
          <TextField
            fullWidth
            select
            value={roleField}
            label="Role"
            onChange={(e) => {
              setRoleField(e.target.value);
              handleRoleChange(e);
            }}
          >
            <MenuItem value={""}>None</MenuItem>
            {roles.map((role) => {
              return (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusField}
              onChange={(e) => {
                setStatusField(e.target.value);
                handleStatusChange(e);
              }}
            >
              <MenuItem value={""}>None</MenuItem>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>In-Active</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid> */}
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              {/* <TableCell>S. No</TableCell> */}
              <TableCell>Name</TableCell>
              <TableCell>Mobile No.</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.results?.map((currentRow, index) => (
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
                    {currentRow.user.first_name +
                      " " +
                      currentRow.user.last_name}
                  </Typography>
                </TableCell>
                <TableCell>{currentRow.user.phone_number}</TableCell>
                <TableCell>{currentRow.user.email}</TableCell>
                <TableCell><div style={{ textTransform: "capitalize" }}>{getRoleNameById(currentRow.user_role.role_id)}</div></TableCell>
                <TableCell>
                  {new Date(currentRow.user.created_at).toLocaleString(
                    [], shortDateFormat)}
                </TableCell>
                <TableCell>
                  {currentRow.user.is_active ? (
                    <span className="status-passed">Active</span>
                  ) : (
                    <span className="status-failed">In-Active</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data?.total ? (
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component="div"
            count={data?.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : (
          <RecordNotFound onClearFilters={handleClearFilters} />
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            <Typography
              component={"span"}
              variant="subtitle2"
              color="error.dark"
            >
              Deactivate {selectedItem.first_name}?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to deactivate{" "}
              {selectedItem.first_name + " " + selectedItem.last_name}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button
              onClick={() => handleDeactivate(selectedItem.id)}
              variant="contained"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
}
