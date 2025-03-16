
import { useState, useEffect } from 'react'
import { Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";

const LAMBDA_API_URI = import.meta.env.VITE_LAMBDA_API_URI
const LAMBDA_APP_DB = import.meta.env.VITE_LAMBDA_APP_DATABASE_NAME

interface Database {
    uuid?: string;
    url: string;
}


let newDatabase: Database = {
    url: 'Lambda URL', 
}

function RegisterDatabase() {
    const navigate = useNavigate();
    const [database, setDatabase] = useState<Database>(newDatabase);
    const handleRegister = () => {
    console.log("handle")
    if (!newDatabase) return;
    
    // Mimicking a database POST request using a Blob object
    const blob = new Blob([JSON.stringify({ newDatabase })], { type: "application/json" });
    
    // Simulating a response by reading from the Blob
    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result === "string") {
          const data = JSON.parse(reader.result);
          setDatabase(database);
        }
      };
    }

    useEffect(() => {         

    }, [/* field */]); // This effect runs whenever 'field' changes
    
    
    return (
        <>
            <div>
                <h1>Register Database</h1>
                <form>
                    <input 
                        type="text" 
                        value={database.url} 
                        onChange={(e) => setDatabase({ ...database, url: e.target.value })}
                    />
                    <Button onClick={RegisterDatabase}>Register</Button>
                </form>
            </div>
      



        </>
        );
    }
    
            
    export default RegisterDatabase;
