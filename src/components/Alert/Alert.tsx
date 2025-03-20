import { useState } from 'react'
import { Snackbar, Alert } from "@mui/material";

interface StatusAlertProps {
    open: boolean;
    onClose: () => void;
    severity: "success" | "error";
    message: string;
  }

const StatusAlert = ({ open, onClose, severity, message }: StatusAlertProps) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default StatusAlert