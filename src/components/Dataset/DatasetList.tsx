import { useState } from 'react'
import styles from './Dataset.module.css'; // Import the CSS Module
import { useParams } from "react-router-dom";

function DatasetList() {
  const { databaseid } = useParams();

  return (
      <div className={styles.card}>
        <h1>Dataset List</h1>

        
        <li>Fetching datasets for database id: {databaseid}</li>
      </div>
  )
}

export default DatasetList