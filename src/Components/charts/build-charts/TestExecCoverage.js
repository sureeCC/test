
import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesTestExecCoverageChart = (props) => {
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
                label: 'Executed Coverage',
                backgroundColor: 'rgba(67, 190, 165, 1)',
                data: data?.activities?.map((d) => d.execution_coverage * 100),
            },
            {
                type: 'bar',
                label: 'Block Coverage',
                backgroundColor: 'rgba(255, 144, 131, 1)',
                data: data?.activities?.map((d) => d.blocked_execution_coverage * 100),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Test Execution Coverage" />
            <Chart ref={chartRef} type='bar' options={chartOptions(null, "Percentage(%)", false)} data={chartData} />
        </>
    );
};
export default ActivitiesTestExecCoverageChart;
