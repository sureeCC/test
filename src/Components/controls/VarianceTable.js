import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { convertToTwoDecimalPlaces } from "../../Utils/AppExtensions";


const VarianceTable = (props) => {

    return (
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
                    {props.data?.activities?.map((item, index) => {
                        return (
                            item.variance_data?.variance &&
                                item.variance_data.variance !== 0 ?
                                <TableRow key={index}>
                                    <TableCell>{item.display_name}</TableCell>
                                    <TableCell>{item.variance_data?.estimated_time}</TableCell>
                                    <TableCell>{convertToTwoDecimalPlaces(item.variance_data?.actual_time)}</TableCell>
                                    <TableCell>{item.build_number}</TableCell>
                                    <TableCell>{convertToTwoDecimalPlaces(item.variance_data?.variance)}</TableCell>
                                </TableRow> : null
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VarianceTable;
