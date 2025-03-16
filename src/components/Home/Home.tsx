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
            </div>
        </>
        );
    }
    
    export default Home;
    