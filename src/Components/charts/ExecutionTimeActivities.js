import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from "./TopPanel";

const ExecutionTimeActivities = (props) => {
    const data = props.data
    const chartRef = useRef(null)

    const labels = () => {
        var arr = [];
        data?.activities?.map((d, i) => {
            return arr.push(d.display_name);
        });
        data?.builds?.map((d, i) => {
            return arr.push(d.build_number);
        });
        return arr;
    };
    const chartData = {
        labels: labels(),
        datasets: [
            {
                type: 'bar',
                label: 'Automation Time',
                backgroundColor: 'rgba(57, 106, 252, 1)',
                data: data?.activities ? data?.activities?.map((d) => d.automation_execution_time) : data?.builds?.map((d) => d.automation_execution_time),
            },
            {
                type: 'bar',
                label: 'Manual Time',
                backgroundColor: 'rgba(67, 190, 165, 1)',
                data: data?.activities ? data?.activities?.map((d) => d.manual_execution_time) : data?.builds?.map((d) => d.manual_execution_time),
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title={data.activities ? "Execution Time - Activities" : "Execution Time - Builds"} />
            <Chart type='bar'
                ref={chartRef} height={70} options={chartOptions(data.activities ? "Activity" : "Builds", "Time (in hours)", false, true)} data={chartData} />
        </>
    );
};

export default ExecutionTimeActivities;
