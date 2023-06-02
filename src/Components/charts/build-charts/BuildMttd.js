import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from '../TopPanel'

const ActivitiesBuildsMttdChart = (props) => {
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
                label: 'Hours/Defects',
                data: data?.activities?.map((d) => d.MTTD),
                borderColor: 'rgba(67, 190, 165, 1)',
                backgroundColor: 'rgba(67, 190, 165, 1)',
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Build MTTD" />
            <Line ref={chartRef} type='bar' options={chartOptions(null, "Hours/Defect", false)} data={chartData} />
        </>
    );
};

export default ActivitiesBuildsMttdChart;
