
import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from "./TopPanel";

const DefectTrendActivities = (props) => {
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
                label: 'Defect Raised',
                backgroundColor: 'rgba(67, 190, 165, 1)',
                data: data?.activities ? data?.activities?.map((d) => d.total_defects_raised) : data?.builds?.map((d) => d.total_defects_raised),
            },
            {
                type: 'bar',
                label: 'Defect Accepted',
                backgroundColor: 'rgba(57, 106, 252, 1)',
                data: data?.activities ? data?.activities?.map((d) => d.total_defects_accepted) : data?.builds?.map((d) => d.total_defects_accepted),
            },
            {
                type: 'bar',
                label: 'Defect Rejected',
                backgroundColor: 'rgba(255, 94, 98, 1)',
                data: data?.activities ? data?.activities?.map((d) => d.total_defects_rejected) : data?.builds?.map((d) => d.total_defects_rejected),
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title={data?.activities ? "Defect Trend - Activities" : "Defect Trend - Builds"} />
            <Chart type='bar' ref={chartRef} height={70} options={chartOptions(data.activities ? "Activity" : "Builds", "No of Defects", false, true)} data={chartData} />
        </>
    );
};

export default DefectTrendActivities;
