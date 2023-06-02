import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const TestExecAverage = (props) => {
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
                label: 'Manual Testcases Executed',
                backgroundColor: 'rgba(0, 131, 176, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.manual_executed_testcases) : data?.projects?.map((d) => d.manual_executed_testcases),
                // data: [0, 2, 3, 6, 5],
                // borderColor: 'white',
                // borderWidth: 2,
            },
            {
                type: 'bar',
                label: 'Automation Testcases Executed',
                backgroundColor: 'rgba(252, 92, 125, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.automation_executed_testcases) : data?.projects?.map((d) => d.automation_executed_testcases),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="TC Execution Average" showDropdown={data.builds} />
            <Chart ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "Number of Testcases")} data={chartData} />
        </>
    );
};
export default TestExecAverage;
