import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import { Paper, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateTesterEndPoint } from '../Config/Endpoints';
import AssignProjects from './AssignProjects';

export default function EditUser(props) {
    const navigate = useNavigate()
    const location = useLocation()
    const userRole = props.userRole

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [mobileError, setmobileError] = React.useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setFirstNameError(false)
        setmobileError(false)

        const data = new FormData(event.currentTarget);
        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const mobile = data.get('mobile')

        if (firstName && mobile) {
            const editData = {
                first_name: firstName,
                last_name: lastName,
                phone_number: mobile
            }

            axios.put(updateTesterEndPoint(location.state.user.id), editData).then(response => {
                console.log(response)
                navigate('/user-management')
                toast('User Edited Successfully!')
            }).catch(error => {
                console.log(error)
                toast.error(error.response.data.message)
            })
        }

        if (firstName === '')
            setFirstNameError(true)

        if (mobile === '') {
            setmobileError(true)
        }

    };

    return (
        <Box component="form" noValidate onSubmit={handleSubmit}>
            <div>
                <Stack direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}>
                    <div>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Button onClick={() => navigate(-1)} variant='outlined'><KeyboardBackspaceSharpIcon /></Button>
                            </Grid>
                            <Grid item>
                                <p className='heading'>Update User {location.state.user.first_name + ' ' + location.state.user.last_name}</p>
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outlined"
                            sx={{ mr: 1 }}>Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant='contained'>Save</Button>
                    </div>
                </Stack>
            </div>

            <Paper sx={{ p: 5, minWidth: 500 }}>
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                placeholder='Enter your first name'
                                label="First Name"
                                defaultValue={location.state.user.first_name}
                                autoFocus
                                error={firstNameError}
                                helperText={firstNameError ? 'First Name is mandatory' : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                defaultValue={location.state.user.last_name}
                                placeholder='Enter your last name'
                                autoComplete="family-name"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                id="mobile"
                                label="Mobile Number"
                                name="mobile"
                                defaultValue={location.state.user.phone_number}
                                placeholder='Enter your Mobile Number'
                                type="number"
                                error={mobileError}
                                helperText={mobileError ? 'Mobile number is mandatory and must be 10 digits' : ''}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                required
                                fullWidth
                                disabled
                                id="email"
                                label="email"
                                name="email"
                                defaultValue={location.state.user.email}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
            <Box sx={{ mt: 5 }}>
                <AssignProjects flag={1} />
            </Box>
        </Box>
    );
}