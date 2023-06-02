import axios from "axios";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import BuildGraphs from "./charts/build-charts/BuildGraphs";
import { buildsDefectsChartEndpoint, testExecCoverageChartEndpoint, tilesEndpoint } from "./charts/ChartService";
import Tiles from "./charts/Tiles";
import { Button, Grid } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { convertToTwoDecimalPlaces, shortFullDateFormat } from "../Utils/AppExtensions";

const BuildLevelDashboard = (props) => {

    const build = props.build ? props.build : []
    const [tilesData, setTilesData] = useState([]);
    const [buildsDefectsData, setBuildsDefectsData] = useState([]);
    const [testExecCoverageData, setTestExecCoverageData] = useState([]);

    const isBetween = require('dayjs/plugin/isBetween')
    dayjs.extend(isBetween)

    const getTilesData = useCallback(
        async (project, sprint, build) => {
            var params
            sprint ? params = {
                buildId: build._id,
                //startDate: sprint.start_date,
                //endDate: sprint.end_date
            } : params = {
                buildId: build._id,
                //startDate: new Date(project.created_at).toISOString(),
                //endDate: dayjs().endOf('day').toISOString()
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
        async (project, build) => {
            try {
                const response = await axios.get(buildsDefectsChartEndpoint(project.id) + "/" + build._id);
                console.log("BuildLevel BuildDefects/Chart", response.data.data);
                setBuildsDefectsData(response.data.data);
            } catch (e) {
                console.error(e);
            }
        }, []
    )

    const getTestExecCoverageData = useCallback(
        async (project, build) => {
            try {
                const response = await axios.get(testExecCoverageChartEndpoint(project.id) + "/" + build._id);
                console.log("BuildLevel TestExecData/Chart", response.data.data);
                setTestExecCoverageData(response.data.data);
            } catch (e) {
                console.error(e);
            }
        }, []
    )

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
            pdf.text(2, 10, "Build : " + props.build.build_number);

            pdf.setFontSize(12);
            //pdf.text(80, 10, );
            pdf.text("Downloading Date: " + new Date().toLocaleString("en-IN", shortFullDateFormat), 200, 10, null, null, "right");

            pdf.line(2, 12, 200, 12);
            pdf.line(2, 13, 200, 13);

            pdf.setFontSize(15);

            const buildsTitle = "Build Details";
            const buildTableHeaders = [["BUILD NAME", "NO OF ACTIVITIES", "NO OF RUNS", "NO OF MANUAL LAUNCHES", "NO OF AUTOMATIC LAUNCHES", "CLOSURE REPORT", "SUMMARY"]];

            const data = [[
                build.build_number,
                build.activities?.length,
                build.runs?.length,
                build.mlaunches?.length,
                build.alaunches?.length,
                build.report?.content ? build.report.content : "-",
                build.summary ? build.summary : "-",
            ]];
            const marginLeft = 15;

            let buildsContent = {
                startY: 22,
                head: buildTableHeaders,
                body: data
            };

            pdf.text(buildsTitle, marginLeft, 20);
            pdf.autoTable(buildsContent);


            //Test Execution Coverage Details table goes from here......!
            const activityTableTitle = "Test Execution Coverage Details of Build " + build?.build_number;
            const activityTableHeaders = [["S No", "Activity Name", "Estimated Time", "Actual Time", "Variance", "New TC's Added", "Man Passed TC's", "Man Failed TC's"]];

            const activityData = testExecCoverageData?.activities?.map((item, i) => [
                i + 1,
                item.display_name,
                item.variance_data.estimated_time ? Math.floor(item.variance_data.estimated_time / 60) + "h : " + item.variance_data.estimated_time % 60 + "m" : '-',
                item.variance_data.actual_time ? Math.floor(item.variance_data.actual_time / 60) + "h : " + item.variance_data.actual_time % 60 + "m" : "-",
                convertToTwoDecimalPlaces(item?.variance_data?.variance),
                item?.new_testcases_added,
                item?.manual_passed_testcases,
                item?.manual_failed_testcases,
            ])

            let activitiesContent = {
                startY: 22,
                //startY: pdf.lastAutoTable.finalY + 22,
                head: activityTableHeaders,
                body: activityData,
            };

            pdf.addPage();
            pdf.text(activityTableTitle, marginLeft, 20);
            pdf.autoTable(activitiesContent);

            //Defect Details table goes from here......!
            const defectTableTitle = "Defect Details of Build " + build?.build_number;
            const defectTableHeaders = [["S No", "Activity Name", "Defects Raised", "Defects Fixed", "Defects Accepted", "Defects Rejected", "Defects Re-tested", "MTTD"]];

            const defectData = buildsDefectsData?.activities?.map((item, i) => [
                i + 1,
                item.display_name,
                item?.total_defects_raised,
                item?.total_defects_fixed,
                item?.total_defects_accepted,
                item?.total_defects_rejected,
                item?.total_defects_retested,
                item.MTTD ? convertToTwoDecimalPlaces(item?.MTTD) : "-",
            ])

            let defectContent = {
                startY: 22,
                head: defectTableHeaders,
                body: defectData
            };

            pdf.addPage();
            pdf.text(defectTableTitle, marginLeft, 20);
            pdf.autoTable(defectContent);


            //dashboard image
            pdf.addPage();
            pdf.addImage(
                img,
                "png",
                2,
                2,
                width - 5,
                height - 5
            );

            pdf.save("Build");
            but.style.display = "block";
            btnGeneratingPdf.style.display = "none";
        });
    }

    useEffect(() => {
        const currentBuild = props.build ? props.build : {}
        const currentProject = props.project ? props.project : {}
        const currentSprint = props.currentSprint ? props.currentSprint : {}
        getTilesData(currentProject, currentSprint, currentBuild);
        getBuildsDefectsData(currentProject, currentBuild)
        getTestExecCoverageData(currentProject, currentBuild)
    }, [getBuildsDefectsData, getTestExecCoverageData, getTilesData, props.build, props.currentSprint, props.project]);

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
                <Tiles tilesData={tilesData} testExecCoverageData={testExecCoverageData} buildsDefectsData={buildsDefectsData} />
                <BuildGraphs buildsDefectsData={buildsDefectsData} testExecCoverageData={testExecCoverageData} />
            </div>
        </div >
    );
}

export default BuildLevelDashboard;