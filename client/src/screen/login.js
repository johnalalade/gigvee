import React, { useState, Component } from 'react';
import Logo from '../images/n.jpg';
import { Container, Row, Col, Form, Button, Progress } from 'reactstrap';
import './style.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


var date = new Date()
date.getFullYear()
var year = date.toString()
class Logins extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      err: '',
      loaded: 0
    }
  }
  log = (ev) => {
    ev.preventDefault();
    this.props.history.replace(`/register`);
  }
  userN = (ev) => {
    let name = ev.target.value.toLowerCase();
    this.setState({ userName: name });
  }
  pword = (ev) => {
    let password = ev.target.value;
    this.setState({ password: password });
  }
  click = (ev) => {
    ev.preventDefault();

  }

  submit = (ev) => {
    ev.preventDefault();
    toast.success('Loading,  please wait');
    let user = {
      userName: this.state.userName,
      password: this.state.password
    }
    axios.post('/login', user, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
        })
      }
    })
      .then((res) => {
        if (res.data.id) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('id', res.data.id)
          this.props.history.replace(`/home?gigvee=true&product=1`)
        }
        else { return }
      })
      .then((res) => { toast.error('Login Failed, Please Try Again.' + res.data.message) })

      .catch(err => { toast.error('Login Failed, Please Try Again.') })
  }

  render() {

    return (
      <div>
        <div className="container-fluid login-con">
          <Row>
            <Col md="6">
              <div className="about-logo">
                <img src={Logo} className="img" align="center" alt="logo" />
                <h1 className="text" align="center">Welcome To GigVee,</h1>
                <p className="lead text" align="center">making a difference in people...</p>
              </div>
            </Col>
            <Col md="6">
              <h3 className="err">{this.state.err}</h3>
              <Form onSubmit={this.submit}>
                <label for="username" className="text"> Enter Username.</label>
                <input type="text" name="username" placeholder="Enter Email or Phone" onChange={this.userN} value={this.state.userName} className="form-control" />
                <label for="password" className="text"> Enter Password.</label>
                <input type="password" name="password" placeholder="Enter password" onChange={this.pword} value={this.state.password} className="form-control" />
                <br></br>
                {this.state.loaded &&
                  <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded, 2)}%</Progress>
                }
                <br />
                <button className="btn btn-success form-control">Login</button>
                <ToastContainer />

              </Form>
              <h3 className="text">Don't Have An Account?</h3>
              <Button className="btn btn-danger" onClick={this.log}>Sign up</Button>
            </Col>
          </Row>
        </div>
        <div className="bottom">
          <p align="center"><b>GigVee Team &#169; {year.slice(10, 15)}</b></p>
        </div>
      </div>
    );
  }
}

export default Logins;
