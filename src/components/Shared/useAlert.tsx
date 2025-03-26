import { useState } from "react";

type Severity = "success" | "error" | "idle";

interface AlertProps {
  open: boolean;
  severity: Severity;
  message: string;
  onClose: () => void;
}

export const useAlert = () => {
  const [alertProps, setAlertProps] = useState<AlertProps>({
    open: false,
    severity: "success",  // Default to success
    message: "",
    onClose: () => closeAlert()
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Function to trigger alert display
  const showAlert = (severity: Severity, message: string) => {
    setAlertProps({
      open: true,
      severity,
      message,
      onClose: () => closeAlert()
    });
    setStatus(severity)

  };

  // Function to close the alert and reset status
  const closeAlert = () => {
    console.log("closing alert")
    setAlertProps({
      ...alertProps,
      open: false,
    });
    //setStatus("idle")
    // Reset the status to "idle" after the alert closes
    //setStatus("idle");
  };


  return { alertProps, showAlert, status };
};
