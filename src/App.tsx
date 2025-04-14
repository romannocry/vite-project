import './App.css'
import Counter from './components/Counter/Counter'
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import CreateDataset from './components/Dataset/CreateDataset';
import RegisterDatabase from './components/Database/RegisterDatabase';
import { Link } from 'react-router-dom';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatabaseList from './components/Database/DatabaseList';
import Home from './components/Home/Home';
import Dataset from './components/Dataset/Dataset';
import Database from './components/Database/Database';
import DatasetList from './components/Dataset/DatasetList';
import RegisterDatabase2 from './components/Database/RegisterDatabase/RegisterDatabase';
import Enrichment from './components/Enrichment/Enrichment';
import Bookmark from './components/Bookmark/Bookmark';
import StickyFooter from './components/Footer/Footer';



function App() {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Makes sure the entire viewport height is used
        }}
      >
        {/* Header */}
<Navbar
  color="dark"
  dark
  style={{
    position: "sticky",
    top: 0,
    width: "100%",
    zIndex: 1000, // Ensures it stays on top of other elements
  }}
>

          <NavbarBrand href="#">Nav</NavbarBrand>
        </Navbar>

        {/* Navigation Links */}
        <div>
          <h1>Navigation</h1>
          <Link to="/databases">List Databases</Link>
          <br />
          <Link to="/database/register">Register Database</Link>
          <br />
        </div>

        {/* Main Content (pushes footer down) */}
            <Routes>
            <Route path="/" element={<DatabaseList />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/counters/:id" element={<Counter />} />
              <Route path="/database/register" element={<RegisterDatabase />} />
              <Route path="/database/:databaseid" element={<DatasetList />} />
              <Route path="/datasets/:datasetId" element={<Dataset />} />
              <Route path="/datasets/:datasetId/edit" element={<Dataset />} />
              <Route path="/database/:databaseid/create-dataset" element={<CreateDataset />} />
              <Route path="/databases" element={<DatabaseList />} />
              <Route path="/test" element={<RegisterDatabase2 />} />
              <Route path="/enrich" element={<Enrichment />} />
            </Routes>


      </div>
    </Router>
  )
}

export default App
