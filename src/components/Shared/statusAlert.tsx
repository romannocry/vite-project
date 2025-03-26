import { Snackbar, Alert } from "@mui/material";

interface StatusAlertProps {
  open: boolean;
  onClose: () => void;
  severity: "success" | "error"; // This controls the color and style of the alert
  message: string;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default StatusAlert;
