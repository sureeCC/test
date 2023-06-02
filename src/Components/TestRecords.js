import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import {
    Box,
    Button,
    Collapse, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import axios from "axios";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { testRecordsEndPoint } from "../Config/Endpoints";
import { shortFullDateFormat } from '../Utils/AppExtensions';
import humanizeDuration from 'humanize-duration';

const TestRecords = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentProject = location?.state?.project
    const currentBuild = location?.state?.build
    const currentRun = location?.state?.runs
    const currentLaunch = location?.state?.launch
    const currentActivity = location?.state?.activity

    const [data, setData] = React.useState([]);
    const [testRecords, setTestRecords] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(-1);
    const [parms, setParms] = React.useState({})

    const updateParams = (key, value) => {
        setParms(curr => {
            curr[key] = value
            return { ...curr }
        })
    }

    const handleKeyPress = (event) => {
        updateParams('key', event.target.value)
    }

    const handleStatusChange = (e) => {
        updateParams('status', e.target.value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        updateParams('pageNumber', newPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        updateParams('pageSize', event.target.value)
    }

    const getData = async (parms) => {
        try {
            const response = await axios.get(testRecordsEndPoint(currentLaunch._id), { params: parms });
            console.log("testcases-Data", response.data.data);
            setData(response.data.data);
        } catch (e) {
            console.error(e);
        }
    }

    React.useEffect(() => {
        getData(parms);
        //console.info(currentProject,currentBuild, currentRun, currentLaunch)
    }, [location.state, parms]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item>
                    <Button onClick={() => navigate('/build-launches', {
                        state: {
                            tabIndex: 1,
                            project: currentProject, build: currentBuild, runs: currentRun, launch: currentLaunch, activity: currentActivity
                        }
                    })} variant='outlined'><KeyboardBackspaceSharpIcon /></Button>
                </Grid>
                <Grid item>
                    {/* <p className='heading'>{currentProject.display_name}/{currentBuild.build_number}/{currentRun.run_name}/{currentLaunch.launch_name}</p> */}
                    <p className='heading'>Test Cases of Launch &nbsp;{currentLaunch.launch_name}</p>
                </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{ p: 2 }}>
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined">
                            <OutlinedInput
                                size='small'
                                placeholder="Search"
                                onChange={(e) => handleKeyPress(e)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                        >
                                            <SearchSharpIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField fullWidth size='small' select label='Status' onChange={(e) => handleStatusChange(e)}
                        >
                            <MenuItem value={''}>All</MenuItem>
                            <MenuItem value={'passed'}>Passed</MenuItem>
                            <MenuItem value={'failed'}>Failed</MenuItem>
                            <MenuItem value={'skipped'}>Skipped</MenuItem>
                        </TextField >
                    </Grid>
                </Grid>
                <Table sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow className='table-head-background'>
                            <TableCell>S. No</TableCell>
                            <TableCell>Case Name</TableCell>
                            <TableCell>Start Date/Time</TableCell>
                            <TableCell>End Date/Time</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.testCases?.map((currentRow, index) => (
                            <>
                                <TableRow
                                    key={index}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell component="th" scope="row">{currentRow.tag}</TableCell>
                                    <TableCell component="th" scope="row">{new Date(currentRow.metrics.start_time).toLocaleString("en-IN", shortFullDateFormat)}</TableCell>
                                    <TableCell component="th" scope="row">{new Date(currentRow.metrics.end_time).toLocaleString("en-IN", shortFullDateFormat)}</TableCell>
                                    <TableCell component="th" scope="row">{humanizeDuration(currentRow.metrics.duration, { units: ["ms"] })}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {currentRow.metrics.status === 'failed' ?
                                            // <Button
                                            //     className='status-failed'
                                            //     onClick={() => setOpen(open === index ? -1 : index)}
                                            //     endIcon={open === -1 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            //     si ze='small'>
                                            //     {currentRow.metrics.status}
                                            // </Button>
                                            <Button className='status-failed-btn'
                                                onClick={() => setOpen(open === index ? -1 : index)}
                                                endIcon={<KeyboardArrowDownIcon />}>
                                                {currentRow.metrics.status}
                                            </Button>
                                            :
                                            currentRow.metrics.status === 'passed' ?
                                                <span className='status-passed'>{currentRow.metrics.status}</span> :
                                                <Button
                                                    className='status-skipped-btn'
                                                    onClick={() => setOpen(open === index ? -1 : index)}
                                                    endIcon={<KeyboardArrowDownIcon />}>
                                                    {currentRow.metrics.status}
                                                </Button>

                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={open === index} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Table size="small">
                                                    {/* <TableHead>
                                                        <TableRow>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Customer</TableCell>
                                                            <TableCell align="right">Amount</TableCell>
                                                            <TableCell align="right">Total price ($)</TableCell>
                                                        </TableRow>
                                                    </TableHead> */}
                                                    <TableBody>
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">
                                                                <Typography variant='h6' color='error'>
                                                                    {currentRow.trace?.title}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                        {currentRow.trace?.description.map((trace, index) => (
                                                            <TableRow key={index}
                                                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                                <TableCell component="th" scope="row">
                                                                    {trace}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}

                    </TableBody>
                </Table>
                {data?.testCases?.length ? <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                    component="div"
                    count={data.total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> :
                    <Typography variant='h5' sx={{ p5: 4, m: 5 }}>No Records Found</Typography>
                }
            </TableContainer>
        </>
    );
}

export default TestRecords;