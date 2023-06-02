
import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesDefectTrendActivityChart = (props) => {
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
                label: 'Defect Raised',
                data: data?.activities?.map((d) => d.total_defects_raised),
                borderColor: 'rgba(124, 198, 214, 1)',
                backgroundColor: 'rgba(124, 198, 214, 1)',
                lineTension: 0.4
            },
            {
                id: "2",
                label: 'Defect Accepted',
                data: data?.activities?.map((d) => d.total_defects_accepted),
                borderColor: 'rgba(57, 106, 252, 1)',
                backgroundColor: 'rgba(57, 106, 252, 1)',
                lineTension: 0.4,
            },
            {
                id: "3",
                label: 'Defect Rejected',
                data: data?.activities?.map((d) => d.total_defects_rejected),
                borderColor: 'rgba(255, 94, 98, 1)',
                backgroundColor: 'rgba(255, 94, 98, 1)',
                lineTension: 0.4,
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Defect Trend - Activity" />
            <Line ref={chartRef} type='bar' options={chartOptions(null, "No. of Defects", false)} data={chartData} />
        </>
    );
};

export default ActivitiesDefectTrendActivityChart;
