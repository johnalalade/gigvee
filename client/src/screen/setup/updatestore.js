import React, { Component } from 'react';
import Header from '../header';
import Footer from '../foot';
import './setup.css';
import {Form, Container, Progress, Spinner} from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




const key = process.env.REACT_APP_GOOGLE_API_KEY
class UpdateStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null,
      storeName: "",
      storeType: "",
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
      found: null,
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.reverseGeocodeCoordinates = this.reverseGeocodeCoordinates.bind(this);
  }

  componentDidMount() {
    let id = {storeID: this.props.match.params.id}
    axios.post('/store/showone', id)
    .then((res) => {this.setState({
      
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
      found: 'found'
    })
   
    if(res.data.response.storename){this.setState({found: 'found'})}
    else{this.setState({found: null})}}
    )
    .catch((err) => {
      toast.error('Failed To Get Data, Please Try Again'+ err)
      this.setState({found: null})
    })
  }


storeN = (ev) => {
         let name = ev.target.value;
         this.setState({storeName: name}); 
}
storeType = (ev) => {
          let storeType = ev.target.value;
          this.setState({storeType});
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
 // console.log(ev.target)
 let file = ev.target.files[0]
  if(file.size > 5000 * 5000 * 5) {
    toast.error('Image Size Too Large')
    this.setState({err: "Image Size Too Large"})
  } else{
    this.setState({
      img: ev.target.files[0]
    })
  }
  
}

click = (ev) => {
  ev.preventDefault();
}
submit = (ev) => {
  ev.preventDefault();
  toast.success('Loading,  please wait');
  let data = new FormData()
  if(this.state.img){
    data.append('categoryImage', this.state.img)
    data.append('filename', this.state.img.name)
  }
  data.append('storeID', this.props.match.params.id)
  data.append('storename', this.state.storeName)
  data.append('storetype', this.state.storeType)
  data.append('storedescription', this.state.storeDescription)
  data.append('longitude', this.state.location.longitude)
  data.append('latitude', this.state.location.latitude)
  data.append('address', this.state.location.address)
  data.append('email', this.state.email)
  data.append('phone', this.state.phone)
  

  let store = {
    storeID: this.props.match.params.id,
    avatar: this.state.img,
    storename: this.state.storeName,
    storetype: this.state.storeType,
    storedescription: this.state.storeDescription,
    location: {
      longitude: this.state.location.longitude,
      latitude: this.state.location.latitude,
      address: this.state.location.address,
    },
    email: this.state.email,
    phone: this.state.phone,
    data 
  }

  if(store.storename.trim() == "" || store.storedescription.trim() == "" || store.storetype.trim() == "" || store.email.trim() == "" || store.location.address == '')
  {
    this.setState({err: 'Please All Fields Are Required'})
    return false
  }
 
  else {
    axios.post('/store/updateone', data, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      }
    })
  
  .then((res) =>{
   this.props.history.replace(`/mystore/${this.props.match.params.id}`)})
    .then((res) => {toast.success('Update Successful')})
  .catch(err => {toast.error("Update Failed, Please Try Again. Don't Forget To Add An Image")})
  return true
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
  .then(result => {
    // console.log(this.state.location.latitude);
    this.setState({
    location: {
      address: result.data.results[0].formatted_address,
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    }
  })})
  .catch(error => toast.error("Couldn't Get Data, Please Try Again"))
}


    render() {
        return (
          
            <div>
              <Header  id={this.props.match.params.id} />
              <Container className="store-div">
                {this.state.found === null && <div className="spin"> <Spinner className="spinner" color="primary" size="lg"/> </div>|| this.state.found === "found" && 

                  <div>
                     <br/> <br/>
                <h1>Update Your Store</h1>
                <br/>
                
                <FontAwesomeIcon icon={faStore} size='lg'></FontAwesomeIcon>
              <Form onSubmit={this.submit}>
              <label><h6>Logo</h6></label>
              <br/>
              
              <input type='file' onChange={this.filer} accept="image/*" /> 
                  <br/>
                  <br/>
              
              <h3 className="err">{this.state.err}</h3>
                <label><h6>Store Name</h6></label>
                  <input type="name" name="storename" placeholder="BMAC..." onChange={this.storeN} value={this.state.storeName} className="form-control" />

                  <label><h6>Store Type</h6></label>
                  <input type="text" name="storetype" onChange={this.storeType} value={this.state.storeType} placeholder='e.g Music' className="form-control" />

                  <label><h6>Description</h6></label>
                  <textarea col="30" row="40" name="storeDescription" placeholder="We Train/Sell Musical instrument" onChange={this.storeDescription} value={this.state.storeDescription} className="form-control" ></textarea>

                  <label><h6>Email Adress</h6></label>
                  <input type="email" placeholder="businessemail@email..." name="email" value={this.state.email} onChange={this.email} className="form-control" />
                  <br/>
                  <h6>Phone(whatsapp number)<br/><p>please add your country code</p></h6>
                  <input type="tel" name="phone" placeholder="e.g +2349000000000" value={this.state.phone} onChange={this.phoneU} className="form-control" />
                 
                 
                  <label>Location</label>
                  {this.state.location.address && <h4>Store Address: {this.state.location.address}</h4>}

                  {/* <Progress max="100" color="success" value={this.state.loaded2}>Getting Current Location{Math.round(this.state.loaded2,2)}%</Progress> */}

                  <button onClick={this.getLocation} className="btn btn-primary form-control">Get Current Location</button>
                            <br></br>
                            <br></br>
                  {this.state.loaded &&
                  <Progress max="100" color="success" value={this.state.loaded}>{Math.round(this.state.loaded,2)}%</Progress>
                 }
                  <br/>
                 <button className="btn btn-success" block={true}>Update</button>
                  <ToastContainer />
          
              </Form>
              <br/> <br/>
              </div>
               }
              </Container>
          
              <Footer id={this.props.match.params.id} />
            </div>
           
          );
    }
}

export default UpdateStore;