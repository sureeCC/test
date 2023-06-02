import { Box, Button, Grid, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Publish = () => {
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <>
            <Box component={Paper} sx={{ p: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={3}>
                        Manual Launches
                    </Grid>
                    <Grid item>
                        <Button variant='outlined'>Manage</Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Button onClick={() => navigate('/publish-manual-launch', { state: { project: location.state.item } })} variant='contained'>Publish New Entry</Button>
                    </Grid>
                    <Grid item xs={3} sx={{ mt: 2 }}>
                        Defects
                    </Grid>
                    <Grid item sx={{ mt: 2 }}>
                        <Button variant='outlined'>Manage</Button>
                    </Grid>
                    <Grid item xs={7} sx={{ mt: 2 }}>
                        <Button variant='contained'>Publish New Entry</Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default Publish;