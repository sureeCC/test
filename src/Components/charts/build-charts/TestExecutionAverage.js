import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from '../ChartService';
import GraphTopPanel from "../TopPanel";

const ActivitiesTestExecutionAverageChart = (props) => {
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
                label: 'Manual Testcases Executed',
                backgroundColor: 'rgba(0, 131, 176, 1)',
                data: data?.activities?.map((d) => d.manual_executed_testcases),
            },
            {
                type: 'bar',
                label: 'Automation Testcases Executed',
                backgroundColor: 'rgba(252, 92, 125, 1)',
                data: data?.activities?.map((d) => d.automation_executed_testcases),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="TC Execution Average" />
            <Chart ref={chartRef} type='bar' options={chartOptions(null, "Number of Testcases", false)} data={chartData} />
        </>
    );
};
export default ActivitiesTestExecutionAverageChart;
