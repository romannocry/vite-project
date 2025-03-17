import { useState } from 'react'
import styles from './Dataset.module.css'; // Import the CSS Module
import { useParams } from "react-router-dom";

function Dataset() {
  const [count, setCount] = useState(0)
  const { id } = useParams();
  const { databaseid } = useParams();
  const { datasetId } = useParams();

  return (
      <div className={styles.card}>
        <h1>Fetching specific Dataset</h1>

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        
        <li>Database id = {databaseid}</li>
        <li>Dataset id - {datasetId}</li>
      </div>
  )
}

export default Dataset