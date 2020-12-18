import React, { Component } from 'react';
import Header from '../header';
import Footer from '../foot';
import MyStoreDis from './mystoredis';
import './setup.css';
import axios from 'axios';
import {Form, Container, Progress, Spinner} from 'reactstrap';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faStore } from '@fortawesome/free-solid-svg-icons';
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
class MyStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      checker: null,
      checkerImg: null,
      img: null,
      storename: "",
      storetype: "",
      storeDescription: "",
      location: {
        longitude: 0,
        latitude: 0,
        address: "",
      },
      email: "",
      phone: "",
      id: "",
      err: '', 
      loaded: 0,
      loaded2: 0,
      found: null
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.reverseGeocodeCoordinates = this.reverseGeocodeCoordinates.bind(this);
  }

  componentDidMount() {
    let id = {storeID: this.props.match.params.id}
    axios.post('/store/showone', id)
    .then((res) => {
      //console.log(res);
      this.setState({
      src: res.data.response.src,
      storeName: res.data.response.storename,
      storeType: res.data.response.storeType,
      storeDescription: res.data.response.storeDescription,
      location: {
        longitude: res.data.response.location.longitude,
        latitude: res.data.response.location.latitude,
        address: res.data.response.location.address
      },
      email: res.data.response.email,
      phone: res.data.response.phone,
      id: res.data.response._id,
      
    });
    
   //if (res.data.response.src){ this.setState({ checkerImg: true})}
    if(res.data.response.storename){this.setState({found: 'found'})}
    // else{
    //   toast.error("You don't have a store yet. If you do check your connection and try again")

    //   this.setState({found: 'not-found', checkerImg: null})}
  } 
   )
    .catch((err) => {
      toast.error("You don't have a store yet. If you do check your connection and try again"+ err)
      toast.error(err)
      this.setState({found: 'not-found'})
      this.setState({hasAccount: false})
    })
  }


storeN = (ev) => {
         let name = ev.target.value;
         this.setState({storename:name}); 
}
storeType = (ev) => {
          let storetype = ev.target.value;
          this.setState({storetype});
}
storeDescription = (ev) => {
  let storeDescription = ev.target.value;
  this.setState({storeDescription});
}
email = (ev) => {
  let email = ev.target.value;
  this.setState({email});
}
phoneU = (ev) => {
  let phone = ev.target.value;
  this.setState({phone});
}
filer = (ev) => {
  //console.log(ev.target)
  this.setState({
    checkerImg: "loading"
  })
  toast.info("Loading,please wait for preview before clicking update button...")
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
  toast.success("Loading Please wait...")
  let data = new FormData()
  // if(this.state.img){
  //   data.append('categoryImage', this.state.img)
  //   data.append('filename', this.state.img.name)
  // }
  data.append('src', this.state.src)
  data.append('storeID', this.props.match.params.id)
  data.append('storename', this.state.storename)
  data.append('storetype', this.state.storetype)
  data.append('storedescription', this.state.storeDescription)
  data.append('longitude', this.state.location.longitude)
  data.append('latitude', this.state.location.latitude)
  data.append('address', this.state.location.address)
  data.append('email', this.state.email)
  data.append('phone', this.state.phone)

  let store = {
    storeID: this.props.match.params.id,
    storename: this.state.storename,
    storetype: this.state.storetype,
    storedescription: this.state.storeDescription,
    longitude: this.state.location.longitude,
    latitude: this.state.location.latitude,
    address: this.state.location.address,
  
    email: this.state.email,
    phone: this.state.phone,
    src: this.state.src
  }

  if(store.storename.trim() == "" || store.storedescription.trim() == "" || store.storetype.trim() == "" || store.email.trim() == "" || store.phone.trim() == "" || store.address == '')
  {
    this.setState({err: 'Please All Fields Are Required'})
    return false
  }
  // else if ( store.location.longitude.trim() == "" || store.location.latitude.trim() == "") {
  //   this.setState({err: 'Please click button to get store location'})
  //   return false
  // }
  else {
    if(this.state.src){
      
    axios.post('/store/addone', store, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      }
    })
    
  .then((result) => {
   // console.log(result)
    if(result.data.error){
      toast.error('Store creation failed, please try again')
         return
       };
    toast.success('Store Created Successfully')})
  .then(() => window.location.reload())
  .catch(err => {toast.error("Store Creation Failed, Please "+ err)})
  return true
  }
}
}


getLocation(ev) {
  toast.success("getting location information, please wait...")
  ev.preventDefault();
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
  } else {
    alert('goelocation is not supported by this browser.');
  }
}
getCoordinates(position) {
  // console.log(position, position.coords.latitude, );
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
  .then(result => this.setState({
    location: {
      address: result.data.results[0].formatted_address,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }
  }))
  
  .catch(error => {alert(error); toast.error("Couldn't Get Data, Please Try Again")})
}

    render() {
        return (
          this.state.found === null &&<div className="spin"><Spinner className="spinner" color="primary" size="lg"/> </div> || this.state.found === "found" && <MyStoreDis id={this.props.match.params.id}/> || this.state.found === 'not-found' &&
            <div>
              <Header  id={this.props.match.params.id} />
              <Container className="store-div"> 
              <br/><br/>
              <br/><br/>

             <div>
                <h1>Open A Store</h1>
                <FontAwesomeIcon icon={faStore} size='lg'></FontAwesomeIcon>

              <Form onSubmit={this.submit}>
              <label><h6>Logo</h6></label>
              <br/>
             

              <input type='file' onChange={this.filer} accept="image/*" /> 

              <div className="img-card">
                  <h6>Preview</h6>
                  {this.state.checkerImg && <img src={this.state.src} className="setupimg" /> || this.state.checkerImg === null && <FontAwesomeIcon icon={faStore} size='lg'></FontAwesomeIcon> || this.state.checkerImg === "loading" && <div className="spin">  <Spinner color="primary" className="spinner" size="sm"/> </div>  }
              </div>

                  <br/>
                  <br/>
              <h3 className="err">{this.state.err}</h3>
                <label><h6>Store Name</h6></label>
                  <input type="name" name="storename" placeholder="BMAC..." onChange={this.storeN} value={this.state.storename} className="form-control" />

                  <label><h6>Store Type</h6></label>
                  <input type="text" name="storetype" onChange={this.storeType} value={this.state.storetype} placeholder='e.g: Music' className="form-control" />

                  <label><h6>Description</h6></label>
                  <textarea col="30" row="40" name="storeDescription" placeholder="e.g: We Sell Musical Instruments" onChange={this.storeDescription} value={this.state.storeDescription} className="form-control" ></textarea>

                  <label><h6>Email Adress</h6></label>
                  <input type="email" placeholder="businessemail@email..." name="email" value={this.state.email} onChange={this.email} className="form-control" />
                <br/>
                  <h6>Phone(whatsapp number)<br/><p>please add your country code</p></h6>
                  <input type="tel" name="phone" placeholder="e.g +2349000000000" value={this.state.phone} onChange={this.phoneU} className="form-control" />

                 <br/>
                  
                  <label>Location</label>
                  {this.state.location.address && <h4>Store Address: {this.state.location.address}</h4>}
                  <br/>
                  {/* <Progress max="100" color="success" value={this.state.loaded2}>Getting Current Location{Math.round(this.state.loaded2,2)}%</Progress> */}
                  <button onClick={this.getLocation} className="btn btn-primary form-control">Get Current Location</button>
                            <br></br>
                            <br></br>
                  <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded,2)}%</Progress>
                  <br/>
                 
                  <button className="btn btn-success">Save</button>
                  <ToastContainer />
          
              </Form>
              </div>
                  
              
              <br/><br/><br/>
            
              </Container> 
          
              <Footer id={this.props.match.params.id} />
            </div>
        
           
          );
    }
}

export default MyStore;