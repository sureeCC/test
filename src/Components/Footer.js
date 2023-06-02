import { Link, Typography } from "@mui/material";

const Footer = (props) => {
    return (
        <Typography className="footer" variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" to="#">
                IGS India {' '} {new Date().getFullYear()}{'.'}
            </Link>
            All Rights Reserved
        </Typography>
    )
}

export default Footer;