import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Link,
} from "@mui/material";
import * as React from "react";
import RecordNotFound from "./RecordNotFound";

const TabLinks = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <TableContainer component={Paper} sx={{ p: 2 }}>
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              size="small"
              placeholder="Search"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchSharpIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow className="table-head-background">
            <TableCell>S. No</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.links
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((currentRow, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{index + 1}</TableCell>
                <TableCell component="th" scope="row">
                  {currentRow.title}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link target="_blank" rel="noopener" href={currentRow.url}>
                    {currentRow.url}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {props.links.length ? (
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          component="div"
          count={props.links.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : (
        <RecordNotFound />
      )}
    </TableContainer>
  );
};

export default TabLinks;
