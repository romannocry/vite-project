import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {

    
    
    useEffect(() => {         
        
    }, [/* field */]); // This effect runs whenever 'field' changes
    useEffect(() => {
        
    }, []);
    
    return (
        <>
            <div>
                <h1>Home</h1>
                <Link to="/counters/1">Go to Counter 1</Link>
                <br />
                <Link to="/dataset/create">Create Dataset</Link>
            </div>
        </>
        );
    }
    
    export default Home;
    