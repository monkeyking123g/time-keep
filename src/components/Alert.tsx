import React, { forwardRef } from "react";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps as MuiAlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, MuiAlertProps | any >(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbars = ({
  SnackbarOpen,
  setSnackbarOpen,
  severity
}: any) => {
  const handleClose = (event: any, reason: any): void => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen({ state: false, title: SnackbarOpen.title });
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={SnackbarOpen.state}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          <Typography>{SnackbarOpen.title}</Typography>
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomizedSnackbars;
