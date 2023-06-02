import KeyboardBackspaceSharpIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import { Button, Grid, InputAdornment, MenuItem, Paper, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { apiMatrixEndPoint } from '../../Config/Endpoints';
import Input from "../controls/Input";
import { Form, useForm } from '../useForm';


const EditApiMatrix = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentProject = location?.state?.project
    const currentApiMatrix = location?.state?.apiMatrix

    const initialFValues = {
        moduleName: currentApiMatrix.module,
        priority: currentApiMatrix.priority,
        totalApis: currentApiMatrix.total_apis,
        totalTcs: currentApiMatrix.total_TCs,
        totalExecuted: currentApiMatrix.total_TCs_exec,
        totalPassed: currentApiMatrix.total_TCs_pass,
        totalFailed: currentApiMatrix.total_TCs_fail,
        blockedTcs: currentApiMatrix.blocked_tests,
        noOfDefects: currentApiMatrix.total_defects,
        openDefects: currentApiMatrix.open_defects,
        totalFeasibleTcs: currentApiMatrix.total_feasible_TCs,
        totalTcsAutomated: currentApiMatrix.total_TCs_automated,
        totalExecutable: currentApiMatrix.total_TCs_exec
        ,
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("moduleName" in fieldValues)
            temp.moduleName = fieldValues.moduleName
                ? ""
                : "Module Name field is required.";
        // if ("priority" in fieldValues)
        //     temp.priority = fieldValues.priority ? "" : "Priority field is required.";
        if ("totalApis" in fieldValues)
            temp.totalApis = fieldValues.totalApis
                ? (fieldValues.totalApis < 0 || fieldValues.totalApis % 1 !== 0) ? "Not a valid Number" : "" : "Total Api's field is required.";
        if ("totalTcs" in fieldValues)
            temp.totalTcs = fieldValues.totalTcs
                ? (fieldValues.totalTcs < 0 || fieldValues.totalTcs % 1 !== 0) ? "Not a valid Number" : "" : "Total TC's field is required."
        if ("totalExecuted" in fieldValues)
            temp.totalExecuted = fieldValues.totalExecuted
                ? (fieldValues.totalExecuted < 0 || fieldValues.totalExecuted % 1 !== 0) ? "Not a valid Number" : "" : "Total Executed field is required.";
        if ("totalPassed" in fieldValues)
            temp.totalPassed = fieldValues.totalPassed
                ? (fieldValues.totalPassed < 0 || fieldValues.totalPassed % 1 !== 0) ? "Not a valid Number" : "" : "Total Passed field is required.";
        if ("totalFailed" in fieldValues)
            temp.totalFailed = fieldValues.totalFailed
                ? (fieldValues.totalFailed < 0 || fieldValues.totalFailed % 1 !== 0) ? "Not a valid Number" : "" : "Total Failed field is required.";
        if ("blockedTcs" in fieldValues)
            temp.blockedTcs = fieldValues.blockedTcs
                ? (fieldValues.blockedTcs < 0 || fieldValues.blockedTcs % 1 !== 0) ? "Not a valid Number" : "" : "Blocked TC's field is required.";
        if ("noOfDefects" in fieldValues)
            temp.noOfDefects = fieldValues.noOfDefects
                ? (fieldValues.noOfDefects < 0 || fieldValues.noOfDefects % 1 !== 0) ? "Not a valid Number" : "" : "No Of Defects field is required.";
        if ("openDefects" in fieldValues)
            temp.openDefects = fieldValues.openDefects
                ? (fieldValues.openDefects < 0 || fieldValues.openDefects % 1 !== 0) ? "Not a valid Number" : "" : "Open Defects field is required.";
        if ("totalFeasibleTcs" in fieldValues)
            temp.totalFeasibleTcs = fieldValues.totalFeasibleTcs
                ? (fieldValues.totalFeasibleTcs < 0 || fieldValues.totalFeasibleTcs % 1 !== 0) ? "Not a valid Number" : "" : "Total Feasible TC's field is required.";
        if ("totalTcsAutomated" in fieldValues)
            temp.totalTcsAutomated = fieldValues.totalTcsAutomated
                ? (fieldValues.totalTcsAutomated < 0 || fieldValues.totalTcsAutomated % 1 !== 0) ? "Not a valid Number" : "" : "Total TC's Automated field is required.";
        if ("totalExecutable" in fieldValues)
            temp.totalExecutable = fieldValues.totalExecutable
                ? (fieldValues.totalExecutable < 0 || fieldValues.totalExecutable % 1 !== 0) ? "Not a valid Number" : "" : "Total Executable field is required.";
        setErrors({
            ...temp,
        });

        if (fieldValues === values) return Object.values(temp).every((x) => x === "");
    };

    const {
        values,
        setValues,
        errors,
        name,
        setName,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const [coverage, setCoverage] = useState({});
    const [priority, setPriority] = useState(values.priority);


    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            const payload = {
                id: currentApiMatrix._id,
                module: values.moduleName,
                priority: priority,
                total_apis: values.totalApis,
                total_TCs: values.totalTcs,
                total_TCs_exec: values.totalExecuted,
                total_TCs_pass: values.totalPassed,
                total_TCs_fail: values.totalFailed,
                blocked_tests: values.blockedTcs,
                total_defects: values.noOfDefects,
                open_defects: values.openDefects,
                total_feasible_TCs: values.totalFeasibleTcs,
                total_TCs_automated: values.totalTcsAutomated,
                total_executable: values.totalExecutable,
                MT_coverage: coverage.MT_coverage,
                blocked_execution: coverage.blocked_execution,
                AT_coverage: coverage.AT_coverage,
            }
            console.log(payload)
            axios.put(apiMatrixEndPoint, payload).then(response => {
                toast.success('API Matrix updated successfully!')
                console.log(response.data)
                navigate('/project-portal', { state: { tabIndex: location.state.tabIndex, item: currentProject } })
            })
        } else toast.info('Please fill all required fields!')
    }

    useEffect(() => {
        if (values.totalExecuted <= 0 || values.blockedTcs <= 0 || values.totalTcsAutomated <= 0 || values.totalTcs <= 0 ||
            values.totalExecuted % 1 !== 0 || values.blockedTcs % 1 !== 0 || values.totalTcsAutomated % 1 !== 0 || values.totalTcs % 1 !== 0)
            setCoverage({
                MT_coverage: 0,
                blocked_execution: 0,
                AT_coverage: 0
            });
        else
            setCoverage({
                MT_coverage: (values.totalExecuted / values.totalTcs) * 100,
                blocked_execution: (values.blockedTcs / values.totalTcs) * 100,
                AT_coverage: (values.totalTcsAutomated / values.totalTcs) * 100,
            });
    }, [values.totalExecuted, values.blockedTcs, values.totalTcsAutomated, values.totalTcs]);
    return (
        <>
            <Form noValidate onSubmit={handleSubmit}>
                <div>
                    <Stack direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={2}>
                        <div>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Button onClick={() => navigate('/project-portal', { state: { tabIndex: location.state.tabIndex, item: currentProject } })} variant='outlined'><KeyboardBackspaceSharpIcon /></Button>
                                </Grid>
                                <Grid item>
                                    <p className='heading'>Edit API Matrix</p>
                                </Grid>
                            </Grid>
                        </div>
                        <div>
                            <Button
                                onClick={() => navigate('/project-portal', { state: { tabIndex: location.state.tabIndex, item: currentProject } })}
                                variant="outlined"
                                sx={{ mr: 1 }}>cancel
                            </Button>
                            <Button
                                type="submit"
                                variant='contained'>Save</Button>
                        </div>
                    </Stack>
                </div>

                <Paper sx={{ p: 2, mt: 2 }}>
                    <p className="body1">API Matrix Details</p>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Input
                                name="moduleName"
                                label="Module Name"
                                defaultValue={values.moduleName}
                                onChange={handleInputChange}
                                error={errors.moduleName}
                                placeholder='Enter Module'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                select
                                label="Priority"
                                name="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            //error={priorityError}
                            //helperText={priorityError ? "Priority is required." : ""}
                            >
                                <MenuItem value="critical">
                                    <Grid container spacing={2}>
                                        <Grid item xs={11}>
                                            P1 - Critical
                                        </Grid>
                                        <Grid item xs={1}>
                                            <div className="priority-critical"></div>
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                                <MenuItem value="high">
                                    <Grid container spacing={2}>
                                        <Grid item xs={11}>
                                            P2 – High
                                        </Grid>
                                        <Grid item xs={1}>
                                            <div className="priority-high"></div>
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                                <MenuItem value="medium">
                                    <Grid container spacing={2}>
                                        <Grid item xs={11}>
                                            P3 – Medium
                                        </Grid>
                                        <Grid item xs={1}>
                                            <div className="priority-medium"></div>
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                                <MenuItem value="low">
                                    <Grid container spacing={2}>
                                        <Grid item xs={11}>
                                            P4 – Low
                                        </Grid>
                                        <Grid item xs={1}>
                                            <div className="priority-low"></div>
                                        </Grid>
                                    </Grid>
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                label="Total API's"
                                name="totalApis"
                                defaultValue={values.totalApis}
                                onChange={handleInputChange}
                                error={errors.totalApis}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Input
                                label="Total TC's"
                                name="totalTcs"
                                defaultValue={values.totalTcs}
                                onChange={handleInputChange}
                                error={errors.totalTcs}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 2, mt: 2 }}>
                    <p className="body1">Manual Testcase Execution Highlights</p>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Input
                                name="totalExecuted"
                                label="Total Executed"
                                defaultValue={values.totalExecuted}
                                onChange={handleInputChange}
                                error={errors.totalExecuted}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Input
                                label="Total Passed"
                                name="totalPassed"
                                defaultValue={values.totalPassed}
                                onChange={handleInputChange}
                                error={errors.totalPassed}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Input
                                label="Total Failed"
                                name="totalFailed"
                                defaultValue={values.totalFailed}
                                onChange={handleInputChange}
                                error={errors.totalFailed}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 2, mt: 2 }}>
                    <p className="body1">Automation Highlights</p>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Input
                                label="Blocked Test Cases"
                                name="blockedTcs"
                                defaultValue={values.blockedTcs}
                                onChange={handleInputChange}
                                error={errors.blockedTcs}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                label="No of Defects"
                                name="noOfDefects"
                                defaultValue={values.noOfDefects}
                                onChange={handleInputChange}
                                error={errors.noOfDefects}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                label="Open Defects"
                                name="openDefects"
                                defaultValue={values.openDefects}
                                onChange={handleInputChange}
                                error={errors.openDefects}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                label="Total Feasible TC's"
                                name="totalFeasibleTcs"
                                defaultValue={values.totalFeasibleTcs}
                                onChange={handleInputChange}
                                error={errors.totalFeasibleTcs}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                label="Total TC's Automated"
                                name="totalTcsAutomated"
                                defaultValue={values.totalTcsAutomated}
                                onChange={handleInputChange}
                                error={errors.totalTcsAutomated}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                label="Total Executable"
                                name="totalExecutable"
                                defaultValue={values.totalExecutable}
                                onChange={handleInputChange}
                                error={errors.totalExecutable}
                                type='number'
                                placeholder='0'
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 2, mt: 2 }}>
                    <p className="body1">Coverage</p>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                disabled
                                label="Manual Test Coverage"
                                name="manualTestCoverage"
                                value={coverage.MT_coverage ? (Math.round(coverage.MT_coverage * 100) / 100).toFixed(2) : 0.00}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                disabled
                                label="Automation Test Coverage"
                                name="totalPassed"
                                value={coverage.AT_coverage ? (Math.round(coverage.AT_coverage * 100) / 100).toFixed(2) : 0.00}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                required
                                fullWidth
                                disabled
                                label="Automated Blocked Execution"
                                name="totalFailed"
                                value={coverage.blocked_execution ? (Math.round(coverage.blocked_execution * 100) / 100).toFixed(2) : 0.00}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            %
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Form>
        </>
    );
}

export default EditApiMatrix;