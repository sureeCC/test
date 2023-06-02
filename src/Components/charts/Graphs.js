import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import BuildsDefectsChart from './BuildsDefectsChart';
import BuildsMttdChart from './BuildsMttdChart';
import { scrollMessage } from './ChartService';
import DefectFixRateChart from './DefectFixRateChart';
import DefectTrendActivities from './DefectTrendActivities';
import DefectTrendBuildChart from './DefectTrendBuildChart';
import ExecutionTimeActivities from './ExecutionTimeActivities';
import ExecutionTimeBuildsChart from './ExecutionTimeBuildsChart';
import TestCaseMetricChart from './TestCaseMetricChart';
import TestExecAverage from './TestExecAverage';
import TestExecCoverage from './TestExecCoverage';
const Graphs = (props) => {
    const testExecCoverageData = props.testExecCoverageData
    const buildsDefectsData = props.buildsDefectsData
    const activitiesData = props.activitiesData
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="stretch"
            spacing={3}
            sx={{ mb: 2 }}
        >
            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2, }}>
                                <BuildsDefectsChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <BuildsMttdChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <TestExecAverage data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <DefectTrendBuildChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <DefectFixRateChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <TestExecCoverage data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <TestCaseMetricChart data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ExecutionTimeBuildsChart data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                {props.showDropdown !== "ALD" &&
                    <>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <DefectTrendActivities data={activitiesData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ExecutionTimeActivities data={activitiesData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                    </>}
            </Grid>
        </Stack>
    );
}

export default Graphs;