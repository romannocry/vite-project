
import { useState, useEffect, useRef } from 'react'
import Database from './Database';
import RegisterDatabase from './RegisterDatabase';
import Container from '@mui/material/Container';
import { Grid2 } from '@mui/material';
//import { Card, CardHeader } from 'reactstrap';



const LAMBDA_API_URI = import.meta.env.VITE_LAMBDA_API_URI

interface Dataset {
    creator: string;
    name: string;
  }

function DatabaseList() {

    const [databases, setDatabases] = useState<Dataset[]>([]);
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
            setDatabases([
                {"creator": "roman", "name": "yolo"},
                {"creator": "roman", "name": "dodo"},
                {"creator": "roman", "name": "carto"},
                {"creator": "roman", "name": "zouz"},
                {"creator": "john", "name": "roman"},
            ])
            setIsLoading(false); // Hide loading screen
        });
        return () => {
            componentIsMounted.current = false;
        };
    }, []);

    return (
        <>
            <h1>Database List</h1>
            {/* {databases.length > 0 ? ( */}
            {databases.length < 0 ? (
                <Grid2 container spacing={2} padding={2}>
                    {databases.map((database: any, index: any) => (
                    <Grid2 key={index} size={4}>
                        <Database database={database} key={index} />
                    </Grid2>

                    ))}
                </Grid2>
            ) : (
                <>
                <Container>
                    <p>You don't have databases. Register your first database</p>
                    <RegisterDatabase/>
                    </Container>
                </>
            )}
        </>
        );
    }
            
    export default DatabaseList;
            