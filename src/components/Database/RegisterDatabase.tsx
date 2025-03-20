
import { useState, useEffect } from 'react'
import { Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { Alert, Divider, IconButton, InputBase, Paper, Snackbar } from '@mui/material';
import { IoIosCheckmarkCircle, IoIosSend } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import { BiSolidError } from 'react-icons/bi';
import StatusAlert from "../Alert/Alert";


const LAMBDA_API_URI = import.meta.env.VITE_LAMBDA_API_URI
const LAMBDA_APP_DB = import.meta.env.VITE_LAMBDA_APP_DATABASE_NAME

interface Database {
    uuid?: string;
    name: string;
}


let newDatabase: Database = {
    uuid:'543fdsf-434r-r32r',
    name: 'Lambda database name', 
}

function RegisterDatabase() {
    const navigate = useNavigate();
    const [database, setDatabase] = useState<Database>(newDatabase);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState<"success" | "error">("success");
    const [alertMessage, setAlertMessage] = useState("");


    const openAlert = (type: "success" | "error", message: string) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertOpen(true);
        // If error, reset the status after 3 seconds
        if (type === "error") {
            setTimeout(() => {
            setStatus("idle"); // Reset status back to idle
            }, 2000); // Reset after 3 seconds
        }
    };

    const handleSubmit = (event: any) => {
      event.preventDefault();
  
    setTimeout(() => {
        const isSuccess = Math.random() > 0.5; 
  
        if (isSuccess) {
          setStatus("success");
          openAlert("success", "Submission successful!");
          setTimeout(() => {
            navigate(`/database/${database.uuid}`);
            }, 1000); 
          
        } else {
          setStatus("error");
          openAlert("error", "Submission failed!");
        }
      }, 1000);
    };

    useEffect(() => {         

    }, [/* field */]); // This effect runs whenever 'field' changes
    
    
    return (
        <>
   <>
      {/* Snackbar Alert for Error Message */}
      <StatusAlert open={alertOpen} onClose={() => setAlertOpen(false)} severity={alertType} message={alertMessage} />

      
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 400,
          border: "1px solid",
          borderColor: status === "success" ? "green" : status === "error" ? "red" : "gray",
          backgroundColor: status === "success" ? "#d4edda" : "white",
          transition: "background-color 0.3s ease, border-color 0.3s ease",
        }}
      >
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            color: status === "success" ? "green" : "black",
          }}
          placeholder="Input Lambda db name"
          inputProps={{ "aria-label": "input lambda db name" }}
        />

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

        <IconButton type="submit" color="primary" sx={{ p: "10px" }} aria-label="submit">
          {status === "success" ? (
            <FaCheck color='green' />
          ) : status === "error" ? (
            <BiSolidError color='red' /> 
          ) : (
            <IoIosSend />
          )}
        </IconButton>
      </Paper>
    </>
        </>
        );
    }
    
            
    export default RegisterDatabase;
