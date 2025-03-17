
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar, Card } from 'reactstrap';


function Database(db: any) {

   const [database, setDatabase] = useState(db.database);
   const [isLoading, setIsLoading] = useState(false);
   const componentIsMounted = useRef(true);
    
    useEffect(() => {
        console.log(database)
    }, []);

    return (
        <>
            <Card>
                {database.name}
                <ButtonToolbar>
                    <ButtonGroup size="sm">
                    <Button outline><Link to={`/database/${database.name}`}>Datasets</Link></Button>
                    <Button outline><Link to={`/database/${database.name}/create-dataset`}>Create Dataset</Link></Button>
                    </ButtonGroup>
                </ButtonToolbar>     

            </Card>
        </>
        );
    }
            
    export default Database;
            