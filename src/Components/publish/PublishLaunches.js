import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Button, FormControl, Grid, IconButton, InputAdornment, OutlinedInput, Paper, Stack, Table,
    TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { shortDateFormat } from '../../Utils/AppExtensions';

const PublishLaunches = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentProject = location?.state?.project
    console.log(currentProject)

    const [data, setData] = React.useState({
        total: 3,
        launches: [
            {
                build_name: 'Build Name',
                run_name: 'run Name',
                launch_name: 'Launch Name',
                executed_date: new Date(),
                created_date: new Date(),
                last_published_date: new Date()
            },
            {
                build_name: 'Build Name',
                run_name: 'run Name',
                launch_name: 'Launch Name',
                executed_date: new Date(),
                created_date: new Date(),
                last_published_date: new Date()
            },
            {
                build_name: 'Build Name',
                run_name: 'run Name',
                launch_name: 'Launch Name',
                executed_date: new Date(),
                created_date: new Date(),
                last_published_date: new Date()
            }
        ]
    });
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [value, setValue] = React.useState(0);
    const [parms, setParms] = React.useState({})
    const [startDate, setStartDate] = React.useState()
    const [openStart, setOpenStart] = React.useState(false)

    const handleKeyPress = (event) => {
        updateParams('key', event.target.value)
    }

    const handleStatusChange = (e) => {
        updateParams('status', e.target.value)
    }

    const updateParams = (key, value) => {
        setParms(curr => {
            curr[key] = value
            return { ...curr }
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }

    return (
        <>
            <div>
                <Stack direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}>
                    <div>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button onClick={() => navigate('/project-portal', { state: { tabIndex: 2, item: currentProject } })} variant='outlined'><KeyboardBackspaceSharpIcon /></Button>
                            </Grid>
                            <Grid item>
                                <p className='heading'>Publish New Manual Launches </p>
                            </Grid>
                        </Grid>
                    </div>
                </Stack>
            </div>
            <TableContainer component={Paper} sx={{ p: 2 }}>
                <Grid container spacing={3} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <OutlinedInput
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
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                                <DatePicker
                                    inputFormat="dd/MM/yyyy"
                                    open={openStart}
                                    onOpen={() => setOpenStart(true)}
                                    onClose={() => setOpenStart(false)}
                                    label="Execution From"
                                    value={startDate}
                                    disableFuture
                                    minDate={new Date('2022-01-01')}
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                        updateParams('startDate', newValue)
                                    }}
                                    renderInput={(params) => {
                                        return (
                                            <TextField
                                                {...params}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                onClick={(e) => setOpenStart(true)}
                                            />
                                        );
                                    }}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={3}>
                                <DatePicker
                                    inputFormat="dd/MM/yyyy"
                                    open={openStart}
                                    onOpen={() => setOpenStart(true)}
                                    onClose={() => setOpenStart(false)}
                                    label="Execution To"
                                    value={startDate}
                                    disableFuture
                                    minDate={new Date('2022-01-01')}
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                        updateParams('startDate', newValue)
                                    }}
                                    renderInput={(params) => {
                                        return (
                                            <TextField
                                                {...params}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                onClick={(e) => setOpenStart(true)}
                                            />
                                        );
                                    }}
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Grid>
                </Grid>
                <Table sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow className='table-head-background'>
                            <TableCell>S. No</TableCell>
                            <TableCell>Build Name</TableCell>
                            <TableCell>Run Name</TableCell>
                            <TableCell>Launch Name</TableCell>
                            <TableCell>Executed Date</TableCell>
                            <TableCell>Created Date</TableCell>
                            <TableCell>Last Published Date</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.launches?.map((currentRow, index) => (
                            <TableRow
                                key={index}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell align="left">{index + 1}</TableCell>
                                <TableCell component="th" scope="row">{currentRow.build_name}</TableCell>
                                <TableCell component="th" scope="row">{currentRow.run_name}</TableCell>
                                <TableCell component="th" scope="row">{currentRow.launch_name}</TableCell>
                                <TableCell component="th" scope="row">{new Date(currentRow.executed_date).toLocaleString("en-IN", shortDateFormat)}</TableCell>
                                <TableCell component="th" scope="row">{new Date(currentRow.created_date).toLocaleString("en-IN", shortDateFormat)}</TableCell>
                                <TableCell component="th" scope="row">{new Date(currentRow.last_published_date).toLocaleString("en-IN", shortDateFormat)}</TableCell>
                                <TableCell component="th" scope="row">
                                    <Stack direction="row" spacing={2}>
                                        <Tooltip title={'View Details of ' + currentRow.build_name}>
                                            <IconButton size="small">
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={'Publish ' + currentRow.build_name}>
                                            <Button size="small" variant='outlined'>
                                                Publish
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {data?.launches?.length ?
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                        component="div"
                        count={data?.total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> :
                    <Typography variant='h5' sx={{ pl: 4, m: 5 }}>No Records Found</Typography>
                }
            </TableContainer>
        </>
    );
}

export default PublishLaunches;