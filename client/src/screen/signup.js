import React, {Component} from 'react';
import Logo from '../images/n.jpg';
import {Row, Col, Form, Button, Progress} from 'reactstrap';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import {NavLink} from 'react-router-dom';



class SignUp extends Component  {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      err: '',
      loaded: 0
    }
  }

log = (ev) => {
  ev.preventDefault();
    this.props.history.push(`/login`);
}
firstN = (ev) => {
         let name = ev.target.value;
         this.setState({firstName:name}); 
}
lastN = (ev) => {
  let name = ev.target.value;
  this.setState({lastName:name}); 
}
phone = (ev) => {
  let name = ev.target.value;
  this.setState({phone:name}); 
}
email = (ev) => {
  let name = ev.target.value;
  this.setState({email:name}); 
}
pword = (ev) => {
          let password = ev.target.value;
          this.setState({password});
}
click = (ev) => {
  ev.preventDefault();
}

submit = (ev) => {
  ev.preventDefault();
  toast.success('Loading,  please wait');
  let user = {
    firstname: this.state.firstName,
    lastname: this.state.lastName,
    email: this.state.email,
    phone: this.state.phone,
    password: this.state.password,
    userName: this.state.email
  }
  if(user.firstname.trim() == "" || user.lastname.trim() == "" || user.email.trim() == "" || user.phone.trim() == "" || user.password.trim() == "")
  {
    this.setState({err: 'Please All Fields Are Required'})
    return false
  }
  //  else if(user.password.trim().length() < 8) 
  //  {
  //   this.setState({err: 'Password should be 8 characters or more'})
  //   return false
  // }
  else{
    axios.post('/register', user, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      }
    })
    .then(()=> axios.post('/login', user))
    .then((res)=>{if(res.data.id){this.props.history.replace(`/home/${res.data.id}`)}
   else {return}})
  .then((res) => {toast.error('Sign Up Failed, Please Try Again.'+ res.data.message)})
    .then((res) => {toast.success('Sign Up Successful')})
  
  .catch(err => {toast.error('Sign Up Failed, Please Try Again.')})
  return true
  }
  
}

  render(){

  return (
    <div className="login-div">
      <div className="container-fluid log-con">
        <Row>
          <Col md="6">
            <div>
            <img src={Logo} className="img" alt="logo" />
            <h1 className="text">Welcome To GigVee,</h1>
            <p className="lead text">making a difference in people...</p>
            </div>
          </Col>
          <Col md="6">
            <Form onSubmit={this.submit}>
            <h3 className="err">{this.state.err}</h3>
              <label for="firstname" className="text"> Enter First Name.</label>
              <input type="text" name="firstname" placeholder="First Name" onChange={this.firstN} value={this.state.firstName} className="form-control" />
              {/* last name */}
              <label for="lastname" className="text"> Enter Last Name.</label>
              <input type="text" name="lastname" placeholder="Last Name" onChange={this.lastN} value={this.state.lastName} className="form-control" />
              {/* email */}
              <label for="email" className="text"> Enter Email.</label>
              <input type="email" name="email" placeholder="Please Enter Email" onChange={this.email} value={this.state.email} className="form-control" />
              {/* phone */}
              <label for="phone" className="text"> Enter Phone.</label>
              <input type="tel" name="phone" placeholder="phone number" onChange={this.phone} value={this.state.phone} className="form-control" />
              {/* password */}
              <label for="password" className="text"> Enter Password.</label>
              <input type="password" name="password" placeholder="Enter password" onChange={this.pword} value={this.state.password} className="form-control" />
                         <br></br>
              {this.state.loaded &&
              <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded,2)}%</Progress>
              }
              <br/>
              <p className="text">By signing up, you agree to our <NavLink to="/policy" className="navlink policy">privacy policy</NavLink></p>
              <button className="btn btn-success">Sign Up</button>
              <ToastContainer />

            </Form>
            <h3 className="text">Already Have An Account?</h3>
              <Button className="btn btn-danger" onClick={this.log}>Log in</Button>
          </Col>
        </Row>
      </div>
      <br/>
      {/* about */}
      <div className="container-fluid">
               
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
                  GigVee allows you to create a store and post what you do, once you've registered. Other user will be able to see your posts and will be able to make enquiries as well as make orders. 
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
                  <br/>
                  <h5 align="center">Contact</h5> 
                  <div align="center">
                    <a href="mailto:gigveeteam@gmail.com">
                  <FontAwesomeIcon icon={faGooglePlusG} size='lg' className="btn-danger btn-g"></FontAwesomeIcon> <strong>gigveeteam@gmail.com</strong>
                  </a>
                  </div>
                </p>
              </div>
              </div>
    </div>
  );
}
}

export default SignUp;
