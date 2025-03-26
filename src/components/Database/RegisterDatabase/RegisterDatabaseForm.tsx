import { Paper, Divider, IconButton, InputBase } from "@mui/material";
import { IoIosSend } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";

interface Props {
  database: { name: string, description:string };
  status: "idle" | "success" | "error";
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}


const RegisterDatabaseForm = ({ database, status, onInputChange, onSubmit }: Props) => {
  return (
    <>
    <Paper
      component="form"
      onSubmit={onSubmit}
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
        value={database.name}
        onChange={onInputChange}
        inputProps={{ "aria-label": "input lambda db name" }}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

      <IconButton type="submit" color="primary" sx={{ p: "10px" }} aria-label="submit">
        {status === "success" ? <FaCheck color="green" /> : status === "error" ? <BiSolidError color="red" /> : <IoIosSend />}
      </IconButton>
    </Paper>
    </>
  );
  
};

export default RegisterDatabaseForm;
