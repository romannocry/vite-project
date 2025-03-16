import './App.css'
import Counter from './components/Counter/Counter'
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import CreateDataset from './components/Dataset/CreateDataset';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
    <Container 
      fluid 
      style={{ 
        width: '100%', 
        maxWidth: '100%', 
        paddingLeft: 0, 
        paddingRight: 0 
      }}
    >
    <Router>
      {/* Always visible links */}
      <div>
        <h1>Navigation</h1>
        <Link to="/counters/1">Go to Counter 1</Link>
        <br />
        <Link to="/dataset/create">Create Dataset</Link>
        <br />
      </div>

      {/* Page-specific content */}
      <Routes>
        <Route path="/counters/:id" element={<Counter />} /> {/* Counter page route */}
        <Route path="/dataset/create" element={<CreateDataset />} /> {/* CreateDataset page route */}
      </Routes>
    </Router>
    </Container>
    </>
  )
}

export default App
