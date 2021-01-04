import React, { Component } from 'react';
import Header from '../header';
import Footer from '../foot';
// import MyStoreDis from './mystoredis';
import './setup.css';
import {Spinner} from 'reactstrap'
import {Form, Container, Progress} from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faGift, faGifts } from '@fortawesome/free-solid-svg-icons';
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


const key = process.env.REACT_APP_GOOGLE_API_KEY

class AddStock extends Component {
    constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      src: null,
      checker: null,
      checkerImg: null,
      storename: '',
      stockName: "",
      stockDescription: "",
      stockImg: null,
      storetype: "",
      location: {
        longitude: 0,
        latitude: 0,
        address: ''
      },
      phone: '',
      email: '', 
      err: '',
      loaded: 0,
      loaded2: 0
    }
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.reverseGeocodeCoordinates = this.reverseGeocodeCoordinates.bind(this);  
}

componentDidMount(){
  if(!localStorage.getItem('token')){
    this.props.history.replace(`/login`);
  }
  let user = {storeID:  this.props.match.params.id, token: this.state.token} 
  
  axios.post('/store/showone', user)
 
  .then((data)=> { this.setState({
    
    storename: data.data.response.storename,
    storetype: data.data.response.storeType,
    phone: data.data.response.phone,
    email: data.data.response.email,
    location: {
      longitude: data.data.response.location.longitude,
      latitude: data.data.response.location.latitude,
      address: data.data.response.location.address
    }
  })})
  .catch(err => {toast.error("Couldn't Get  Store Data, Please Try Again.")})
}

storeN = (ev) => {
  let name = ev.target.value
  this.setState({stockName: name})
}
storeDescription = (ev) => {
  let description = ev.target.value
  this.setState({stockDescription: description})
}
filer = (ev) => {
  //console.log(ev.target)
  this.setState({
    checkerImg: "loading"
  })
  toast.info("Loading,please wait for preview before clicking 'Add' button...")
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
      axios.put(signedRequest, file, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded2: (ProgressEvent.loaded / ProgressEvent.total*100),
          })
        }
      })
      .then(() => this.setState({
        src: url,
        checkerImg: true
      }))
      .catch(() => toast.error('could not upload image, please try again'))
      
    }
    axios.post(`/sign-s3?file-name=${this.state.img.name}&file-type=${this.state.img.type}`)
  .then((res) => {
    //console.log(res)
    const response = res.data
  uploadFile(this.state.img, response.signedRequest, response.url);
  })
   }, 100)
  }
}

click = (ev) => {
  ev.preventDefault()
}
submit = (ev) => {
  ev.preventDefault();
  toast.success('Loading,  please wait...');
  let data = new FormData()
  // if(this.state.stockImg){
  //  data.append('categoryImage', this.state.stockImg)
  // data.append('filename', this.state.stockImg.name)
  // }
  data.append('src', this.state.src)
  data.append('owner', this.props.match.params.id)
  data.append('storename', this.state.storename)
  data.append('storetype', this.state.storetype)
  data.append('productname', this.state.stockName)
  data.append('productDescription', this.state.stockDescription)
  data.append('longitude', this.state.location.longitude)
  data.append('latitude', this.state.location.latitude)
  data.append('address', this.state.location.address)
  data.append('email', this.state.email)
  data.append('phone', this.state.phone)

  let stock = {
    src: this.state.src,
    owner: this.props.match.params.id,
    storename: this.state.storename,
    storetype: this.state.storetype,
    productname: this.state.stockName,
    productDescription: this.state.stockDescription,
    longitude: this.state.location.longitude,
    latitude: this.state.location.latitude,
    address: this.state.location.address, 
    token: this.state.token,
    phone: this.state.phone,
    email: this.state.email,
    comments: '',
    i: this.state.stockImg,
    
  }
  
  if(stock.productname.trim() === "" || stock.productDescription.trim() === "" || stock.address == '')
  {
    toast.error('Please All Fields Are Required, Including Location');
    this.setState({err: 'Please All Fields Are Required'})
    return false
  }
  if(this.state.src === null ){
    this.setState({err: 'An Image Is Required'})
    toast.error('An Image Is Required')
    return false
  }
  else {
    if(this.state.src){
      
    axios.post('/products/addone', stock, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      }
    })
    .then((res) => {
      if(res.data.error){
        toast.error('Store creation failed, please try again')
           return
         };
      toast.success('Product Add Successfully')})
  .then(() => this.props.history.replace(`/mystore/${this.props.match.params.id}`))
  .catch(err => {toast.error("Upload Failed, Please Try Again. Don't Forget To  Add An Image.")})
  return true
    }
  }
  
}


getLocation(ev) {
  ev.preventDefault();
  toast.success("getting location information, please wait...")
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
  } else {
    alert('goelocation is not supported by this browser.');
  }
}
getCoordinates(position) {
  // console.log(position);
  this.setState({
    location: {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }
  })
  // latitude = position.coords.latitude;
  // longitude = position.coords.longitude
  this.reverseGeocodeCoordinates(position);
}
handleLocationError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("Please Allow Request For Geolocation.")
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location Information Is Unavailable At The Moment, Please Check Data Connection And Try Again.")
      break;
    case error.TIMEOUT:
      alert("The request to get location timed out. Please try again.")
      break;
    case error.UNKNOWN_ERROR:
      alert("An Unknown Error Occurred.")
      break;
    default:
      alert("An Unknown error Occured.")
  }
}

reverseGeocodeCoordinates(position) {
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.location.latitude},${this.state.location.longitude}&sensor=false&key=AIzaSyDSTTGy28qjqJ5woegTBYAroJeL0zE6t4g`)
  .then(result => {this.setState({
    location: {
      address: result.data.results[0].formatted_address,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }
  })})
  .catch(error => {alert(error); toast.error("Couldn't Get Data, Please Try Again")})
}


render() {

    return(

        <div>
          <Header  id={this.props.match.params.id} />
        <Container className="addstock-div">
          <br/> <br/>
          <br/>
          {this.state.storename && <div>
          <h1>Add Product</h1>
          <FontAwesomeIcon icon={faGift} size='lg'></FontAwesomeIcon>
          
        <Form onSubmit={this.submit}>
        <h3 className="err">{this.state.err}</h3>
        <label><h6>Image</h6></label>
        <br/>
       
        <input type='file' onChange={this.filer} accept="image/*" />
                  
        <div className="img-card">
                  <h6>Preview</h6>
                  {this.state.checkerImg && <img src={this.state.src} className="setupimg" /> || this.state.checkerImg === null && <FontAwesomeIcon icon={faGifts} size='lg'></FontAwesomeIcon> || this.state.checkerImg === "loading" && <div className="spin">  <Spinner color="primary" className="spinner" size="sm"/> </div>  }
              </div>
              
              <br/>
                  <Progress max="100" color="success" value={this.state.loaded2}>{Math.round(this.state.loaded2,2)}%</Progress>

                  <br/>
                  <br/>
        <br/>
                <label><h6>Product Name</h6></label>
                  <input type="name" name="stockName" placeholder="Classical Guitar..." onChange={this.storeN} value={this.state.stockName} className="form-control" />
        <br/>
                  <label><h6>Description</h6></label>
                  <textarea col="30" row="40" name="stockDescription" placeholder="Quantity, size, price,.... " onChange={this.storeDescription} value={this.state.stockDescription} className="form-control" ></textarea>
        <br/>
                 
                  
        <br/>
                   <h4>Address: {this.state.location.address}</h4>
        <br/>
                  <h4>Do you wish to use Current Location instead?</h4>
        <br/>
                  {/* <Progress max="100" color="success" value={this.state.loaded2}>{Math.round(this.state.loaded2,2)}%</Progress> */}
                  <button onClick={this.getLocation} className="btn btn-primary form-control">Get Current Location</button>

                            <br></br>
                            <br></br>
                  <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded,2)}%</Progress>
                  <br/>
                  <button className="btn btn-success form-control">Add</button>
                  <ToastContainer />
              </Form>
               </div>
                     || <div className="spin"> <Spinner className="spinner" color="primary" size="lg"/> </div>}
              <br></br>
              <br></br>
              </Container>
              <Footer id={this.props.match.params.id} />
     </div>
    );
}
}

export default AddStock;