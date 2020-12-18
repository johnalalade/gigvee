import React, { Component } from 'react';
import Footer from './foot';
import Header from './header';
//import axios from 'axios';
import './style.css';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';

const Tile = (prop) => {

  // const det = (ev) => {
  //   prop.deta(prop.id, prop.storeName);
  // }

  return (
    <div>
       <div className="tiles">
         <p>
         <div className="tile-inner">{prop.chat} sent an enquiry</div>
         </p>
       </div>
   
    </div>
  );
}

class Notifications extends Component {
  constructor(){
    super();
    this.state = {
      long1: '',
      lat1: '',
      user: []
    }
  }

  // componentDidMount(){
  //   let send = {userID: this.props.match.params.id}
  //   axios.post('/profiles/showone', send)
  //   .then((response) => response.json())
  //   .then((response) => response.notifications.map((a) =>{
  //     let id = {productID: a}
  //     axios.post('/profiles/showone',id)
      
  //   }))
  //   .then((data) => {this.setState({user: data})})
  //   .catch(err => {toast.error("Couldn't Get Data, Please Try Again.")})
  // }


  render(){



  return (
    <div>
      <Header  id={this.props.match.params.id} />
      <br></br>
             <br></br>
             <br></br>
       <div className="note">
      <p className="display-4">Thank You For Choosing <strong>GigVee</strong></p>
        <p className="lead">Updates on the site and relevant information to you will be shown here . </p>
        <h5 align="center">Contact</h5> 
           <div align="center">
           <a href="mailto:gigveeteam@gmail.com">
           <FontAwesomeIcon icon={faGooglePlusG} size='lg' className="btn-danger btn-g"></FontAwesomeIcon> <strong>gigveeteam@gmail.com</strong>
           </a>
            </div>
            <br></br>
            <br></br>
        <ToastContainer />
        </div>
      <Footer id={this.props.match.params.id} />
    </div>
  );
  }
}

export default Notifications;
