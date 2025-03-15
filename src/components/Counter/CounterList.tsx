import { useEffect} from 'react'
import { useParams } from "react-router-dom";

function CounterList() {
  const { id } = useParams();

    useEffect(() => {
      console.log("counterlist")
    }, []);

  return (
    <>
      <div>This is the CounterList page of id {id}</div> 
    </>
  )
}

export default CounterList