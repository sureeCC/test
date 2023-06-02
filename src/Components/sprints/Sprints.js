import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment, OutlinedInput,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import dayjs from "dayjs";
import { React, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { permSprintAdd, permSprintEdit } from "../../AccessPermissions/SprintsPermissions";
import { getBuildsEndPoint, sprintsEndPoint } from "../../Config/Endpoints";
import { getDaysDifference, shortDateFormat } from "../../Utils/AppExtensions";
import DialogBox from "../controls/DialogBox";
import RecordNotFound from "../RecordNotFound";

const Sprints = (props) => {
    const navigate = useNavigate();
    const userCapabilities = props.userCapabilities
    const location = useLocation();
    const currentProject = props.currentProject

    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [parms, setParms] = useState({});
    const [currentBuild, setCurrentBuild] = useState({});

    const [sprintName, setsprintName] = useState("");
    const [sprintNameError, setsprintNameError] = useState(false);
    const [openStartDate, setopenStartDate] = useState(false);
    const [startDate, setstartDate] = useState("");
    const [startDateError, setstartDateError] = useState(false);
    const [openEndDate, setopenEndDate] = useState(false);
    const [endDate, setendDate] = useState("");
    const [endDateError, setendDateError] = useState(false);

    const [currentItem, setCurrentItem] = useState({});
    const [editSprintName, seteditSprintName] = useState("");
    const [editStartDate, seteditStartDate] = useState("");
    const [editEndDate, seteditEndDate] = useState("");
    const [buildsData, setBuildsData] = useState([]);

    const [sprintGoal, setSprintGoal] = useState("-");
    const [openSprintClosure, setOpenSprintClosure] = useState(false);
    const [openEditClosureDialog, setOpenEditClosureDialog] = useState(false);
    const [closureReport, setClosureReport] = useState("");

    const [keyField, setKeyField] = useState("");

    const isBetween = require('dayjs/plugin/isBetween')
    dayjs.extend(isBetween)

    const handleClearFilters = () => {
        setKeyField("");
        setParms({});
    };

    const updateParams = (key, value) => {
        setParms((curr) => {
            curr[key] = value;
            return { ...curr };
        });
    };

    const handleKeyPress = (event) => {
        updateParams("key", event.target.value);
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

    const clearFields = () => {
        setsprintName("")
        setstartDate(null)
        setendDate(null)
    }

    const clearValidation = () => {
        setsprintNameError(false)
        setstartDateError(false)
        setendDateError(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearValidation()
        try {
            const payload = {
                sprint_name: sprintName,
                start_date: dayjs(startDate).startOf('day').toISOString(),
                end_date: dayjs(endDate).endOf('day').toISOString(),
                project_id: currentProject.id,
                goal: sprintGoal
            }
            console.log(payload)
            if (sprintName && startDate && endDate) {
                clearFields()
                axios.post(sprintsEndPoint, payload).then(res => {
                    console.log(res)
                    getData(parms);
                    setOpen(false)
                }).catch(e => {
                    console.error(endDate)
                    if (e.response.status === 400)
                        toast.error(e.response.data.message)
                    setOpen(false)
                })
            }

            else { toast.error("Please fill all mandatory fields!") }

            if (sprintName === "")
                setsprintNameError(true)

            if (startDate === null || startDate === "")
                setstartDateError(true)

            if (endDate === null || endDate === "")
                setendDateError(true)
        } catch (error) {
            toast.error("Please fill all mandatory fields!")
        }
    };


    const handleSubmitEdit = (e) => {
        e.preventDefault();
        try {
            const payload = {
                sprint_name: editSprintName,
                start_date: dayjs(editStartDate).startOf('day').toISOString(),
                end_date: dayjs(editEndDate).endOf('day').toISOString(),
                project_id: currentProject.id,
                goal: sprintGoal
            }
            if (editSprintName && editStartDate && editEndDate) {
                clearFields()
                axios.put(sprintsEndPoint + '/' + currentItem._id, payload).then(res => {
                    console.log(res)
                    getData(parms);
                    setOpenEditDialog(false)
                    toast.success("Sprint Updated!")
                }).catch(e => {
                    console.error(endDate)
                    if (e.response.status === 400)
                        toast.error(e.response.data.message)
                })
            } else toast.error("Please fill all required fields!")
        } catch (error) {
            toast.error("Please fill all required fields!")
        }
    };

    const getData = useCallback(async (parms) => {
        try {
            const response = await axios.get(sprintsEndPoint + currentProject.id, {
                params: parms,
            });
            console.log("Sprints-Data", response.data.data);
            setData(response.data.data);
        } catch (e) {
            console.error(e.message);
        }
    }, [parms]);

    const handleDeleteSprint = () => {
        axios
            .delete('getBuildsEndPoint(currentBuild?._id)')
            .then((response) => {
                console.log(response);
                toast.success("Sprint deleted successfully!");
                getData(parms);
            })
            .catch((err) => {
                console.error(err);
                toast.info("Could not delete Sprint. please contact admin");
            });
    };

    const getBuildsData = useCallback(async (props, currentItem) => {
        try {
            const response = await axios.get(getBuildsEndPoint(props.currentProject.id), {
                params: { sprintId: currentItem._id },
            });
            console.log("BuildsDataInSprints", response.data.data);
            setBuildsData(response.data.data);
        } catch (e) {
            console.error(e);
        }
    }, [])

    const handleEditClosure = () => {
        if (closureReport) {
            axios
                .put(sprintsEndPoint + currentItem?._id + "/addreport", { report: closureReport })
                .then((response) => {
                    console.log(response);
                    toast.success("Sprint Closure Report Added successfully!");
                    getData(parms, props);
                    setOpenEditClosureDialog(false)
                })
                .catch((err) => {
                    console.error(err);
                    toast.info("Could not Update Sprint Closure Report. Please try again!");
                    setOpenEditClosureDialog(false)
                });
        } else toast.info("Please write in closure report")
    }

    useEffect(() => {
        getData(parms);
    }, [getData, location.state, parms]);

    useEffect(() => {
        if (!currentItem) return
        getBuildsData(props, currentItem)
    }, [currentItem, getBuildsData, props]);

    return (
        <div>
            <TableContainer component={Paper} sx={{ p: 2 }}>
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <OutlinedInput
                                placeholder="Search"
                                value={keyField}
                                onChange={(e) => {
                                    setKeyField(e.target.value);
                                    handleKeyPress(e);
                                }}
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
                    <Grid item xs={8}>
                        {userCapabilities.some(e => e === permSprintAdd) &&
                            <Button
                                className="float-right"
                                sx={{ mt: 1 }}
                                variant="contained"
                                onClick={() => {
                                    clearValidation()
                                    setOpen(true);
                                    setSprintGoal("-")
                                }}
                                size="large"
                            >
                                Add New Sprint
                            </Button>
                        }
                    </Grid>
                </Grid>
                <Table sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>S. No</TableCell>
                            <TableCell>Sprint Name</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Days</TableCell>
                            <TableCell>Sprint Goal</TableCell>
                            <TableCell>Closure Report</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.sprints?.map((currentRow, index) => (
                            <TableRow
                                key={index}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell align="left">{index + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                    {currentRow.sprint_name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {new Date(currentRow?.start_date).toLocaleString("en-IN", shortDateFormat)}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {new Date(currentRow?.end_date).toLocaleString("en-IN", shortDateFormat)}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {currentRow.duration} days
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }} component="th" scope="row">
                                    {currentRow.goal ? currentRow.goal : "-"}
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }} component="th" scope="row">
                                    {currentRow.report?.content ? currentRow.report.content : "-"}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Stack direction="row" spacing={2}>
                                        {userCapabilities.some(e => e === permSprintEdit) &&
                                            < Tooltip title={"Edit Details of " + currentRow.sprint_name}>
                                                <IconButton
                                                    // disabled={new Date(currentRow.start_date) - new Date() < 0 && new Date(currentRow.end_date) - new Date() < 0}
                                                    size="small"
                                                    onClick={() => {
                                                        setCurrentItem(currentRow)
                                                        setOpenEditDialog(true)
                                                        seteditSprintName(currentRow.sprint_name)
                                                        seteditStartDate(currentRow.start_date)
                                                        seteditEndDate(currentRow.end_date)
                                                        setSprintGoal(currentRow.goal ? currentRow.goal : "-")
                                                    }
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                        {/* <Tooltip title={"Delete " + currentRow.sprint_name}>
                                            <IconButton
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip> */}
                                        <Tooltip placement="top" title={"View Sprint Closure Report of " + currentRow.sprint_name}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    setOpenSprintClosure(true);
                                                    setCurrentItem(currentRow)
                                                }}
                                            >
                                                <InsertDriveFileIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {data?.sprints?.length ? (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={data.total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                ) : (
                    <RecordNotFound onClearFilters={handleClearFilters} />
                )}
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <DialogTitle>
                            <div>
                                <Tooltip title="Close">
                                    <IconButton
                                        style={{
                                            float: "right",
                                            cursor: "pointer",
                                            marginTop: "-5px",
                                        }}
                                        onClick={() => setOpen(false)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                                <p className="sub-heading">Add New Sprint </p>
                            </div>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Box sx={{ p: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="build-name"
                                            required
                                            fullWidth
                                            placeholder="Enter sprint name"
                                            label="Sprint Name"
                                            autoFocus
                                            onChange={(e) => setsprintName(e.target.value)}
                                            error={sprintNameError}
                                            helperText={sprintNameError && "Sprint Name is required!"}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat="dd/MM/yyyy"
                                                open={openStartDate}
                                                onOpen={() => setopenStartDate(true)}
                                                onClose={() => setopenStartDate(false)}
                                                label="Start Date"
                                                value={startDate}
                                                // disablePast
                                                minDate={new Date("2022-01-01")}
                                                onChange={(newValue) => {
                                                    setstartDate(newValue);
                                                }}
                                                renderInput={(params) => {
                                                    return (
                                                        <TextField
                                                            required
                                                            {...params}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            helperText={
                                                                startDateError
                                                                    ? "Reported Date is required!"
                                                                    : ""
                                                            }
                                                            error={startDateError}
                                                            onClick={(e) => setopenStartDate(true)}
                                                        />
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat="dd/MM/yyyy"
                                                open={openEndDate}
                                                onOpen={() => setopenEndDate(true)}
                                                onClose={() => setopenEndDate(false)}
                                                label="End Date"
                                                value={endDate}
                                                // disablePast
                                                minDate={startDate}
                                                onChange={(newValue) => {
                                                    setendDate(newValue);
                                                }}
                                                renderInput={(params) => {
                                                    return (
                                                        <TextField
                                                            required
                                                            {...params}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            helperText={
                                                                endDateError ? "Closed Date is required!" : ""
                                                            }
                                                            error={endDateError}
                                                            onClick={(e) => setopenEndDate(true)}
                                                        />
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Sprint Goal"
                                            placeholder="Write some goals here..."
                                            value={sprintGoal}
                                            multiline
                                            rows={5}
                                            onChange={(e) => setSprintGoal(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ m: 1 }}>
                            <Button variant="outlined" onClick={() => setOpen(false)}>
                                No
                            </Button>
                            <Button type="submit" variant="contained" autoFocus>
                                Save
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
                <DialogBox
                    title={"Delete Build " + currentBuild?.build_number}
                    open={openDeleteDialog}
                    setOpen={setOpenDeleteDialog}
                    onConfirm={handleDeleteSprint}
                >
                    Are you sure you want to delete sprint {currentBuild?.build_number}?
                </DialogBox>
                {/*  edit dialog goes from here */}

                <Dialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <Box component="form" onSubmit={handleSubmitEdit} noValidate>
                        <DialogTitle>
                            <div>
                                <Tooltip title="Close">
                                    <IconButton
                                        style={{
                                            float: "right",
                                            cursor: "pointer",
                                            marginTop: "-5px",
                                        }}
                                        onClick={() => setOpenEditDialog(false)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                                <p className="sub-heading">Update existing Sprint </p>
                            </div>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Box sx={{ p: 1 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="build-name"
                                            required
                                            fullWidth
                                            placeholder="Enter sprint name"
                                            label="Sprint Name"
                                            autoFocus
                                            defaultValue={currentItem.sprint_name}
                                            onChange={(e) => seteditSprintName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat="dd/MM/yyyy"
                                                disabled={dayjs(editStartDate).isBefore(dayjs()) && dayjs(editEndDate).isAfter(dayjs()) && buildsData?.builds?.length > 0}
                                                open={dayjs(editStartDate).isBefore(dayjs()) && dayjs(editEndDate).isAfter(dayjs()) && buildsData?.builds?.length > 0 ? false : openStartDate}

                                                onOpen={() => setopenStartDate(true)}
                                                onClose={() => {
                                                    setopenStartDate(false)
                                                    setBuildsData([])
                                                }
                                                }
                                                label="Start Date"
                                                value={editStartDate}
                                                // disablePast
                                                minDate={new Date("2022-01-01")}
                                                onChange={(newValue) => {
                                                    seteditStartDate(newValue);
                                                }}
                                                renderInput={(params) => {
                                                    return (
                                                        <TextField
                                                            required
                                                            {...params}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            onClick={(e) => setopenStartDate(true)}
                                                        />
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat="dd/MM/yyyy"
                                                open={openEndDate}
                                                onOpen={() => setopenEndDate(true)}
                                                onClose={() => setopenEndDate(false)}
                                                label="End Date"
                                                value={editEndDate}
                                                // disablePast
                                                minDate={editStartDate}
                                                onChange={(newValue) => {
                                                    seteditEndDate(newValue);
                                                }}
                                                renderInput={(params) => {
                                                    return (
                                                        <TextField
                                                            required
                                                            {...params}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            onClick={(e) => setopenEndDate(true)}
                                                        />
                                                    );
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Sprint Goal"
                                            placeholder="Write some goals here..."
                                            value={sprintGoal}
                                            multiline
                                            rows={5}
                                            onChange={(e) => setSprintGoal(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                        <Divider />
                        <DialogActions sx={{ m: 1 }}>
                            <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
                                No
                            </Button>
                            <Button type="submit" variant="contained" autoFocus>
                                Save
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                {/* view sprint closure dialog */}
                <Dialog
                    open={openSprintClosure}
                    onClose={() => setOpenSprintClosure(false)}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogTitle>
                        <div>
                            <Tooltip title="Close">
                                <IconButton
                                    style={{
                                        float: "right",
                                        cursor: "pointer",
                                        marginTop: "-5px",
                                    }}
                                    onClick={() => setOpenSprintClosure(false)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <p className="sub-heading">View Sprint Closure Report </p>
                        </div>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                Sprint Name :
                            </Grid>
                            <Grid item xs={9}>
                                {currentItem.sprint_name}
                            </Grid>
                            <Grid item xs={3}>
                                Start Date :
                            </Grid>
                            <Grid item xs={9}>
                                {new Date(currentItem?.start_date).toLocaleString("en-IN", shortDateFormat)}
                            </Grid>
                            <Grid item xs={3}>
                                End Date :
                            </Grid>
                            <Grid item xs={9}>
                                {new Date(currentItem?.end_date).toLocaleString("en-IN", shortDateFormat)}
                            </Grid>
                            <Grid item xs={3}>
                                Duration :
                            </Grid>
                            <Grid item xs={9}>
                                {currentItem.duration} days
                            </Grid>
                            <Grid item xs={3}>
                                Status :
                            </Grid>
                            <Grid item xs={9}>
                                {dayjs().isBetween(dayjs(currentItem.start_date), dayjs(currentItem.end_date)) ?
                                    <span className="sprint-drp-label-current">Current</span> :
                                    dayjs().isAfter(dayjs(currentItem.start_date), 'day') ?
                                        <span className="sprint-drp-label-past">Past</span> :
                                        <span className="sprint-drp-label-past">Future</span>
                                }
                            </Grid>
                            <Grid item xs={3}>
                                Sprint Goal :
                            </Grid>
                            <Grid item xs={9}>
                                {currentItem.goal ? currentItem.goal : "-"}
                            </Grid>
                            <Grid item xs={3}>
                                Closure Report :
                            </Grid>
                            <Grid item xs={9}>
                                {currentItem.report?.content ? currentItem.report.content : "-"}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setOpenSprintClosure(false)}>
                            cancel
                        </Button>
                        {userCapabilities.some(e => e === permSprintEdit) &&
                            <Button onClick={() => {
                                setOpenSprintClosure(false)
                                setOpenEditClosureDialog(true)
                                setClosureReport(currentItem.report?.content ? currentItem.report.content : "")
                            }} variant="contained" autoFocus>
                                Edit
                            </Button>
                        }
                    </DialogActions>
                </Dialog>

                {/* edit closure dialog */}

                <Dialog
                    open={openEditClosureDialog}
                    onClose={() => setOpenEditClosureDialog(false)}
                    fullWidth={true}
                    maxWidth="sm"
                >
                    <DialogTitle>
                        <div>
                            <Tooltip title="Close">
                                <IconButton
                                    style={{
                                        float: "right",
                                        cursor: "pointer",
                                        marginTop: "-5px",
                                    }}
                                    onClick={() => setOpenEditClosureDialog(false)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <p className="sub-heading">Edit Build Closure Report </p>
                        </div>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                Sprint Name
                            </Grid>
                            <Grid item xs={8}>
                                {currentItem?.sprint_name}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Closure Report"
                                    placeholder="Write here your sprint closure..."
                                    value={closureReport}
                                    multiline
                                    rows={5}
                                    onChange={(e) => setClosureReport(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <Divider />
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setOpenEditClosureDialog(false)}>
                            cancel
                        </Button>
                        <Button onClick={handleEditClosure} variant="contained">
                            save
                        </Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
        </div >
    );
}

export default Sprints;