import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesNewTestCasesAddedChart = (props) => {
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
                label: 'New Testcases',
                backgroundColor: 'rgba(37, 140, 244, 1)',
                data: data?.activities?.map((d) => d.new_testcases_added),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="New Created Testcases" />
            <Chart ref={chartRef} type='bar' options={chartOptions(null, "No. of Testcases", false)} data={chartData} />
        </>
    );
};

export default ActivitiesNewTestCasesAddedChart;
