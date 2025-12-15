import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react';

export default function AppNavbar() {
  return (
    <Navbar variant="dark" expand="lg" className="mb-4 rounded-1" style={{backgroundColor: '#0e0644ff'}}>
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>Coin/Flip</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/leaderboard">
              <Nav.Link>Leaderboard</Nav.Link>
            </LinkContainer>
            <SignedIn>
              <LinkContainer to="/profile">
                <Nav.Link>Profile</Nav.Link>
              </LinkContainer>
            </SignedIn>
          </Nav>
        </Navbar.Collapse>
        <div className="me-4 d-flex">
          <SignedOut>
            <SignInButton redirectUrl="/" />
          </SignedOut>
          <SignedIn>
            <UserButton redirectUrl="/" />
            <SignOutButton redirectUrl="/" />
          </SignedIn>
        </div>
      </Container>
    </Navbar>
  );
}