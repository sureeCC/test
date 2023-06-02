import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from "./ChartService";
import GraphTopPanel from "./TopPanel";
const TestCaseMetricChart = (props) => {
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
                label: 'Automation Passed Testcases',
                backgroundColor: 'rgba(106, 180, 190, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.automation_passed_testcases) : data?.projects?.map((d) => d.automation_passed_testcases),
                stack: 1
            },
            {
                type: 'bar',
                label: 'Automation Failed Testcases',
                backgroundColor: 'rgba(255, 144, 131, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.automation_failed_testcases) : data?.projects?.map((d) => d.automation_failed_testcases),
                stack: 1
            },
            {
                type: 'bar',
                label: 'Manual Passed Testcases',
                backgroundColor: 'rgba(106, 130, 251, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.manual_passed_testcases) : data?.projects?.map((d) => d.manual_passed_testcases),
            },
            {
                type: 'bar',
                label: 'Manual Failed Testcases',
                backgroundColor: 'rgba(255, 94, 98, 1)',
                data: data?.builds ? data?.builds?.map((d) => d.manual_failed_testcases) : data?.projects?.map((d) => d.manual_failed_testcases),
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Testcase Metric" showDropdown={data.builds} />
            <Chart ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "Number of Testcases", true)} data={chartData} />
        </>
    );
};
export default TestCaseMetricChart;
