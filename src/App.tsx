import './App.css'
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home/Home';
import StickyFooter from './components/Footer/Footer';
import Main from './components/vendor/main';
import Product from './components/vendor/product';
import ClientTeamHeatmap from './components/heatmap/ClientHeatmap';
import LandingPage from './components/marketing/LandingPage';
import Test_main from './components/test/Test_main';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        {/* Main Content (pushes footer down) */}
            <Routes>
            <Route path="/product" element={<Product />} />
            <Route path="/testing" element={<LandingPage />} />
            <Route path="/test_main" element={<Test_main />} />
            <Route path="/heatmap" element={<ClientTeamHeatmap />} />
            <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>


      </div>
    </Router>
  )
}

export default App
