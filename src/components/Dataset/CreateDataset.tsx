
import { useState, useEffect } from 'react'

//const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface Dataset {
    uuid?: string;
    name: string;
}


let newDataset: Dataset = {
    name: 'DatasetName', 
}

function CreateDataset() {

   const [dataset, setDataset] = useState<Dataset>(newDataset);

    
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
                </form>
            </div>
        </>
        );
    }
            
    export default CreateDataset;
            