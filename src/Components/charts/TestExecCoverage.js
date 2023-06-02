import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const TestExecCoverage = (props) => {
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
                type: 'bar',
                label: 'Executed Coverage',
                backgroundColor: 'rgba(67, 190, 165, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.execution_coverage * 100) : data?.projects?.map((d) => d.execution_coverage * 100),
            },
            {
                type: 'bar',
                label: 'Block Coverage',
                backgroundColor: 'rgba(255, 144, 131, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.blocked_execution_coverage * 100) : data?.projects?.map((d) => d.blocked_execution_coverage * 100),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Test Execution Coverage" showDropdown={data.builds} />
            <Chart ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "Percentage(%)")} data={chartData} />
        </>
    );
};
export default TestExecCoverage;
