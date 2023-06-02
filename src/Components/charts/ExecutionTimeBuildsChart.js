
import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const ExecutionTimeBuildsChart = (props) => {
    const data = props.data
    const chartRef = useRef(null)

    const labels = () => {
        var arr = [];
        data?.builds?.map((d, i) => {
            return arr.push(d.build_number);
        });
        data?.projects?.map((d, i) => {
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
                data: data?.builds ? data?.builds?.map((d) => d.automation_execution_time) : data?.projects?.map((d) => d.automation_execution_time),
                borderColor: 'rgba(37, 140, 244, 1)',
                backgroundColor: 'rgba(37, 140, 244, 1)',
                lineTension: 0.4
            },
            {
                id: "2",
                label: 'Manual Time',
                data: data?.builds ? data?.builds?.map((d) => d.manual_execution_time) : data?.projects?.map((d) => d.manual_execution_time),
                borderColor: 'rgba(67, 190, 165, 1)',
                backgroundColor: 'rgba(67, 190, 165, 1)',
                lineTension: 0.4,
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title={data.builds ? "Execution Time - Builds" : "Execution Time"} showDropdown={data.builds} />
            <Line ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "Time (in hrs)")} data={chartData} />
        </>
    );
};

export default ExecutionTimeBuildsChart;
