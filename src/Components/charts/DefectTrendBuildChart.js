import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const DefectTrendBuildChart = (props) => {
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
                label: 'Defect Raised',
                data: data?.builds ? data?.builds?.map((d) => d.total_defects_raised) : data?.projects?.map((d) => d.total_defects_raised),
                borderColor: 'rgba(124, 198, 214, 1)',
                backgroundColor: 'rgba(124, 198, 214, 1)',
                lineTension: 0.4
            },
            {
                id: "2",
                label: 'Defect Accepted',
                data: data?.builds ? data?.builds?.map((d) => d.total_defects_accepted) : data?.projects?.map((d) => d.total_defects_accepted),
                borderColor: 'rgba(57, 106, 252, 1)',
                backgroundColor: 'rgba(57, 106, 252, 1)',
                lineTension: 0.4,
            },
            {
                id: "3",
                label: 'Defect Rejected',
                data: data?.builds ? data?.builds?.map((d) => d.total_defects_rejected) : data?.projects?.map((d) => d.total_defects_rejected),
                borderColor: 'rgba(255, 94, 98, 1)',
                backgroundColor: 'rgba(255, 94, 98, 1)',
                lineTension: 0.4,
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title={data.builds ? "Defect Trend - Builds" : "Defect Trend"} showDropdown={data.builds} />
            <Line ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "No. of Defects")} data={chartData} />
        </>
    );
};

export default DefectTrendBuildChart;
