import './App.css'
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home';
import StickyFooter from './components/Footer/Footer';



function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {/* Main Content (pushes footer down) */}
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>


      </div>
    </Router>
  )
}

export default App
