import React, { useRef } from "react";
import { Line } from 'react-chartjs-2';
import { chartOptions } from "./ChartService";
import GraphTopPanel from "./TopPanel";

const BuildsMttdChart = (props) => {
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
                label: 'Hours',
                data: data.builds ? data.builds?.map((d) => d.MTTD) : data?.projects?.map((d) => d.MTTD),
                borderColor: 'rgba(67, 190, 165, 1)',
                backgroundColor: 'rgba(67, 190, 165, 1)',
            }
        ]
    };

    return (
        <>
            <GraphTopPanel chartRef={chartRef} data={data} title={data.builds ? "Build MTTD" : "MTTD"} showDropdown={data.builds} />
            <Line ref={chartRef} type='bar' options={chartOptions(data.builds ? "Builds" : "Projects", "Hours/Defect")} data={chartData} />
        </>
    );
};

export default BuildsMttdChart;
