import React,{useState} from 'react';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faPlaneDeparture,} from '@fortawesome/free-solid-svg-icons';
import {Nav, Tooltip} from 'reactstrap';
import Logo from '../images/n.jpg';
import './style.css';

 

function Header(prop) {
  const[tooltipOpen, setTooltipOpen] = useState(false);
  
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <Nav className="header">
  
     <NavLink activeClassName="current" className="navlink" to={`/setup/${prop.id}`}> <FontAwesomeIcon icon={faBars} size="lg"></FontAwesomeIcon></NavLink>
    

  
      <NavLink className="navlink" to={`/home/${prop.id}`}><img src={Logo} className="img-h" alt="logo"></img></NavLink>
    

  
      <NavLink disabled className="navlink delivery" to="#" id="delivery"> <FontAwesomeIcon icon={faPlaneDeparture} size="lg"></FontAwesomeIcon>
      <Tooltip placement="left" isOpen={tooltipOpen} target="delivery" toggle={toggle}>Delivery: Coming Soon</Tooltip>
      </NavLink>
    
    </Nav>
  );
}

export default Header;
//  <nav className="header">  </nav> 