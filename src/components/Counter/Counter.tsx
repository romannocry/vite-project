import { useState } from 'react'
import styles from './Counter.module.css'; // Import the CSS Module
import { useParams } from "react-router-dom";

function Counter() {
  const [count, setCount] = useState(0)
  const { id } = useParams();

  return (
      <div className={styles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count} and id isss {id}
        </button>
      </div>
  )
}

export default Counter