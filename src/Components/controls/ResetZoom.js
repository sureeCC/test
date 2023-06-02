import CachedIcon from '@mui/icons-material/Cached';
import { IconButton, Tooltip } from "@mui/material";

const GraphDropdown = (props) => {
    const { chartRef } = props;
    const handleResetZoom = () => {
        if (chartRef && chartRef.current) {
            chartRef.current.resetZoom();
        }
    };
    return (
        <Tooltip title="Reset Zoom">
            <IconButton
                variant="contained"
                onClick={handleResetZoom}
            >
                <CachedIcon />
            </IconButton>
        </Tooltip>
    );
};

export default GraphDropdown;
