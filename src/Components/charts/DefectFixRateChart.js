import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const DefectFixRateChart = (props) => {
    const data = props.data
    const chartRef = useRef(null);

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
                label: 'Defect Re-tested',
                backgroundColor: 'rgba(255, 180, 33, 1)',
                data: data.builds ? data.builds?.map((d) => d.total_defects_retested) : data.projects?.map((d) => d.total_defects_retested),
            },
            {
                type: 'bar',
                label: 'Defect Fixed',
                backgroundColor: 'rgba(216, 38, 101, 1)',
                data: data.builds ? data.builds?.map((d) => d.total_defects_fixed) : data.projects?.map((d) => d.total_defects_fixed),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Defect Fixed Rate" showDropdown={data.builds} />
            <Chart ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "No of Defects")} data={chartData} />
        </>
    );
};

export default DefectFixRateChart;
