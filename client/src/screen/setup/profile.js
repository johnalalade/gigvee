import React, { Component } from 'react';
import Header from '../header';
import Footer from '../foot'
import './setup.css';
import {Form, Button, Container, Progress, Spinner} from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation,FilePondPluginImagePreview,
  FilePondPluginImageResize,FilePondPluginFileEncode);

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      token: localStorage.getItem('token'),
      firstName: '',
      lastName: '',
      password: '',
      email: "",
      phone: "",
      id: "",
      err: "",
      loaded: 0,
      img: null,
      src: null,
      checker: null,
      checkerImg: null,
      found: null
    }
  }

  componentDidMount(){
    if(!localStorage.getItem('token')){
      this.props.history.replace(`/login`);
    }
    let userID = {userID: this.props.match.params.id,token: this.state.token}
    axios.post('/profiles/showone', userID)
    
    .then((res) => {this.setState({
      
      firstName: res.data.response.firstname,
      lastName: res.data.response.lastname,
      src: res.data.response.src,
     
      email: res.data.response.email,
      phone: res.data.response.phone,
      found: 'found'
    })
   // console.log(res)
    if(res.data.response.firstname){this.setState({found: 'found'})}
    else{this.setState({found: null})}
    if (res.data.response.src){ this.setState({ checkerImg: true})}
  })
    .catch(err => {toast.error("Couldn't Get Data, Please Try Again.")})
  }


userN = (ev) => {
         let name = ev.target.value;
         this.setState({firstName:name}); 
}
lastN = (ev) => {
  let name = ev.target.value;
  this.setState({lastName:name}); 
}
pword = (ev) => {
          let password = ev.target.value;
          this.setState({password});
}

email = (ev) => {
  let email = ev.target.value;
  this.setState({email});
}
phoneU = (ev) => {
  let phone = ev.target.value;
  this.setState({phone});
}
// img upload

filer = (ev) => {
  //console.log(ev.target)
  this.setState({
    checkerImg: "loading"
  })
  toast.info("Loading,please wait for preview before clicking 'Update' button...")
  let file = ev.target.files[0]
  if(file.size > 5000 * 5000 * 5) {
    this.setState({err: "Image Size Too Large"})
  } else{
    this.setState({
      img: ev.target.files[0]
    })
    this.setState({checker: true})
   setTimeout(() => {
    const uploadFile = (file, signedRequest, url) => {
      axios.put(signedRequest, file)
      .then(() => this.setState({
        src: url,
        checkerImg: true
      }))
      .catch(() => toast.error('could not upload image, please try again'))
      // const xhr = new XMLHttpRequest();
      // xhr.open('PUT', signedRequest);
      // xhr.onreadystatechange = () => {
      //   if(xhr.readyState === 4){
      //     if(xhr.status === 200){
      //      this.setState({
      //        src: `${url}`
      //      })
      //      this.setState({
      //        checkerImg: true
      //      })
      //     }
      //     else{
      //       alert('Could not upload image.');
      //     }
      //   }
      // };
      // xhr.send(file);
    }
  


    axios.post(`/sign-s3?file-name=${this.state.img.name}&file-type=${this.state.img.type}`)
  .then((res) => {
    //console.log(res)
    const response = res.data
  uploadFile(this.state.img, response.signedRequest, response.url);
  })
   }, 2000)
  }
}
click = (ev) => {
  ev.preventDefault();
}
submit = (ev) => {
  ev.preventDefault();
  let data = new FormData()
  // if(this.state.img){
  //   data.append('categoryImage', this.state.img)
  //   data.append('filename', this.state.img.name)
  // }
  data.append('src', this.state.src)
  data.append('userID', this.props.match.params.id)
  data.append('firstname', this.state.firstName)
  data.append('lastname', this.state.lastName)
  data.append('email', this.state.email)
  data.append('phone', this.state.phone)
  
  let user = {
      userID: this.props.match.params.id,
      firstname: this.state.firstName,
      lastname: this.state.lastName,
      token: this.state.token,
      email: this.state.email,
      phone: this.state.phone,
      src: this.state.src
      
  }
  if(user.firstname.trim() == "" || user.lastname.trim() == "" || user.email.trim() == "")
  {
    toast.error('Please All Fields Are Required');
    this.setState({err: 'Please All Fields Are Required'})
    return false
  }

  else{

  
    toast.success("Loading Please wait")

    axios.post('/profiles/updateone', user, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      }
    })
  .then((res) =>{
   if(res.data.error){
    toast.error('Update failed, please try again')
       return
     };
    
   this.props.history.replace(`/setup/${this.props.match.params.id}`)
  })
  .then((res) => {toast.success('Update Successful')})
  
  .catch(err => {toast.error('Update Failed, Please Try Again. '+ err)})
     return true
  
  }

}

render() {
      const upload = {userID: this.props.match.params.id,files: this.state.files}
        return (
            <div>
              <Header  id={this.props.match.params.id} />
              <Container className="profile-div">
              {this.state.found === null && <Spinner className="spinner" color="primary" size="lg"/> || this.state.found === "found" && 
                <div>
                  <br/><br/>
                  <br/><br/>
              <h1>Update Your Profile</h1>
              <FontAwesomeIcon icon={faUser} size='lg'></FontAwesomeIcon>
              <Form onSubmit={this.submit}>
              <br/>
                {/* <img  */}
                <label><h6>Profile Picture</h6></label>
                
                  <input type='file' onChange={this.filer} accept="image/*" />

                  <div className="img-card">
                  <h6>Preview</h6>
                  {this.state.checkerImg && <img src={this.state.src} className="setupimg" /> || this.state.checkerImg === null && <FontAwesomeIcon icon={faUser} size='lg'></FontAwesomeIcon> || this.state.checkerImg === "loading" && <div className="spin">  <Spinner color="primary" className="spinner" size="sm"/> </div>  }
                  </div>

                  <br/>
                  <br/>
                <label for="username"><h6> Enter First Name.</h6></label>
                  <input type="name" name="firstname" onChange={this.userN} value={this.state.firstName} className="form-control" />

                  <label for="username"><h6> Enter Last Name.</h6></label>
                  <input type="name" name="lastname" onChange={this.lastN} value={this.state.lastName} className="form-control" />

                  <label for="email"><h6>Email Adress</h6></label>
                  <input type="email" name="email" value={this.state.email} onChange={this.email} className="form-control" />

                  <label for="phone"><h6>Phone</h6></label>
                  <input type="tel" name="phone" value={this.state.phone} onChange={this.phoneU} className="form-control" />

                  
                            <br></br>
                  
                  <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded,2)}%</Progress>
                 
                  <br/>
                  <button className="btn btn-success">Update</button>
                  <ToastContainer />

              </Form>
              <br/>
              <br/>
              <br/>
              </div>
                }
              </Container>

              <Footer id={this.props.match.params.id} />
            </div>
          );
    }
}

export default Profile;