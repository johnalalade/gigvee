import React, { Component } from 'react';
import Logo from '../images/n.jpg';
import { Row, Col, Form, Button, Progress } from 'reactstrap';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';
import { NavLink } from 'react-router-dom';


var date = new Date()
date.getFullYear()
var year = date.toString();


class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      cpassword: '',
      passwordError: '',
      cpasswordError: '',
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
    this.setState({ firstName: name });
  }
  lastN = (ev) => {
    let name = ev.target.value;
    this.setState({ lastName: name });
  }
  phone = (ev) => {
    let name = ev.target.value;
    this.setState({ phone: name });
  }
  email = (ev) => {
    let name = ev.target.value.toLowerCase();
    this.setState({ email: name });
  }
  pword = (ev) => {
    let password = ev.target.value;
    if (this.state.password.length < 7) {
      this.setState({ passwordError: 'Password too short (8)' })
    } else {
      this.setState({ passwordError: 'Password Okay!!!' })
    }
    this.setState({ password });
  }
  cpword = (ev) => {
    let cpassword = ev.target.value;
    if (this.state.password === cpassword) {
      this.setState({ cpasswordError: 'Password Match!!!' })
    } else {
      this.setState({ cpasswordError: 'Password does not match!!!' })
    }
    this.setState({ cpassword });
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
    if (user.firstname.trim() == "" || user.lastname.trim() == "" || user.email.trim() == "" || user.phone.trim() == "" || user.password.trim() == "" || this.state.cpassword.trim() == "") {
      toast.error('Please All Fields Are Required');
      this.setState({ err: 'Please All Fields Are Required' })
      return false
    }
    else if (user.password.trim() !== this.state.cpassword.trim()) {
      this.setState({ err: 'Password does not match' })
      toast.error('Password does not match')
      return false
    }
    else if (user.password.trim().length < 8){
      this.setState({ err: 'Password must be atleast 8 characters' })
      toast.error('Password must be atleast 8 characters')
    }
    else {
      axios.post('/register', user, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
          })
        }
      })
        .then(() => axios.post('/login', user))
        .then((res) => {
          if (res.data.id) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('id', res.data.id)
            this.props.history.replace(`/home?gigvee=true&product=1`)
          }
          else { return }
        })
        .then((res) => { toast.error('Sign Up Failed, Please Try Again.' + res.data.message) })
        .then((res) => { toast.success('Sign Up Successful') })

        .catch(err => { toast.error('Sign Up Failed, Please Try Again.') })
      return true
    }

  }

  render() {

    return (
      <div>
        <div className="login-div">
          <div className="container-fluid log-con">
            <Row>
              <Col md="6">
                <div className="about-logo">
                  <img src={Logo} className="img" align="center" alt="logo" />
                  <h1 className="text" align="center">Welcome To GigVee,</h1>
                  <p className="lead text" align="center">making a difference in people...</p>
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
                  {this.state.passwordError && <p className="text">{this.state.passwordError}</p>}
                  <input type="password" name="password" placeholder="Enter password" onChange={this.pword} value={this.state.password} className="form-control" />
                  {/* confirm password */}
                  <label for="password" className="text"> Confirm Password.</label>
                  {this.state.cpasswordError && <p className="text">{this.state.cpasswordError}</p>}
                  <input type="password" name="password" placeholder="Confirm password" onChange={this.cpword} value={this.state.cpassword} className="form-control" />
                  <br></br>
                  {this.state.loaded &&
                    <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded, 2)}%</Progress>
                  }
                  <br />
                  <p className="text">By signing up, you agree to our <NavLink to="/policy" className="navlink policy">privacy policy</NavLink></p>
                  <p className="text">Please allow geoloction permission in the next page once you've successfully signed up. For a great experience.</p>
                  <button className="btn btn-success form-control">Sign Up</button>
                  <ToastContainer />

                </Form>
                <h3 className="text">Already Have An Account?</h3>
                <Button className="btn btn-danger" onClick={this.log}>Log in</Button>
              </Col>
            </Row>
          </div>
          <br />
          {/* about */}
          {/* <div className="container-fluid">

            <h1 align="center">About GigVee</h1>
            <div className="about-logo">
              <img src={Logo} className="img-abo" align="center" alt="logo" />
              <br />
              <div>
                <h4 align="center">GigVee</h4>
                <p className="lead" align="center" >making a difference in people...</p>
              </div>
            </div>
            <div>
              <p>
              <strong className="text">GigVee</strong> is an online platform that truely brings the <strong className="text">Business World</strong> to the Internet. It is the place where you can buy and sell goods and services, get employees or get employed. We help connect you to potential buyers and sellers, employees and employers who are around you.
                  <br />
                <br />
                Once you've registered, <strong className="text">GigVee</strong> allows you to create a store and post what you do. Other users will be able to see your posts and will be able to make enquiries as well as make orders.
                  <br />
                <br />
                  You can post anything you do, ranging from your products and services, even to available vacancies in your business if your business is hiring
                  <br />
                <br />
                  Wtih <strong className="text">GigVee</strong> you can easily get potential customers near you.
                  <br />
                <br />
                  We hope you enjoy your journey into a better business experience......
                  <br />
                <span className="quote">~GigVee team</span>
                <br />
                <h5 align="center">Contact</h5>
                <div align="center">
                  <a href="mailto:gigveeteam@gmail.com">
                    <FontAwesomeIcon icon={faGooglePlusG} size='lg' className="btn-danger btn-g"></FontAwesomeIcon> <strong>gigveeteam@gmail.com</strong>
                  </a>
                </div>
              </p>
            </div>
          </div>*/}
        </div>
        <div className="bottom">
          <p align="center"> GigVee Team &#169; {year.slice(10, 15)}</p>
        </div>
      </div>
    );
  }
}

export default SignUp;

//&#169;