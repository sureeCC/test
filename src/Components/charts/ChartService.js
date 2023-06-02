import { baseUrl } from "../../Config/index";
import {
    BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip
} from 'chart.js';
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    zoomPlugin
);

export const buildsDefectsChartEndpoint = (projectId) => {
    if (projectId)
        return baseUrl + "analytics/" + projectId + "/defects";
    return baseUrl + "analytics/defects";
};

export const apiDefectsChartEndpoint = (projectId) => {
    return baseUrl + "analytics/" + projectId + "/api-defects";
};

export const buildsLaunchesChartEndpoint = (projectId) => {
    return baseUrl + "analytics/" + projectId + "/builds-launches";
};

export const testExecCoverageChartEndpoint = (projectId) => {
    if (projectId)
        return baseUrl + "analytics/" + projectId + "/test-exec-coverage";
    return baseUrl + "analytics/test-exec-coverage";
};

export const tilesEndpoint = (projectId) => {
    if (projectId)
        return baseUrl + "analytics/" + projectId + "/tiles";
    return baseUrl + "analytics/tiles";
};

export const activitiesChartEndpoint = (projectId) => {
    if (projectId)
        return baseUrl + "analytics/" + projectId + "/activities";
    return baseUrl + "analytics/builds";
};

export const varianceChartEndpoint = (projectId) => {
    if (projectId)
        return baseUrl + "analytics/" + projectId + "/activities";
    return baseUrl + "analytics/variance";
};

export const scrollMessage = "*   Scroll or move horizontally to view more."

export const chartOptions = (xAxisTitle, yAxisTitle, stacked, maxWidth) => {
    const s = stacked ? true : false
    return ({
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
                text: "Defect Status ",
                font: {
                    // size: 18
                }
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x",
                    //threshold: 5
                },
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: "x"
                }
            }
        },
        scales: {
            x: {
                stacked: s,
                title: {
                    display: true,
                    text: xAxisTitle ? xAxisTitle : "Activity",
                },
                grid: {
                    display: false,
                },
                type: "category",
                min: 0,
                //max: maxWidth ? 9 : 4,
            },
            y: {
                stacked: s,
                title: {
                    display: true,
                    text: yAxisTitle,
                },
                type: "linear"
            },
        },
    })
}