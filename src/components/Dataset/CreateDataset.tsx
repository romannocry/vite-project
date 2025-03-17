
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Button } from 'reactstrap';

//const API_URL = import.meta.env.VITE_BACKEND_API_URL
const LAMBDA_API_URI = import.meta.env.VITE_LAMBDA_API_URI

interface Dataset {
    uuid?: string;
    user_uuid: string;
    name: string;
}


let newDataset: Dataset = {
    name: 'DatasetName',
    user_uuid: ''
}

function CreateDataset() {
    const navigate = useNavigate();
    const [dataset, setDataset] = useState<Dataset>(newDataset);

    const { databaseid } = useParams();

    const handleSubmit = () =>{
        console.log("handling submit")
        try {
            console.log("submit")
            fetch(LAMBDA_API_URI+'/'+databaseid+'/'+dataset.name, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGggciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTc2ODA1MTIsInN1YiI6Ijg2YjM4NTUwLWJlMzMtNGQxYS1hZGQ5LTJjYTk2OGE2YzMyZiJ9.u1VqhlfAZN7Ymz7EMS7N9hnwyKYw38EC9eZVchbVAXU"      
                },
                body:JSON.stringify(dataset),
            })
            .then((response) => {
                if (!response.ok) {
                //throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the JSON response
            })
            .then((data) => {
                console.log(data)
                navigate(`/database/${databaseid}/datasets/${dataset.name}`);

            })

        } catch (error) {
            console.log("submit error")
        }
    
    };

    
    useEffect(() => {         
        
    }, [/* field */]); // This effect runs whenever 'field' changes
    
    
    return (
        <>
            <div>
                <h1>Create Dataset</h1>
                <form>
                    <input 
                        type="text" 
                        value={dataset.name} 
                        onChange={(e) => setDataset({ ...dataset, name: e.target.value })}
                    />
                    <Button onClick={handleSubmit}>Create</Button>
                    
                </form>
            </div>
        </>
        );
    }
            
    export default CreateDataset;
            