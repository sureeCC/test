
import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const NewTestCasesAddedChart = (props) => {
    const data = props.data
    const chartRef = useRef(null);

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
                label: 'New Testcases',
                backgroundColor: 'rgba(37, 140, 244, 1)',
                data: data.builds ? data.builds.map((d) => d.new_testcases_added) : data.projects?.map((d) => d.new_testcases_added),
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Newly Created Testcases" showDropdown={data.builds} />
            <Chart ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "No of Testcases")} data={chartData} />
        </>
    );
};

export default NewTestCasesAddedChart;
