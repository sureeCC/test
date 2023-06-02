import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { activitiesChartEndpoint, buildsDefectsChartEndpoint, testExecCoverageChartEndpoint, tilesEndpoint } from "./charts/ChartService";
import Graphs from "./charts/Graphs";
import Tiles from "./charts/Tiles";

import { Button, Grid } from "@mui/material";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getAllBuildsEndPoint } from "../Config/Endpoints";
import { convertToTwoDecimalPlaces, shortFullDateFormat } from "../Utils/AppExtensions";

const ProjectAnalytics = (props) => {
    const location = useLocation()
    const sprintId = props.currentSprint?._id
    const selectedSprint = props?.currentSprint
    const userCapabilities = props.userCapabilities
    const selectedProject = props.project ? props.project : location.state.project;

    const [tilesData, setTilesData] = useState([]);
    const [buildsDefectsData, setBuildsDefectsData] = useState([]);
    const [testExecCoverageData, setTestExecCoverageData] = useState([]);
    const [activities, setActivites] = useState([]);
    const [buildsData, setBuildsData] = useState();

    const isBetween = require('dayjs/plugin/isBetween')
    dayjs.extend(isBetween)

    const getTilesData = useCallback(
        async (project, sprint) => {
            var params
            sprint ? params = {
                startDate: sprint.start_date,
                endDate: sprint.end_date
            } : params = {
                // startDate: new Date(project.created_at).toISOString(),
                // endDate: dayjs().endOf('day').toISOString()
            }

            try {
                const response = await axios.get(tilesEndpoint(project.id), {
                    params: params
                });
                console.log("TilesData", response.data.data);
                setTilesData(response.data.data);
            } catch (e) {
                console.error(e);
            }
        }, []
    )

    const getBuildsDefectsData = useCallback(
        async (project, sprint) => {
            var params
            sprint ? params = {
                startDate: sprint.start_date,
                endDate: sprint.end_date
            } : params = {
                // startDate: new Date(project.created_at).toISOString(),
                // endDate: dayjs().endOf('day').toISOString()
            }
            try {
                const response = await axios.get(buildsDefectsChartEndpoint(project.id), {
                    params: params
                });
                console.log("Builddefects/Chart", response.data.data);
                setBuildsDefectsData(response.data.data);
            } catch (e) {
                console.error(e);
            }
        }, []
    )

    const getActivitiesData = useCallback(
        async (project, sprint) => {
            var params
            sprint ? params = {
                startDate: sprint.start_date,
                endDate: sprint.end_date
            } : params = {
                // startDate: new Date(project.created_at).toISOString(),
                // endDate: dayjs().endOf('day').toISOString()
            }
            try {
                const response = await axios.get(activitiesChartEndpoint(project.id), {
                    params: params
                });
                console.log("activities/Chart", response.data.data);
                setActivites(response.data.data);
            } catch (e) {
                console.error(e);
            }
        }, []
    )

    const getTestExecCoverageData = useCallback(
        async (project, sprint) => {
            var params
            sprint ? params = {
                startDate: sprint.start_date,
                endDate: sprint.end_date
            } : params = {
                // startDate: new Date(project.created_at).toISOString(),
                // endDate: dayjs().endOf('day').toISOString()
            }
            try {
                const response = await axios.get(testExecCoverageChartEndpoint(project.id), {
                    params: params
                });
                console.log("TestExecCoverage/Chart", response.data.data);
                setTestExecCoverageData(response.data.data);
            } catch (e) {
                console.error(e);
            }
        }, []
    )

    const getBuildsData = async (project, _sprintId) => {
        try {
            const response = await axios.get(getAllBuildsEndPoint(project.id), { params: { sprintId: _sprintId } });
            setBuildsData(response.data.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        console.log(selectedSprint)
        getTilesData(selectedProject, selectedSprint);
        getBuildsDefectsData(selectedProject, selectedSprint)
        getActivitiesData(selectedProject, selectedSprint)
        getTestExecCoverageData(selectedProject, selectedSprint)
        getBuildsData(selectedProject, sprintId)
    }, [getActivitiesData, getBuildsDefectsData, getTestExecCoverageData, getTilesData, selectedProject, selectedSprint, sprintId]);





    const handleDownloadPdf = (e) => {

        const but = e.target;
        but.style.display = "none";
        let input = window.document.getElementsByClassName("div2PDF")[0];

        let btnGeneratingPdf = window.document.getElementsByName("generatingPDF")[0];
        btnGeneratingPdf.style.display = "block";

        html2canvas(input, { scale: 1.5 }).then((canvas) => {
            const img = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "A4", true);

            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();

            pdf.setFontSize(18);
            pdf.text(2, 10, "Project : " + selectedProject.display_name);

            pdf.setFontSize(12);
            //pdf.text(80, 10, );
            pdf.text("Downloading Date: " + new Date().toLocaleString("en-IN", shortFullDateFormat), 200, 10, null, null, "right");

            pdf.line(2, 12, 200, 12);
            pdf.line(2, 13, 200, 13);

            pdf.setFontSize(15);

            const buildsTitle = "Builds Data";
            const buildTableHeaders = [["S NO.","BUILD NAME", "NO OF ACTIVITIES", "NO OF RUNS", "NO OF MANUAL LAUNCHES", "NO OF AUTOMATIC LAUNCHES", "CLOSURE REPORT", "SUMMARY"]];

            const data = buildsData?.builds?.map((elt,i) => [
                i+1,
                elt.build_number,
                elt.activities?.length,
                elt.runs?.length,
                elt.mlaunches?.length,
                elt.alaunches?.length,
                elt.report?.content ? elt.report.content : "-",
                elt.summary ? elt.summary : "-",
            ]);
            const marginLeft = 15;

            let buildsContent = {
                startY: 22,
                head: buildTableHeaders,
                body: data
            };

            pdf.text(buildsTitle, marginLeft, 20);
            pdf.autoTable(buildsContent);


            //activity table goes from here......!
            const activityTableTitle = "Activities Data";
            const activityTableHeaders = [["S NO.", "ACTIVITY NAME", "ESTIMATED TIME", "ACTUAL TIME", "BUILD NAME", "VARIANCE", "DEFECTS RAISED", "DEFECTS ACCEPTED", "DEFECTS REJECTED"]];

            const activityData = activities?.activities?.map((item,i) => [
                i+1,
                item.display_name,
                item.variance_data.estimated_time ? Math.floor(item.variance_data.estimated_time / 60) + "h : " + item.variance_data.estimated_time % 60 + "m" : '-',
                item.variance_data.actual_time ? Math.floor(item.variance_data.actual_time / 60) + "h : " + item.variance_data.actual_time % 60 + "m" : "-",
                item?.build_number,
                convertToTwoDecimalPlaces(item?.variance_data?.variance),
                item?.total_defects_raised,
                item?.total_defects_accepted,
                item?.total_defects_rejected
            ])

            let activitiesContent = {
                startY: 22,
                head: activityTableHeaders,
                body: activityData
            };

            pdf.addPage();
            pdf.text(activityTableTitle, marginLeft, 20);
            pdf.autoTable(activitiesContent);

            pdf.addPage();
            pdf.addImage(
                img,
                "png",
                2,
                2,
                width - 5,
                height - 5
            );

            pdf.save(selectedProject.display_name);
            but.style.display = "block";
            btnGeneratingPdf.style.display = "none";
        });
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                </Grid>
                <Grid item xs={2}>
                    <Button fullWidth sx={{ mb: 2 }} variant="outlined" onClick={(e) => handleDownloadPdf(e)}>Export to PDF</Button>
                    <Button disabled name="generatingPDF" style={{ display: "none" }} fullWidth sx={{ mb: 2 }} variant="outlined">Generating PDF</Button>
                </Grid>
            </Grid>
            <div style={{ background: "#f5f5f5f5" }} className="div2PDF">
                {/* tiles */}
                <Tiles tilesData={tilesData} testExecCoverageData={testExecCoverageData} buildsDefectsData={buildsDefectsData} activitiesData={activities} />
                {/* graphs  */}
                <Graphs testExecCoverageData={testExecCoverageData} buildsDefectsData={buildsDefectsData} activitiesData={activities} />
            </div>
        </div >
    );
}

export default ProjectAnalytics;