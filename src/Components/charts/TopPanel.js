import { Box, Grid, Typography } from '@mui/material';
import React from "react";
import GraphDropdown from '../controls/GraphDropDown';
import ResetZoomButton from '../controls/ResetZoom';

const GraphTopPanel = (props) => {
    const { chartRef, data, title } = props
    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <ResetZoomButton chartRef={chartRef} />
            </Grid>
            <Grid item xs={6}>
                <Box display="flex" justifyContent="center">
                    <Typography variant="h6">{title}</Typography>
                </Box>
            </Grid>
            <Grid item xs={3}>
                {props.showDropdown &&
                    <GraphDropdown data={data} />
                }

            </Grid>
        </Grid>
    );
}

export default GraphTopPanel;