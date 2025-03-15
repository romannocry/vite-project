import Counter from './components/Counter/Counter'
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={null} />
        <Route path="/counters/:id" element={<Counter />} /> {/* Ensure this path is correct */}
      </Routes>
    </Router>
  )
}

export default App
