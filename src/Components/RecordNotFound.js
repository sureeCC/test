import { Button, Stack, Typography } from "@mui/material";

const RecordNotFound = (props) => {
  const { onClearFilters } = props;
  return (
    <Stack className="center-screen" direction="column" spacing={2}>
      <img src="../no_records.svg" alt="record not found" />
      <p className="heading">No Data Available</p>
      {/* <Typography variant="body1">
        Try adjusting your search or filter to found what you are looking for.
      </Typography> */}
      {/* <p onClick={() => onClearFilters()} className="btn-clear-filter">
        Clear Filters
      </p> */}
    </Stack>
  );
};

export default RecordNotFound;
