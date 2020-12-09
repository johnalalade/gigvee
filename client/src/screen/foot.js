import React from 'react';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faSearch, faStore } from '@fortawesome/free-solid-svg-icons';
import './style.css';

function Footer(prop) {
  return (
    <nav className="tab">

       <NavLink activeClassName="current" className="navlink" to={`/home/${prop.id}`}> 
       <FontAwesomeIcon icon={faStore} size="lg" />
       </NavLink>

       

       <NavLink className="navlink" activeClassName="current" to={`/notifications/${prop.id}`}>
         <FontAwesomeIcon icon={faBell} size="lg"></FontAwesomeIcon>
         </NavLink>

      <NavLink disabled className="navlink" activeClassName="current" to={`/search/${prop.id}`}> 
      <FontAwesomeIcon icon={faSearch} size="lg"></FontAwesomeIcon>
      </NavLink>
      
    </nav>
  );
}

export default Footer;
