import { Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { convertToTwoDecimalPlaces } from "../../Utils/AppExtensions";
import { showProgressBar } from "../../Utils/ProgressBar";
import { varianceChartEndpoint } from "../charts/ChartService";


const MultipleVarianceTables = (props) => {
    const [data, setData] = useState()

    const getData = useCallback(
        async (_projectIds) => {
            try {
                const response = await axios.get(varianceChartEndpoint(), {
                    params: {
                      projectIds: _projectIds
                    }
                  });
                console.log("Variances/data", response.data.data);
                setData(response.data.data);
            } catch (e) {
                console.error(e);
                toast.error("Loading failed! try again later")
            }
        }, []
    )

    const getProjectName = (projectId) => {
        let projectName = ""
        // eslint-disable-next-line array-callback-return
        data.projects.map(_item => {
            if (_item.id === projectId)
                projectName = _item.display_name
        })
        return projectName
    }

    const getBuildName = (build, buildId) => {
        let buildName = ""
        // eslint-disable-next-line array-callback-return
        build.map(_item => {
            if (_item._id === buildId)
                buildName = _item.build_number
        })
        return buildName
    }

    const getVarianceSum = (total, num) => {
        if (num.variance) return ((total) + (num.variance))
        return total
    }

    useEffect(() => {
        getData(props.varianceParms)
    }, [getData, props.varianceParms]);
    if (!data)
        return showProgressBar(true)
    else
        return (
            // eslint-disable-next-line array-callback-return
            data?.activities?.map((item, index) => {
                if(item.activity?.reduce(getVarianceSum, 0)!==0)
                return (
                    <React.Fragment key={index}>
                        <Typography sx={{ mb: 3, mt: 3 }} variant="h4">Project: {getProjectName(item._id)}</Typography>
                        <TableContainer component={Paper} sx={{ p: 2 }}>
                            <Table
                                sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Activity Name</TableCell>
                                        <TableCell>Estimated Time</TableCell>
                                        <TableCell>Actual Time</TableCell>
                                        <TableCell>Build</TableCell>
                                        <TableCell>Variance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {item.activity?.map((nestedItem, i) => {
                                        return (
                                            nestedItem?.variance &&
                                                nestedItem.variance !== 0 ?
                                                <TableRow key={i}>
                                                    <TableCell>{nestedItem.display_name}</TableCell>
                                                    <TableCell>{nestedItem.estimated_time ? 
                  Math.floor(nestedItem.estimated_time / 60) + "h : " + nestedItem.estimated_time % 60 + "m" : "-"}</TableCell>
                                                    <TableCell>{nestedItem.actual_time ? 
                  Math.floor(nestedItem.actual_time / 60) + "h : " + Math.round(nestedItem.actual_time % 60) + "m" : "-"}</TableCell>
                                                    <TableCell>{getBuildName(nestedItem.build, nestedItem.build_id)}</TableCell>
                                                    <TableCell>{convertToTwoDecimalPlaces(nestedItem?.variance)}</TableCell>
                                                </TableRow> : null
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Divider />
                    </React.Fragment>
                )
            })
        );
};

export default MultipleVarianceTables;
