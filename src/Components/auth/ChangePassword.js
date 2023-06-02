import { Box, Button, TextField, Typography, Stack, Divider, InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { changePasswordEndPoint, verifyTokenEndPoint } from "../../Config/Endpoints";
import './Auth.css'
import Footer from '../../Components/Footer';
import ResetPasswordFailed from "./ResetPasswordFailed";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ChangePassword = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [tokenValid, setTokenValid] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [conPasswordError, setConPasswordError] = useState(false);

    
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleMouseDownNewPassword = () => setShowNewPassword(!showNewPassword);

  const [showConPassword, setShowConPassword] = useState(false);
  const handleClickShowConPassword = () => setShowConPassword(!showConPassword);
  const handleMouseDownConPassword = () => setShowConPassword(!showConPassword);


    const token = searchParams.get("token")
    console.log(token)
    useEffect(() => {
        const verifyToken = () => {
            axios.get(verifyTokenEndPoint(token)).then(response => {
                console.log(response)
                if (response.status === 200)
                    setTokenValid(true)
            }).catch(error => {
                console.error(error)
                if (error.response.status === 400)
                    //toast.error(error.response.data.message)
                    setTokenValid(false)
            })
        }
        verifyToken()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        setNewPasswordError(false)
        setConPasswordError(false)

        const data = new FormData(e.currentTarget);
        const newPassword = data.get('newPassword')
        const conPassword = data.get('conPassword')

        if (newPassword && conPassword && newPassword === conPassword) {
            axios.put(changePasswordEndPoint(token), { password: conPassword })
                .then(response => {
                    console.log(response)
                    if (response.status === 200) {
                        navigate('/reset-password-success')
                    }
                }).catch(error => {
                    console.error(error)
                    toast.error('Something went wrong, please try again later')
                })
        }
        if (newPassword === '')
            setNewPasswordError(true)

        if (conPassword === '')
            setConPasswordError(true)

        if (newPassword !== conPassword)
            toast.warning("New and confirm new password doesn't match each other")
    }
    if (tokenValid)
        return (
            <Box>
                < div className="login-fields" >
                    <Box className="inner-panel"
                    >
                        <Box>
                            <Stack
                                direction="row"
                                divider={<Divider orientation="vertical" flexItem />}
                                spacing={2}
                            >
                                <img width='100' src='../../igs_logo.png' />
                                <p className="test-viz-logo" color='primary' variant="h5">Test-Viz</p>
                            </Stack>
                        </Box>
                        <p className="welcome-text" sx={{ mt: 3 }}>
                            Reset Password
                        </p>
                        <Typography sx={{ width: 400, textAlign: 'center' }}>
                            Please enter your new password.
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{
                            width: 500,
                        }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoComplete="current-password"
                                id="newPassword"
                                label="New Password"
                                name="newPassword"
                                autoFocus
                                error={newPasswordError}
                                helperText={newPasswordError ? 'New Password field is mandatory' : ''}
                                type={showNewPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowNewPassword}
                                                onMouseDown={handleMouseDownNewPassword}
                                            >
                                                {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="conPassword"
                                autoComplete="current-password"
                                label="Confirm Password"
                                name="conPassword"
                                autoFocus
                                error={conPasswordError}
                                helperText={conPasswordError ? 'Confirm Password field is mandatory' : ''}
                                type={showConPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConPassword}
                                                onMouseDown={handleMouseDownConPassword}
                                            >
                                                {showConPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 4 }}
                            >
                                save new password
                            </Button>
                        </Box>
                        <Footer />
                    </Box>
                </div >
                <div className="image"></div>
            </Box >
        )
    return (<ResetPasswordFailed />)
}

export default ChangePassword;