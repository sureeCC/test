import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesDefectFixRateChart = (props) => {
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
                label: 'Defect Re-tested',
                backgroundColor: 'rgba(255, 180, 33, 1)',
                data: data?.activities?.map((d) => d.total_defects_retested),
            },
            {
                type: 'bar',
                label: 'Defect Fixed',
                backgroundColor: 'rgba(216, 38, 101, 1)',
                data: data?.activities?.map((d) => d.total_defects_fixed),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Defect Fixed Rate" />
            <Chart ref={chartRef} type='bar' options={chartOptions(null, "No. of Defects", false)} data={chartData} />
        </>
    );
};

export default ActivitiesDefectFixRateChart;
