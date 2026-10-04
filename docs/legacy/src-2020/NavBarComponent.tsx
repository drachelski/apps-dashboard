import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {
    Link,
  } from "react-router-dom";

import "./NavBarComponent.css"

export const NavBarComponent = (props: any) => {

  return (
    <div className="navBarComponent" id="navbar">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#/" className="ntwins-brand">ntwins</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className="nav-link" as={Link} to="/home/next">Incoming games</Nav.Link>
            <Nav.Link className="nav-link" as={Link} to="/home/apps">Games & Apps</Nav.Link>
            <Nav.Link className="nav-link" as={Link} to="/home/articles">News</Nav.Link>
            <Nav.Link className="nav-link" as={Link} to="/home/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}