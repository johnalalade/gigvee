import React, { Component } from 'react';
import Header from '../header';
import Footer from '../foot';
import './setup.css';
import Logo from './n.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';

class AboutUs extends Component {
  
    render() {
        return (
            <div>
              <Header  id={this.props.match.params.id} />
              <div className="container-fluid">
               <br/><br/>
               <br/><br/>
              <h1 align="center">About GigVee</h1>
              <div className="about-logo">
              <img src={Logo} className="img-abo" align="center" alt="logo" />
              <br/>
              <div>
                <h4 align="center">GigVee</h4>
                <p className="lead" align="center" >making a difference in people...</p>
              </div>
              </div>
              <div>
                <p>
                  <strong>GigVee</strong> is an online platform that truely brings the <strong>Business World</strong> to the Internet. It is the place where you can buy and sell goods and services, get employees or get employed. We help connect you to potential buyers and sellers, employees and employers who are around you. 
                  <br/>
                  <br/>
                  GigVee allows you to create a store and post what you do once you've registered. Other user will be able to see your posts and will be able to make enquiries as well as make orders. 
                  <br/>
                  <br/>
                  You can post anything you do, ranging from your products and services, even to available vacancies in your business if your business is hiring
                  <br/>
                  <br/>
                  Wtih <strong>GigVee</strong> you can easily get potential customers near you.
                  <br/>
                  <br/>
                  We hope you enjoy your journey into a better business experience......
                  <br/>
                  <span className="quote">~GigVee team</span>   
                </p>
                <h5 align="center">Contact</h5> 
                  <div align="center">
                  <a href="mailto:gigveeteam@gmail.com">
                  <FontAwesomeIcon icon={faGooglePlusG} size='lg' className="btn-danger btn-g"></FontAwesomeIcon> <strong>gigveeteam@gmail.com</strong>
                  </a>
                  </div>
              </div>
              <br/><br/>
              <br/><br/>
              </div>
              <Footer id={this.props.match.params.id} /> 
            </div>
          );
    }
}

export default AboutUs;