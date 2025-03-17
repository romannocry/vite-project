import './App.css'
import Counter from './components/Counter/Counter'
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import CreateDataset from './components/Dataset/CreateDataset';
import RegisterDatabase from './components/Database/RegisterDatabase';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatabaseList from './components/Database/DatabaseList';
import Home from './components/Home/Home';
import Dataset from './components/Dataset/Dataset';
import Database from './components/Database/Database';
import DatasetList from './components/Dataset/DatasetList';

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
        <Link to="/databases">List Databases</Link>
        <br />
        <Link to="/database/register">Register Database</Link>
        <br />
      </div>

      {/* Page-specific content */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Counter page route */}
        <Route path="/counters/:id" element={<Counter />} /> {/* Counter page route */}
        <Route path="/database/register" element={<RegisterDatabase />} /> {/* CreateDataset page route */}
        <Route path="/database/:databaseid" element={<DatasetList />} /> {/* CreateDataset page route */}
        <Route path="/database/:databaseid/datasets/:datasetId" element={<Dataset />} /> {/* CreateDataset page route */}
        <Route path="/database/:databaseid/create-dataset" element={<CreateDataset />} /> {/* CreateDataset page route */}
        <Route path="/databases" element={<DatabaseList />} /> {/* CreateDataset page route */}
      </Routes>
    </Router>
    </Container>
    </>
  )
}

export default App
