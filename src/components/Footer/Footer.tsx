import React from "react";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const StickyFooter = () => {
  return (

<footer
  style={{
    position: "sticky",
    bottom: 0,
    width: "100%",
    backgroundColor: "#343a40", // Dark theme
    color: "white",
    textAlign: "center",
    padding: "1rem 0",
  }} 
  className="bg-dark text-light text-center py-3 sticky-footer">
    © 2025 My Website - All Rights Reserved
  </footer> 

  );
};

export default StickyFooter;
