import MoveUpIcon from '@mui/icons-material/MoveUp';
import {
    IconButton,
    Menu,
    MenuItem, Tooltip
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GraphDropdown = (props) => {
    const navigate = useNavigate()
    const { data } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleBuildChange = (event) => {
        const build = {
            _id: event.id,
            build_number: event.build_number,
        }
        if (window.location.pathname === "/dashboard")
            navigate("/build-portal", { state: { build: build, project: data.project, currentSprint: event.sprint, origin: "dashboard" } })
        else navigate("/build-portal", { state: { build: build, project: data.project, currentSprint: event.sprint, loc: "drawer" } })
    }
    return (

        // <TextField sx={{ width: 200 }}
        //     className='float-right'
        //     select
        //     label="Build"
        //     // helperText='Show Records previous days'
        //     defaultValue="all"
        //     size="small"
        //     onChange={(e) => handleBuildChange(navigate, data, e)}
        // >
        //     <MenuItem value="all">All Builds</MenuItem>
        //     {
        //         data?.builds?.map((d, i) => {
        //             return <MenuItem value={d} key={i}>{d.build_number}</MenuItem>
        //         })}
        // </TextField>
        <>
            <Tooltip title="Individual Builds">
                <IconButton style={{ float: "right" }}
                    variant="contained"
                    onClick={handleProfileMenuOpen}
                >
                    <MoveUpIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                {
                    data?.builds?.map((d, i) => {
                        return <MenuItem value={d} onClick={() => handleBuildChange(d)} key={i}>{d.build_number}</MenuItem>
                    })
                }

            </Menu>
        </>
    );
};

export default GraphDropdown;
