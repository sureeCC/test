import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { scrollMessage } from '../ChartService';
import ActivitiesBuildsMttdChart from './BuildMttd';
import ActivitiesDefectFixRateChart from './DefectFixRate';
import ActivitiesDefectStatusChart from './DefectStatus';
import ActivitiesDefectTrendActivityChart from './DefectTrendActivity';
import ActivityExecutionTimeActivityChart from './ExecutionTimeActivity';
import ActivitiesTestCaseMetricChart from './TestCaseMetric';
import ActivitiesTestExecCoverageChart from './TestExecCoverage';
import ActivitiesTestExecutionAverageChart from './TestExecutionAverage';
const BuildGraphs = (props) => {
    const buildsDefectsData = props.buildsDefectsData
    const testExecCoverageData = props.testExecCoverageData
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
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesDefectStatusChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesBuildsMttdChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesTestExecutionAverageChart data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesDefectTrendActivityChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesDefectFixRateChart data={buildsDefectsData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesTestExecCoverageChart data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivitiesTestCaseMetricChart data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component={Paper} sx={{ p: 2 }}>
                                <ActivityExecutionTimeActivityChart data={testExecCoverageData} />
                                <Typography variant="caption">{scrollMessage}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Stack>
    );
}

export default BuildGraphs;