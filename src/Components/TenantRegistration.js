import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, Divider, Grid, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { tenantRegistrationEndPoint } from '../Config/Endpoints';
import './auth/Auth.css';
import Footer from './Footer';

export default function TenantRegistration() {

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [mobileError, setmobileError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleSubmit = (event) => {
        event.preventDefault();
        setFirstNameError(false)
        setmobileError(false)
        setEmailError(false)
        setPasswordError(false)

        const data = new FormData(event.currentTarget);
        const companyName = data.get('companyName')
        const domain = data.get('domain')
        const firstName = data.get('firstName')
        const lastName = data.get('lastName')
        const mobile = data.get('mobile')
        const email = data.get('email')
        const password = data.get('password')

        if (firstName && mobile && email && password) {
            const signupData = {
                domain: domain,
                title: companyName,
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: mobile,
                password: password
            }

            axios.post(tenantRegistrationEndPoint, signupData).then(response => {
                console.log(response)
                window.open('http://' + domain + '.local-dev:3000/login')
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

        if (email === '')
            setEmailError(true)

        if (password === '')
            setPasswordError(true)

    };

    return (
        <Box>
            <div className="control-panel">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3
                }}
                >
                    <p className="welcome-text">
                        Sign Up to
                    </p>
                    <Box sx={{ mb: 2 }}>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={2}
                        >
                            <img width='100' src='../../igs_logo.png' />
                            <p className="test-viz-logo" color='primary' variant="h5">Test-Viz</p>
                        </Stack>
                    </Box>
                    <Box component="form" noValidate onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 650
                        }} >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="company-name"
                                    name="companyName"
                                    required
                                    fullWidth
                                    id="companyName"
                                    placeholder='Enter company name'
                                    label="Company Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="domain-name"
                                    name="domain"
                                    required
                                    fullWidth
                                    id="domain"
                                    placeholder='Enter domain'
                                    label="Domain"
                                    autoFocus
                                    helperText='Domain name can not change after registration'
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    placeholder='Enter your first name'
                                    label="First Name"
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
                                    placeholder='Enter your last name'
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="mobile"
                                    label="Mobile Number"
                                    name="mobile"
                                    placeholder='Enter your Mobile Number'
                                    type="number"
                                    error={mobileError}
                                    helperText={mobileError ? 'Mobile number is mandatory and must be 10 digits' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    placeholder='Enter your email address'
                                    autoComplete="email"
                                    error={emailError}
                                    helperText={emailError ? 'Email Id is mandatory and must be Valid email' : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    id="password"
                                    placeholder='Enter your password'
                                    autoComplete="new-password"
                                    error={passwordError}
                                    helperText={emailError ? 'Password is Mandatory' : ''}
                                    type={showPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, width: 200 }}>Sign up
                        </Button>
                    </Box>
                    <p className='sign-up-label'>Already have an account?<Link style={{ textDecoration: 'none' }} to='/tenant-domain'>Login</Link> </p>
                    <Footer />
                </Box>
            </div>
            <div className="image-panel"></div>
        </Box>
    );
}