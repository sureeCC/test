import { Box, LinearProgress, Typography } from "@mui/material";

export const showProgressBar = (boolean) => {
    if (boolean)
        return (
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6">Loading.....</Typography>
                <LinearProgress />
            </Box>
        )
    else return null;
}