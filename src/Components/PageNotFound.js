import { Stack, Typography } from "@mui/material";

const PageNotFound = () => {
    return (
        <Stack className="center-screen" direction="column" spacing={2}>
            <img src='../404.svg' alt='page not found' />
            <p className="heading">Page not found!</p>
            <Typography variant="body1">The requested URL {window.location.href} not found on this server.</Typography>
        </Stack>
    );
}

export default PageNotFound;