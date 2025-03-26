import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Paper, Divider, IconButton, InputBase } from '@mui/material';
import { IoIosSend } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa';
import { BiSolidError } from 'react-icons/bi';
import StatusAlert from "../Alert/Alert";

const API_BASE_URL = 'http://localhost:8000/api/v1';
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTc2ODA1MTIsInN1YiI6Ijg2YjM4NTUwLWJlMzMtNGQxYS1hZGQ5LTJjYTk2OGE2YzMyZiJ9.u1VqhlfAZN7Ymz7EMS7N9hnwyKYw38EC9eZVchbVAXU";

interface Database {
    uuid?: string;
    name: string;
}

const initialDatabase: Database = {
    uuid: '543fdsf-434r-r32r',
    name: '',
};

const RegisterDatabase = () => {
    const navigate = useNavigate();
    const [database, setDatabase] = useState<Database>(initialDatabase);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [alert, setAlert] = useState({ open: false, type: "success", message: "" });

    const openAlert = (type: "success" | "error", message: string) => {
        setAlert({ open: true, type, message });
        if (type === "error") {
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDatabase((prev) => ({ ...prev, name: event.target.value }));
    };

    const fetchLedgerData = async () => {
        const response = await fetch(`${API_BASE_URL}/ledgers/${database.name}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': AUTH_TOKEN }
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json();
    };

    const postTransaction = async () => {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': AUTH_TOKEN },
            body: JSON.stringify({
                ledgerUUID: database.name,
                payload: { database_link: database.name, owner_id: "john", registered_date: "2025-03-28" }
            })
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        return response.json();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await fetchLedgerData();
            const transactionData = await postTransaction();
            setStatus("success");
            openAlert("success", "Submission successful!");
            setTimeout(() => navigate(`/database/${transactionData.uuid}`), 1000);
        } catch (err) {
            console.error("Fetch error:", err);
            setStatus("error");
            openAlert("error", err.message.includes("403") ? "You don't have permission to access this database." : err.message.includes("404") ? "Database not found." : "Submission failed, please try again.");
        }
    };

    return (
        <>
            <StatusAlert open={alert.open} onClose={() => setAlert((prev) => ({ ...prev, open: false }))} severity={alert.type} message={alert.message} />

            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: "2px 4px", display: "flex", alignItems: "center", width: 400,
                    border: `1px solid ${status === "success" ? "green" : status === "error" ? "red" : "gray"}`,
                    backgroundColor: status === "success" ? "#d4edda" : "white",
                    transition: "background-color 0.3s ease, border-color 0.3s ease",
                }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1, color: status === "success" ? "green" : "black" }}
                    placeholder="Input Lambda DB name"
                    value={database.name}
                    onChange={handleInputChange}
                    inputProps={{ "aria-label": "input lambda db name" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type="submit" color="primary" sx={{ p: "10px" }} aria-label="submit">
                    {status === "success" ? <FaCheck color='green' /> : status === "error" ? <BiSolidError color='red' /> : <IoIosSend />}
                </IconButton>
            </Paper>
        </>
    );
};

export default RegisterDatabase;
