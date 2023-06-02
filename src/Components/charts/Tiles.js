import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { convertToTwoDecimalPlaces } from '../../Utils/AppExtensions';
import ActivityExecutionTimeActivityChart from "./build-charts/ExecutionTimeActivity";
import ActivitiesTestExecCoverageChart from './build-charts/TestExecCoverage';
import ExecutionTimeBuildsChart from './ExecutionTimeBuildsChart';
import TestExecCoverage from './TestExecCoverage';
import TestCaseMetricChart from './TestCaseMetricChart';
import ActivitiesTestCaseMetricChart from './build-charts/TestCaseMetric';
import ActivitiesDefectStatusChart from './build-charts/DefectStatus';
import BuildsDefectsChart from './BuildsDefectsChart';
import ActivitiesDefectTrendActivityChart from './build-charts/DefectTrendActivity';
import DefectTrendBuildChart from './DefectTrendBuildChart';
import DefectRejectedDataChart from "./DefectRejectedDataChart";
import ActivitiesDefectsRejectedData from "./build-charts/DefectsRejectedData";
import NewTestCasesAddedChart from "./NewTestCasesAddedChart";
import ActivitiesNewTestCasesAddedChart from "./build-charts/NewTestCasesAdded";
import { useNavigate } from "react-router-dom";
import { addProjectPortalTabIndex } from "../../redux/tab-index/actions";
import VarianceTable from "../controls/VarianceTable";
import MultipleVarianceTables from "../controls/MultipleVarianceTables";

const Tiles = (props) => {
    const navigate = useNavigate()
    const tilesData = props.tilesData ? props.tilesData : {}
    const [openTileDialog, setOpenTileDialog] = useState(false);
    const [tileName, setTileName] = useState("");
    const [graphTitle, setGraphTitle] = useState("");

    const handleTileClick = (tileName, title) => {
        setOpenTileDialog(true)
        setTileName(tileName)
        setGraphTitle(title)
    }

    const handleBuildClick = () => {
        if (window.location.pathname === "/dashboard")
            navigate("/project-portal", {
                state: { origin: 'builds', item: props.currentProject, currentSprint: {} },
            })
        else {
            addProjectPortalTabIndex(1)
        }
    }
    const renderGraph = () => {
        if (window.location.pathname === "/build-portal") {
            if (tileName === "TET")
                return <ActivityExecutionTimeActivityChart data={props.testExecCoverageData} />
            if (tileName === "TECA")
                return <ActivitiesTestExecCoverageChart data={props.testExecCoverageData} />
            if (tileName === "MPRA" || tileName === "APRA")
                return <ActivitiesTestCaseMetricChart data={props.testExecCoverageData} />
            if (tileName === "TDR")
                return <ActivitiesDefectStatusChart data={props.buildsDefectsData} />
            if (tileName === "DAR")
                return <ActivitiesDefectTrendActivityChart data={props.buildsDefectsData} />
            if (tileName === "DRD")
                return <ActivitiesDefectsRejectedData data={props.buildsDefectsData} />
            if (tileName === "NCT")
                return <ActivitiesNewTestCasesAddedChart data={props.testExecCoverageData} />
            if (tileName === "AEV") {
                return <VarianceTable data={props.testExecCoverageData} />
            }
        } else {
            if (tileName === "TET")
                return <ExecutionTimeBuildsChart data={props.testExecCoverageData} />
            if (tileName === "TECA")
                return <TestExecCoverage data={props.testExecCoverageData} />
            if (tileName === "MPRA" || tileName === "APRA")
                return <TestCaseMetricChart data={props.testExecCoverageData} />
            if (tileName === "TDR")
                return <BuildsDefectsChart data={props.buildsDefectsData} />
            if (tileName === "DAR")
                return <DefectTrendBuildChart data={props.buildsDefectsData} />
            if (tileName === "DRD")
                return <DefectRejectedDataChart data={props.buildsDefectsData} />
            if (tileName === "NCT")
                return <NewTestCasesAddedChart data={props.testExecCoverageData} />
            if (tileName === "AEV") {
                if (props.currentProject === "ALD")
                    return <MultipleVarianceTables varianceParms={props.varianceParms} />
                return <VarianceTable data={props.activitiesData} />
            }
        }

    }
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="stretch"
                spacing={2}
                sx={{ mb: 2 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("TET", "Total Execution Time")}>
                            <span className="tile-heading">{tilesData.sum_duration ? Math.round(tilesData.sum_duration) + " Hrs" : "0 Hrs"}</span>
                            <span className="tile-caption">Total Execution Time</span >
                            <div style={{ width: "100%", marginTop: -20 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography className='tile-label-major'>Auto-{tilesData.automation_duration ? Math.round(tilesData.automation_duration) : 0}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography className='tile-label-minor'>Man-{tilesData.manual_duration ? Math.round(tilesData.manual_duration) : 0}</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("TECA", "Test Execution Coverage Average")}>
                            <span className="tile-heading">{tilesData.total_plan_tcs > 0 ? convertToTwoDecimalPlaces((tilesData.total_exec_tcs / tilesData.total_plan_tcs) * 100) : 0}%</span>
                            {window.location.pathname === "/build-portal" ?
                                <span className="tile-label">{tilesData.activity_count ? tilesData.activity_count : 0}-Activities</span> :
                                <span className="tile-label">{tilesData.build_count ? tilesData.build_count : 0}-Builds</span>
                            }
                            <span className="tile-caption">Test Execution Coverage Average</span >
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("NCT", "Newly created Test cases")}>
                            <span className="tile-heading">{tilesData.total_tcs ? tilesData.total_tcs : 0}</span>
                            <span className="tile-caption">Newly created Test cases</span >
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("MPRA", "Manual Pass Rate Average")}>
                            <span className="tile-heading">{convertToTwoDecimalPlaces(tilesData.manual_pass_tcs / tilesData.manual_total_tcs) * 100}%</span>
                            <span className="tile-caption">Manual Pass Rate Average</span >
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("APRA", "Automation Pass Rate Average")}>
                            <span className="tile-heading">{tilesData.automation_total_tcs ? convertToTwoDecimalPlaces((tilesData.automation_pass_tcs / tilesData.automation_total_tcs)) * 100 : 0}%</span>
                            <span className="tile-caption">Automation Pass Rate Average</span >
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("TDR", "Total Defect Raised")}>
                            <span className="tile-heading">{tilesData.total_defects ? tilesData.total_defects : 0}</span>
                            <Stack
                                direction="column"
                                spacing={1}
                                className="tile-defect-raised-p"
                            >
                                <span className='p-tile-label'>P0-{tilesData?.p0_defects}</span>
                                <span className='p-tile-label'>P1-{tilesData?.p1_defects}</span>
                                <span className='p-tile-label'>P2-{tilesData?.p2_defects}</span>
                                <span className='p-tile-label'>P3-{tilesData?.p3_defects}</span>
                            </Stack>
                            <span className="tile-caption">Total Defect Raised</span >
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("DAR", "Defect Acceptance Ratio")}>
                            <span className="tile-heading">{tilesData.total_defects ? (tilesData.total_defects - tilesData.total_rejected_defects) + "/" + tilesData.total_defects : "0/0"}</span>
                            <span className="tile-caption">Defect Acceptance Ratio</span >
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        <Button className="tile"
                            onClick={(e) => handleTileClick("DRD", "Defect Rejected Data")}>
                            <span style={{ marginTop: -10 }} className="defect-reject-tile-heading">Defect Rejected Data</span>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography className='tile-label-blocker'>Blocker-{tilesData.blocker_rejected_defects ? tilesData.blocker_rejected_defects : 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className='tile-label-critical'>Critical-{tilesData.critical_rejected_defects ? tilesData.critical_rejected_defects : 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className='tile-label-major'>Major-{tilesData.major_rejected_defects ? tilesData.major_rejected_defects : 0}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className='tile-label-minor'>Minor-{tilesData.minor_rejected_defects ? tilesData.minor_rejected_defects : 0}</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    <Grid item xs={2.4}>
                        {tilesData.total_variance ?
                            <Button className="tile"
                                onClick={(e) => handleTileClick("AEV", "Effort Variance Table")}>
                                {window.location.pathname === "/build-portal" ?
                                    <span className="tile-heading">{tilesData.activity_count ? convertToTwoDecimalPlaces(tilesData.total_variance / tilesData.activity_count) : 0}%</span> :
                                    <span className="tile-heading">{tilesData.build_count ? convertToTwoDecimalPlaces(tilesData.total_variance / tilesData.build_count) : 0}%</span>
                                }
                                <span className="tile-caption">Average Effort Variance</span >
                            </Button> :
                            <div className="tile">
                                {window.location.pathname === "/build-portal" ?
                                    <span className="tile-heading">{tilesData.activity_count ? convertToTwoDecimalPlaces(tilesData.total_variance / tilesData.activity_count) : 0}%</span> :
                                    <span className="tile-heading">{tilesData.build_count ? convertToTwoDecimalPlaces(tilesData.total_variance / tilesData.build_count) : 0}%</span>
                                }
                                <span className="tile-caption">Average Effort Variance</span >
                            </div>
                        }
                    </Grid>
                    {window.location.pathname === "/build-portal" ?
                        <Grid item xs={2.4}>
                            <div className="tile">
                                <span className="tile-heading">{tilesData.activity_count ? tilesData.activity_count : 0}</span>
                                <span className="tile-caption">Total no.of Activities</span >
                            </div>
                        </Grid> :
                        <Grid item xs={2.4}>
                            {props.currentProject !== "ALD" ?
                                <Button className="tile"
                                    onClick={handleBuildClick}>
                                    <span className="tile-heading">{tilesData.build_count ? tilesData.build_count : 0}</span>
                                    <span className="tile-caption">Total no.of builds</span >
                                </Button> :
                                <div className="tile">
                                    <span className="tile-heading">{tilesData.build_count ? tilesData.build_count : 0}</span>
                                    <span className="tile-caption">Total no.of builds</span >
                                </div>
                            }
                        </Grid>
                    }
                </Grid>
            </Stack>
            <Dialog
                open={openTileDialog}
                onClose={() => setOpenTileDialog(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    <div>
                        <Tooltip title="Close">
                            <IconButton
                                style={{
                                    float: "right",
                                    cursor: "pointer",
                                    marginTop: "-5px",
                                }}
                                onClick={() => setOpenTileDialog(false)}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <p className="sub-heading">
                            {graphTitle}
                        </p>
                    </div>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    {renderGraph()}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Tiles;