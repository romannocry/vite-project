
import { useState, useEffect, useRef } from 'react'
import Database from './Database';
import RegisterDatabase from './RegisterDatabase';

const LAMBDA_API_URI = import.meta.env.VITE_LAMBDA_API_URI

function DatabaseList() {

   const [databases, setDatabases] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const componentIsMounted = useRef(true);
    
    useEffect(() => {
        setIsLoading(true);
        fetch(LAMBDA_API_URI + '/roman', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTc2ODA1MTIsInN1YiI6Ijg2YjM4NTUwLWJlMzMtNGQxYS1hZGQ5LTJjYTk2OGE2YzMyZiJ9.u1VqhlfAZN7Ymz7EMS7N9hnwyKYw38EC9eZVchbVAXU"      
            },
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setDatabases(data)
        })
        .catch((err) => {
            console.error(err.message);
            setIsLoading(false); // Hide loading screen
        });
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    return (
        <>
        <div>
            <h1>Database List</h1>
            {databases.length > 0 ? (
            <ul>
                {databases.map((database, index) => (
                <Database database={database} key={index} />
                ))}
            </ul>
            ) : (
                <>
                    <p>You don't have databases. Register your first database</p>
                    <RegisterDatabase/>
                </>
            )}
        </div>
        </>
        );
    }
            
    export default DatabaseList;
            