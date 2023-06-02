
import Snackbar from "@mui/material/Snackbar";

const Toast = ({ anchorOrigin = {
    vertical: 'top',
    horizontal: 'center',
}, open, message, autoHideDuration=2000, setToast }) => {

    const handleClose=()=>{
        setToast({open:false})
    }
    return (
        <Snackbar
            anchorOrigin={anchorOrigin}
            open={open}
            message={message}
            autoHideDuration={3000}
            onClose={handleClose}
            ContentProps={{
                sx: {
                  background: "#1a2668"
                }
              }}
        />
    );
}

export default Toast;