import React, {Component,useState} from 'react';

import Header from './header';
import Footer from './foot';
import './style.css';


import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faWhatsapp, faGooglePlusG} from '@fortawesome/free-brands-svg-icons';

import Moment from 'react-moment';
import {Spinner} from 'reactstrap';    

import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';

const key = process.env.REACT_APP_MAPS_KEY
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
    googleMapsApiKey: process.env.REACT_APP_MAPS_KEY,
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

  const commenter = () => {
    if (comment.trim() === '') {
      return
    }
    else {
      prop.comm(comment, prop.id)
      prop.comments.unshift(comment)
      setComment('')
    }

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
         <br/>
         <div className="c-top">
           <div>
           <h6>{prop.storeName}</h6>
             <h5 className="h-h5">Product Name: {prop.productName}</h5>
           </div>
           <Moment className="datetime" fromNow>{prop.createdAt}</Moment>
           </div>
           <img width="100%" src={prop.img} alt="prod" className="product-img"/>
           <div>
           <hr/>
           <p>Description</p>
             <h6 className="desc">{prop.productDescription}</h6>
            <hr/>
             <p>Contact</p>
            <a className="enq" target="_blank" href={`https://wa.me/${prop.phone}?text=${prop.message}`}  className="btn btn-success" > <FontAwesomeIcon icon={faWhatsapp} size="lg"></FontAwesomeIcon> Whatsapp</a> 
            
            <a className="enq" target="_blank" href={`mailto:${prop.email}?subject=${subject}&body=${prop.message1}`} className="btn btn-danger" > <FontAwesomeIcon icon={faGooglePlusG} size="lg"></FontAwesomeIcon> Mail</a>
            <hr/>
           
            </div>
            <p>Comments({prop.comments.length})</p>
            {prop.comments[0] && prop.comments.slice(0,5).reverse().map(comment =>
            
            <div>
              
            <p className="comment">{comment}</p>
           
            </div>
            
           
              )
            || "No comments on this product yet"}
        
        <div className="commenting">
          <textarea type="text" name="comment" placeholder="comment on this product..." onChange={
            (ev) => {
              let comment = ev.target.value;
              setComment(comment);
            }} value={comment} className="form-control" ></textarea>                        
             <button className="btn btn-warning" onClick={commenter}>comment</button>
        </div>
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
      token: localStorage.getItem('token'),
      product: null,
      lat1: '',
      long1: '',
      book: '',
      note: '',
      id: localStorage.getItem('id'),
      id2: localStorage.getItem('id2')
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

//  commentFixer = (d) => {
//   axios.post('/store/showone', { token: this.state.token, storeID: d.owner })
//     .then(data => {
//       d.comments = [...data.data.response.comments]
//       return d
//     })
//     .catch(err => {
//       d.comments = ['No comments on this store']
//       return d
//     })
// }

  componentDidMount(){
    if(!localStorage.getItem('token')){
      this.props.history.replace(`/login`);
    }
    this.getLocation()
    

    let id = {productID: this.state.id2, token: this.state.token}
   
    axios.post('/products/showone', id)
    .then((data) => {
      this.distancer(data.data.response)
      return data.data.response})
      // .then(info => {
      //   this.commentFixer(info)
      //   return info
      // })
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
    const comm = (comment, id) => {
      let comm = {
        token: this.state.token,
        productID: id,
        comment: comment
      }
      axios.post('/products/comment', comm)
        .then(() => toast.success("Comment added"))
        .catch((err) => toast.error("Comment error " + err))
    }
  
    return (
      <div>
      
        
           <Header  id={this.state.id} />
           <div className="home-div">

          
            <div>
            <br></br>
             <br></br>
              
               {this.state.product &&
                  <Cards key={this.state.product.storename} createdAt={this.state.product.createdAt} storeName={this.state.product.storename}
                          productName={this.state.product.productName} 
                          img={this.state.product.src}
                          productDescription={this.state.product.productDescription} 
                          dis={this.state.product.distance}
                          phone={this.state.product.phone} 
                          email={this.state.product.email} 
                          message1={`Hello, I saw your store on the "GigVee" website. I want to make Enquiries about the "${this.state.product.productName}" you posted.
                          
                          Product Name: ${this.state.product.productName}

                          
                          Description: ${this.state.product.productDescription}
                          `}

                          message={`Hello, I saw your store on the *GigVee* website. I want to make Enquiries about the *${this.state.product.productName}* you posted.
                          


                          *Product Name:* ${this.state.product.productName}
                          *Description:* ${this.state.product.productDescription}
                          `}
                          comments={this.state.product.comments} 
                          id={this.state.product._id} 
                         lat2={this.state.product.location.latitude}
                         lng2={this.state.product.location.longitude}
                         address={this.state.product.location.address}
                         comm={comm}  comments={this.state.product.comments}
                          lat1={this.state.lat1} owner={this.state.product.owner}
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
           <Footer id={this.state.id}/> 
      </div>
    );
  }
  
}


export default Details;
