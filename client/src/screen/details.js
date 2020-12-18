import React, {Component,useState} from 'react';

import Header from './header';
import Footer from './foot';
import './style.css';


import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faWhatsapp, faGooglePlusG} from '@fortawesome/free-brands-svg-icons';


import {Spinner} from 'reactstrap';    

import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';

const key = "AIzaSyDSTTGy28qjqJ5woegTBYAroJeL0zE6t4g"
const libraries = ["places"];
const mapContainerStyle = {
    height: "340px", 
    width: "100%"
  }

const options ={
    disableDefaultUI: true,
    zoomControl: true,  
}


function Map(prop) {
const [info, setInfo] = useState(false)
const [info1, setInfo1] = useState(false)

  const center = {
    lat: prop.lat,
    lng: prop.lng
  }
  const {isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDSTTGy28qjqJ5woegTBYAroJeL0zE6t4g",
    libraries,
  });
  if(loadError) return (<h6 align="center">Error Loading Map, Check your connection</h6>)
  if(!isLoaded) return (<div>
    <h6 align="center">Loading Maps</h6>
     <div className="spin"> <Spinner color="primary" className="spinner" size="lg"/>
                          </div>
                          </div>)
  return(
     <GoogleMap 
        zoom={18}
        center={center}
        mapContainerStyle={mapContainerStyle}
       // options={options}
        >
          {/* one */}
          <Marker icon={{
            url: "/blue.png",
            scaledSize: new window.google.maps.Size(50,50),
            origin: new window.google.maps.Point(0,0),
            anchor: new window.google.maps.Point(30,52)
          }} 
          position={{lat: prop.lat1,lng: prop.lng1}}
          onClick={() => {
            setInfo1(true)
          }} />

        {info1? (
        <InfoWindow
         position={{lat: prop.lat1,lng: prop.lng1}}
         onCloseClick={() => {setInfo1(false)}}
         >
            <div>
              <h6>You</h6>
            </div>
          </InfoWindow>) : null}
         
          {/* two */}
          <Marker position={{lat: prop.lat,lng: prop.lng}} 
          onClick={() => {
            setInfo(true)
          }}/>

          {info? (
          <InfoWindow 
          position={{lat: prop.lat,lng: prop.lng}}
          onCloseClick={() => {setInfo(false)}}
          >
            <div>
              <h6>Store</h6>
              <p>{prop.address}</p>
            </div>
          </InfoWindow>) : null}
         
          
          
    </GoogleMap>
  );
}



const distance = (long1, lat1, long2, lat2) => {

  const toRadians = (num) => {
    let constant = Math.PI / 180;
    return (constant * num)
  }

  long1 = toRadians(long1); 
  long2 = toRadians(long2); 
  lat1 = toRadians(lat1); 
  lat2 = toRadians(lat2);

 const dlong = long2 - long1;  
 const dlat = lat2 - lat1; 

 const anss = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlong / 2),2);
 
 const c = 2 * Math.asin(Math.sqrt(anss));

 // Radius of earth in kilometers. Use 3956  
 // for miles 
  const ra = 6371; 
  
 const conclu = c * ra
 return(Math.round(conclu));

}

// const detailId = this.props.match.params.id;

const Cards = (prop, {location}) => {
  const [comment, setComment] = useState('');

  const commenter = (ev) => {
    ev.preventDefault();
    prop.commentsHandler(comment);
  }
//  const distanceCall = () => distance(prop.long1, prop.lat1, prop.long2, prop.lat2)
  
  // const enq = (ev) => {
  //   ev.preventDefault();
  //   prop.enq();
  // }
  // const book = (ev) => {
  //   ev.preventDefault();
  //   prop.book();
  // }
 let subject = 'GigVee Order'
  return(
     <div>
         <div className="card-bg">
           <div>
           <h6>{prop.storeName}</h6>
             <h5>Product Name: {prop.productName}</h5>
           </div>
           <img width="100%" src={prop.img} alt="prod" />
           <div>
           <hr/>
           <p>Description</p>
             <h6 className="desc">{prop.productDescription}</h6>
            <hr/>
             <p>Contact</p>
            <a className="enq" target="_blank" href={`https://wa.me/${prop.phone}?text=${prop.message}`}  className="btn btn-success" > <FontAwesomeIcon icon={faWhatsapp} size="lg"></FontAwesomeIcon> Whatsapp</a> 
            
            <a className="enq" target="_blank" href={`mailto:${prop.email}?subject=${subject}&body=${prop.message}`} className="btn btn-danger" > <FontAwesomeIcon icon={faGooglePlusG} size="lg"></FontAwesomeIcon> Mail</a>
            <hr/>
           
            </div>
           {/* <CardFooter className="text-muted">{prop.comments}</CardFooter>
          <CardFooter><input type="text" name="comment" placeholder="write a comment" 
          onChange={ (ev) => {let comment = ev.target.value;
                     setComment(comment); }} 
                     value={comment} 
                     className="form-control" />
                         <Button onClick={commenter}>comment</Button>
          </CardFooter> */}
          <div>
          <div className="add">
            <hr/>
                <h6 align="center">Address: {prop.address}</h6>
                <h6 align="center">Distance: {prop.dis}KM</h6>
            <hr/>
          </div>
                <Map lat1={prop.lat1}
                lng1={prop.lng1}
                 lat={prop.lat2}
                 lng={prop.lng2}
                 address={prop.address}/>
          </div>
          <p>Red icon: shows store location</p>
          <p>Blue icon(from pngtree): shows your location.</p>
          <ToastContainer />
         </div>
         <br></br>
     </div>    
  );
}


class Details extends Component {
  // recieve both store id and user id
  constructor(props){
    super(props);
    this.state = {
      product: null,
      lat1: '',
      long1: '',
      book: '',
      note: '',
    }
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    // this.reverseGeocodeCoordinates = this.reverseGeocodeCoordinates.bind(this);
  }
  // distancer
distancer = (c) => {
  var dista = distance(this.state.long1, this.state.lat1, c.location.longitude, c.location.latitude);
  c.distance = dista;
  return c.distance
 }

  componentDidMount(){
    this.getLocation()
    

    let id = {productID: this.props.match.params.id2}
   
    axios.post('/products/showone', id)
    .then((data) => {
      this.distancer(data.data.response)
      return data.data.response})
    .then(data => {this.setState({product: data})})
    // .then(res => console.log(this.state.product))
    .catch(err => {toast.error("Couldn't Get Data, Please Try Again."+ err)})
  }


getLocation(ev) {
  
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
  } else {
    alert('goelocation is not supported by this browser.');
  }
}
getCoordinates(position) {
  // console.log(position);
  this.setState({
      long1: position.coords.longitude,
      lat1: position.coords.latitude
  })
  // latitude = position.coords.latitude;
  // longitude = position.coords.longitude
  // this.reverseGeocodeCoordinates();
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


  render(){

    
    
    
      // notification & bookmark
    // const enq = (ev) => {

    //   this.setState({
    //     book: this.props.match.params.id
    //   })
    //   this.setState({
    //     note: this.props.match.params.id2
    //   })
    //   let note = {
    //     userID: this.state.note,
    //     notification: this.state.book}
     
    //   axios.post('/profiiles/updateone', note) 
     
    // } 
    
    // book
    // const book = () => {

    //   this.setState({
    //     book: this.props.match.params.id
    //   })
      
    //   this.setState({
    //     note: this.props.match.params.id2
    //   })

    //   let book = {
    //     userID: this.props.match.params.id,
    //     bookmark: this.props.match.params.id2
    //   }

    //    axios.post('/profiles/updateone', book)
    //    .then((res) => {toast.success('Bookmark Successful')})
    //    .catch(err => {toast.error('Bookmark Failed, Please Try Again.'+ err)})
    // }
    
    
    // comments
    const commentsHandler = (comm) => {
      console.log(comm);
      let res = {
        productID: this.props.match.params.id2,
        comment: comm}
      axios.post('/products/updateone', res)
    }
  
    return (
      <div>
      
        
           <Header  id={this.props.match.params.id} />
           <div className="home-div">

           <br></br>
             <br></br>
             <br></br>
            <div>
            <br></br>
             <br></br>
              
               {this.state.product &&
                  <Cards key={this.state.product.storename} storeName={this.state.product.storename}
                          productName={this.state.product.productName} 
                          img={this.state.product.src}
                          productDescription={this.state.product.productDescription} 
                          commentsHandler={commentsHandler}
                          dis={this.state.product.distance}
                          phone={this.state.product.phone} 
                          email={this.state.product.email} 
                          message={`Hello, I saw your store on the "GigVee" website. I want to make Enquiries about the "${this.state.product.productName}" you posted. 
                          
                          Product name: ${this.state.product.productName}
                          Description: ${this.state.product.productDescription}`}
                          comments={this.state.product.comments} 
                          id={this.state.product.id} 
                         lat2={this.state.product.location.latitude}
                         lng2={this.state.product.location.longitude}
                         address={this.state.product.location.address}
                          lat1={this.state.lat1}
                          lng1={this.state.long1}/> || <div className="spin"> <Spinner color="primary" className="spinner" size="lg"/>
                          </div>
               }
              </div>
             
             <br></br>
             <br></br>
             <br></br>
           </div>
           <br/><br/>
             <br/><br/>
           <Footer id={this.props.match.params.id}/> 
      </div>
    );
  }
  
}


export default Details;
