import React, { useRef } from "react";
import { Chart } from 'react-chartjs-2';
import { chartOptions } from './ChartService';
import GraphTopPanel from './TopPanel';

const BuildsDefectsChart = (props) => {
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
                label: 'Blocker',
                backgroundColor: 'rgba(255, 128, 66, 1)',
                data: data.builds ? data.builds.map((d) => d.total_blocker_defects) : data.projects?.map((d) => d.total_blocker_defects),
            },
            {
                type: 'bar',
                label: 'Critical',
                backgroundColor: 'rgba(253, 200, 48, 1)',
                data: data.builds ? data.builds.map((d) => d.total_critical_defects) : data.projects?.map((d) => d.total_critical_defects),
            },
            {
                type: 'bar',
                label: 'Major',
                backgroundColor: 'rgba(37, 140, 244, 1)',
                data: data.builds ? data.builds.map((d) => d.total_major_defects) : data.projects?.map((d) => d.total_major_defects),
            },
            {
                type: 'bar',
                label: 'Minor',
                backgroundColor: 'rgba(151, 71, 255, 1)',
                data: data.builds ? data.builds.map((d) => d.total_minor_defects) : data.projects?.map((d) => d.total_minor_defects),
            },
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title="Defect Status" showDropdown={data.builds} />
            <Chart ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "No of Defects")} data={chartData} />
        </>
    );
};

export default BuildsDefectsChart;
