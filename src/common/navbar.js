import React, { useState } from 'react';
import { useHistory, useLocation , NavLink} from 'react-router-dom';
import {
  Button, Col, Container, Nav, Navbar, NavbarBrand, NavItem, Row,
  Modal, ModalBody, ModalTitle
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../app/useAuth';
import { removeItemFromStorage } from '../utils/helper';

const baseUrl = window.location.origin;

const NavbarComponent = () => {
  const user = useAuth();
  const history = useHistory();
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';
  const [logoutModal, toggleLogoutModal] = useState(false);

  const setLogin = () => {
    if (user.isloggedIn) {
      toggleLogoutModal(!logoutModal);
    } else {
      history.push('/login');
    }
  }

  const logout = () => {
    toggleLogoutModal(!logoutModal);
    removeItemFromStorage('user');
    user.setAuthUser(null);
    user.logout();
    history.push('/');
  }

  return <Container fluid>
    <Row>
      <Col>
        <Navbar expand="md">
          <NavbarBrand href="/home">
            <img src={baseUrl + "/assets/Zenoti.svg"} alt="logo" />
          </NavbarBrand>
          <h3 className="navbar-title">PDF Generator</h3>
          <Navbar.Toggle className={`ml-auto ${!showNavbar ? "hide-toggle" : ""}`} aria-controls="navbar-toggle">
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          <Navbar.Collapse id="navbar-toggle">
            <Nav className={`ml-auto ${!showNavbar ? "hide-toggle" : ""}`}>            
            {user.isloggedIn ? (
              <>
                <NavLink exact className="d-flex align-items-center nav-link" to="/" activeClassName="active">
                  Home
                </NavLink>
                <NavLink exact className="d-flex align-items-center nav-link" to="/analytics-page" activeClassName="active">
                  Dashboard
                </NavLink>
                <NavItem className="d-flex align-items-center">
                  <div className="p-1 font-weight-bold text-secondary">{user.authUser.username}</div>
                </NavItem>
                </>
              ) : null}
              <NavItem>
                <Button onClick={() => setLogin()}>
                  {user.isloggedIn ? 'Logout' : 'Login'}
                </Button>
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Col>
      <div className="navbar-separator-div">
      <div className="navbar-separator"></div>
      </div>
    </Row>
    <Modal show={logoutModal} onHide={() => toggleLogoutModal()}>
      <Modal.Header closeButton>
        <ModalTitle className="px-4">Logout</ModalTitle>
      </Modal.Header>
      <ModalBody className="px-5">
        <p>Are you sure you want to logout?</p>
        <div className="button-container">
          <Button variant="primary" type="button" className="mx-2" onClick={() => logout()}>Logout</Button>
          <Button variant="secondary" type="button" className="mx-2" onClick={() => toggleLogoutModal()}>Cancel</Button>
        </div>
      </ModalBody>
    </Modal>
  </Container>
};

export default NavbarComponent;