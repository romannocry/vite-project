import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerDatabase, checkDatabaseExists } from "../../Shared/Api";
import { Database } from "../../Shared/types";
import { useAlert } from "../../Shared/useAlert"; // Make sure this is correctly implemented

const useRegisterDatabase = () => {
  const navigate = useNavigate();
  const { showAlert, alertProps, status } = useAlert();  // Use the alertProps from useAlert

  const [database, setDatabase] = useState<Database>({ name: "" });
  //const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("input change")
    setDatabase({ name: event.target.value });
    
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //setStatus("idle");  // Reset status before starting operation

    try {
      await checkDatabaseExists(database.name);  // Check if database exists
      const result = await registerDatabase(database.name);  // Register database
      //setStatus("success");

      // Show the success alert
      showAlert("success", "Database registration successful!");

      setTimeout(() => navigate(`/database/${result.uuid}`), 1000);  // Redirect after success
    } catch (err: any) {
      //setStatus("error");
        
      // Show the error alert
      showAlert("error", err.message || "Database registration failed, please try again.");
    }
  };

  return { database, status, handleInputChange, handleSubmit, alertProps };
};

export default useRegisterDatabase;
