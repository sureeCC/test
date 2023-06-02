import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivityExecutionTimeActivityChart = (props) => {
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
                id: "1",
                label: 'Automation Time',
                data: data?.activities?.map((d) => d.automation_execution_time),
                borderColor: 'rgba(37, 140, 244, 1)',
                backgroundColor: 'rgba(37, 140, 244, 1)',
                lineTension: 0.4
            },
            {
                id: "2",
                label: 'Manual Time',
                data: data?.activities?.map((d) => d.manual_execution_time),
                borderColor: 'rgba(67, 190, 165, 1)',
                backgroundColor: 'rgba(67, 190, 165, 1)',
                lineTension: 0.4,
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Execution Time - Activity" />
            <Line ref={chartRef} type='bar' options={chartOptions(null, "Time (in hrs)", false)} data={chartData} />
        </>
    );
};

export default ActivityExecutionTimeActivityChart;
