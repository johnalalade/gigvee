import React, {Component, useState} from 'react';
import Header from './header';
//import {Redirect} from 'react-router-dom'
import axios from 'axios';
import './style.css';
// import '/Users/user/Desktop/bro AY/exploits/backend/uploads';

import { Spinner} from 'reactstrap';
// import CardFooter from 'reactstrap/lib/CardFooter';
// import Row from 'reactstrap/lib/Row';
// import Col from 'reactstrap/lib/Col';

import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from './foot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartPlus } from '@fortawesome/free-solid-svg-icons';


const Placeholder = () => {
  return(
    <div>
      <br/>
      <br/>
      
      <FontAwesomeIcon icon={faSearch} className="search-wait"></FontAwesomeIcon>
      
      </div>
  )
}

const Cards = (prop) => {
  const [comment, setComment] = useState('');
 const det = (ev) => {
    prop.deta(prop.id);
  }
  
  return(
    <div>
         <div className="card-bg">
           <div>
           <h6>Store: {prop.storeName}</h6>
             <h5>Product Name: {prop.productName}</h5>
           </div>
           <img width="100%" src={prop.img} alt="prod" />
           <div>
             <hr/>
             <p>Description</p>
             <h6 className="desc">{prop.productDescription}</h6>
            <hr/>
              <a className="btn btn-primary" onClick={det}><FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon> Visit</a>
           </div>
           {/* <p className="text-muted">{prop.comments[0]}</p> */}
        {/* <input type="text" name="comment" placeholder="write a comment" onChange={
                (ev) => {let comment = ev.target.value;
                         setComment(comment); }} value={comment} className="form-control" />
                         <button onClick={() => prop.comments.unShift(comment)}>comment</button> */}
          
          <h6 className="add">Address: {prop.address}</h6>
         </div>
         <br></br>
     </div>    
  );
}

// distance
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





class Search extends Component{
  constructor(){
    super();
    this.state= {
      token: localStorage.getItem('token'),
      search: "",
      found: null,
      long1: '',
      lat1: '',
      products: null
    }
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.distancer = this.distancer.bind(this);
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
// dateChecker
dateChecker = (c) => {
  
  var date1 = new Date(c.createdAt);
  var date2 = new Date();

  var difference_In_Time = date2.getTime() - date1.getTime();

  var difference_In_Days = difference_In_Time / (1000 * 3600 *24)
 
  if(difference_In_Days >= 30){
    let todele = {product: c._id, token: this.state.token}
    axios.post('/products/deleteone', todele)
    return c = {owner: "delete"}
    
  }
  else{
    return c
  }
}
// filter
datefilter = (k) => {
  return k.owner !== "delete"
}
// filter
customfilter = (u) => {
  return u.owner !== this.props.match.params.id
}
// distancer
distancer = (c) => {
  var dista = distance(this.state.long1, this.state.lat1, c.location.longitude, c.location.latitude);
  c.distance = dista;
  return c.distance
 }
// sort
customSort = (a,b) => {
  if(a.distance > b.distance) return 1;
  if(a.distance < b.distance) return -1;
  return 0;
}


  componentDidMount (){
    if(!localStorage.getItem('token')){
      this.props.history.replace(`/login`);
    }
    this.getLocation()
  }

  searchbox = (ev) => {
    let value = ev.target.value
    this.setState({search: value})
  }

  search = (ev) => {
    ev.preventDefault()

    this.setState({found: "searching"})

    let value = {data: this.state.search, token: this.state.token}
    if(value.data === ""){
      toast.error(`Please Type Something to search`)
      this.setState({found: null})
      return
    }

    axios.post('/products/search', value)
    .then((data) => {
      //console.log(data)
      data.data.response.forEach(this.distancer)
      return data.data.response})
    .then(ans => ans.map(this.dateChecker))
    .then(dd => dd.filter(this.datefilter))
    .then((result) => {
      result.sort(this.customSort);
      return result})
     .then((res) => {
      res.slice(0,1001)
     return res})
    // .then(conclusion => conclusion.filter(this.customfilter))
    .then(data => {this.setState({products: data,
    found: "done"}) 
    })
    
    .catch(err => {
      toast.error("Couldn't Get Data, Please Try Again."+ err)
      this.setState({found: null})})
    
    // axios.post('/store/search', search)
    // .then((res)=>this.setState((prev)=> {products: [...prev, res]}))
  }

  render(){ 
    const deta = (id) => {
      this.props.history.push(`/details/${this.props.match.params.id}/${id}`);
    }

  return (
    <div>
      <Header  id={this.props.match.params.id} />
      <br/>
      <br/>
      <div className="search-container">
      <div className="search-panel">
        <form onSubmit={this.search}>
        <input type="search" name="searchbox" placeholder="product/store name..." className="searchbox" value={this.state.search} onChange={this.searchbox} />
        <button type="submit" className="btn btn-search btn-primary"> <FontAwesomeIcon icon={faSearch} size="lg"></FontAwesomeIcon> </button>
        </form>
      </div>
      </div>
      {this.state.found === null && <div className="search-holder">
        <Placeholder /></div> || this.state.found === "searching" && <div className="spin"><Spinner className="spinner" color="primary" size="lg"/> </div> || this.state.found === "done" &&
      //  <Row className="mx-md-5">
      //   <Col>
     
         this.state.products.map((product)=>
         <div  className="home-div">
             <br></br>
         <br/><br/>
         <div>
          <Cards key={product._id} storeName={product.storename}
                 productName={product.productName} img={product.src}
                 productDescription={product.productDescription}
                 deta={deta}  address={product.location.address}
                 comments={product.comments} id={product._id}/>
                 </div>
                 <br/><br/>
             <br/><br/>
                 </div>
         )
         
      //   </Col>

      //  </Row> 
         }
      <ToastContainer />
      <Footer id={this.props.match.params.id} />
    </div>
  );
  }
}

export default Search;
