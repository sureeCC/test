import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesDefectStatusChart = (props) => {
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
                label: 'Blocker',
                backgroundColor: 'rgba(255, 128, 66, 1)',
                data: data?.activities?.map((d) => d.total_blocker_defects),
                // data: [0, 2, 3, 6, 5],
                // borderColor: 'white',
                // borderWidth: 2,
            },
            {
                type: 'bar',
                label: 'Critical',
                backgroundColor: 'rgba(253, 200, 48, 1)',
                data: data?.activities?.map((d) => d.total_critical_defects),
            },
            {
                type: 'bar',
                label: 'Major',
                backgroundColor: 'rgba(37, 140, 244, 1)',
                data: data?.activities?.map((d) => d.total_major_defects),
            },
            {
                type: 'bar',
                label: 'Minor',
                backgroundColor: 'rgba(151, 71, 255, 1)',
                data: data?.activities?.map((d) => d.total_minor_defects),
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Defect Status" />
            <Chart ref={chartRef} type='bar' options={chartOptions(null, "No. of Defects", false)} data={chartData} />
        </>
    );
};

export default ActivitiesDefectStatusChart;
