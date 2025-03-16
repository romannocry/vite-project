
import { useState, useEffect } from 'react'

//const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface Database {
    uuid?: string;
    url: string;
}


let newDataset: Database = {
    url: 'Lambda URL', 
}

function LinkDatabase() {

   const [dataset, setDatabase] = useState<Database>(newDataset);

    
    useEffect(() => {         
        
    }, [/* field */]); // This effect runs whenever 'field' changes
    
    
    return (
        <>
            <div>
                <h1>Link Database</h1>
                <form>
                    <input 
                        type="text" 
                        value={dataset.url} 
                        onChange={(e) => setDatabase({ ...dataset, url: e.target.value })}
                    />
                </form>
            </div>
        </>
        );
    }
            
    export default LinkDatabase;
            