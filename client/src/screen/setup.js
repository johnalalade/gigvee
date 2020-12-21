import React, {Component, useState} from 'react';
import Header from './header';

import './setup/setup.css'
// import '/Users/user/Desktop/bro AY/exploits/backend/uploads';

import axios from 'axios';
import {Redirect} from 'react-router-dom';

import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Card, CardBody, CardTitle,CardFooter, Spinner } from 'reactstrap';
import Footer from './foot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';



const Cards = (prop) => {
  const [comment, setComment] = useState('');
 const det = (ev) => {
    prop.deta(prop.id, prop.storeName);
  }
  
  return(
     <div>
         <Card>
           <img width="100%" src={prop.img} alt="prod" />
           <CardBody>
             <CardTitle>{prop.storeName}</CardTitle>
             {/* <CardSubtitle>{prop.productName}</CardSubtitle> */}
           </CardBody>
           <CardFooter className="text-muted"></CardFooter>
          {/* <CardFooter><input type="text" name="comment" placeholder="write a comment" onChange={
                (ev) => {let comment = ev.target.value;
                         setComment(comment); }} value={comment} className="form-control" />
          </CardFooter> */}
         </Card>
         <br></br>
     </div>    
  );
}


class SetUp extends Component {
  constructor(props){
    super(props);
    this.state= {
      profile: {},
      token: localStorage.getItem('token')
    }
  }
  componentDidMount() {
    if(!localStorage.getItem('token')){
      this.props.history.replace(`/login`);
     }
    let user = {userID: this.props.match.params.id, token: this.state.token}
    axios.post('/profiles/showone', user)
    
    .then((data)=>{this.setState({profile: data.data.response})})
    .catch(err => {toast.error("Couldn't Get Data, Please Try Again."+ err)})
  }
  render(){

  

     
    return (
      <div>
        
           <Header  id={this.props.match.params.id} />
           {this.state.profile.firstname &&  
           <div className="setup-div">
             <br/>
             <br/>
             <br/>
            <div className="card-bg-setup">
                 <div className="img-card">
                 {this.state.profile.src && <img src={this.state.profile.src} className="setupimg" alt="profile img" /> || <FontAwesomeIcon icon={faUser} size='lg'></FontAwesomeIcon> }
                  </div>
                  <br/>
                  <div className="lists">
                    <h5>{this.state.profile.firstname} {this.state.profile.lastname}</h5>
                    <a className="card-list" onClick={()=>
                                  this.props.history.push(`/profile/${this.props.match.params.id}`)} >Profile</a> 
                    <hr/>
                    <a className="card-list" onClick={()=>
                                  this.props.history.push(`/mystore/${this.props.match.params.id}`)} >My Store</a>
                    <hr/>
                     <a className="card-list" onClick={() => {
                       localStorage.clear();
                       this.props.history.replace(`/login`);
                    }} >Log Out</a>
                    <hr/>
                    <a className="card-list" onClick={()=>
                                  this.props.history.push(`/privacy/${this.props.match.params.id}`)} >Privacy Policy</a>
                    <hr/> 
                  </div>
                  <a className=" card-list" onClick={()=>
                                  this.props.history.push(`/aboutus/${this.props.match.params.id}`)} >About Us</a>
               </div>
               
              <br></br>
              <br></br>
              <br></br>
              <ToastContainer />
           </div> 
           || <div className="spin"><Spinner className="spinner" color="primary" size="lg"/></div>}
           <Footer id={this.props.match.params.id} />
      </div>
    );
  }
  
}

export default SetUp;

