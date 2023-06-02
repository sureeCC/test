
import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesTestCaseMetricChart = (props) => {
    const data = props.data
    const chartRef = useRef(null)

    const labels = () => {
        var arr = [];
        data?.activities?.map((d, i) => {
            return arr.push(d.display_name);
        });
        return arr;
    };

    const chartData = {
        labels: labels(),
        datasets: [
            {
                type: 'bar',
                label: 'Automation Passed Testcases',
                backgroundColor: 'rgba(106, 180, 190, 1)',
                data: data?.activities?.map((d) => d.automation_passed_testcases),
                stack: 1
            },
            {
                type: 'bar',
                label: 'Automation Failed Testcases',
                backgroundColor: 'rgba(255, 144, 131, 1)',
                data: data?.activities?.map((d) => d.automation_failed_testcases),
                stack: 1
            },
            {
                type: 'bar',
                label: 'Manual Passed Testcases',
                backgroundColor: 'rgba(106, 130, 251, 1)',
                data: data?.activities?.map((d) => d.manual_passed_testcases),
            },
            {
                type: 'bar',
                label: 'Manual Failed Testcases',
                backgroundColor: 'rgba(255, 94, 98, 1)',
                data: data?.activities?.map((d) => d.manual_failed_testcases),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Testcase Metric" />
            <Chart ref={chartRef} type='bar' options={chartOptions(null, "Number of Testcases", true)} data={chartData} />
        </>
    );
};
export default ActivitiesTestCaseMetricChart;
