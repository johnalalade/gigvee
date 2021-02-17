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
import Moment from 'react-moment';

const picker = Math.round((Math.random() * 10) + 1)
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
  
  return(
    <div>
         <div className="card-bg">
         <div className="c-top">
           <div>
           <h6>Store: {prop.storeName}</h6>
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
              <a className="btn btn-primary form-control" onClick={det}><FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon> Visit</a>
           </div>
           <p>Comments({prop.comments.length})</p>
        <p className="comment">{prop.comments[0] && prop.comments[0] || "No comment on this product yet"}</p>
        <div className="commenting">
          <textarea type="text" name="comment" placeholder="comment on this product..." onChange={
            (ev) => {
              let comment = ev.target.value;
              setComment(comment);
            }} value={comment} className="form-control" ></textarea>                        
             <button className="btn btn-warning" onClick={commenter}>comment</button>
        </div>
          <div className="add">
            <hr/>
          <h6 align="center">Address: {prop.address}</h6>
           <hr/>
          </div>
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
      products: null,
      id: localStorage.getItem('id')
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
 
  if(difference_In_Days >= 10){
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
  return u.owner !== this.state.id
}
// distancer
distancer = (c) => {
  var dista = distance(this.state.long1, this.state.lat1, c.location.longitude, c.location.latitude);
  c.distance = dista;
  return c.distance
 }
// sort
customSort = (a,b) => {
  var date1 = new Date(a.createdAt)
  var date2 = new Date(b.createdAt)

  if(picker % 2 === 0){
  if(a.distance > b.distance) return 1;
  if(a.distance < b.distance) return -1;
  }
  else if(picker % 2 !== 0){
    if(date1.getTime() > date2.getTime()) return -1;
  if(date1.getTime() < date2.getTime()) return 1;
  }
  return 0;
}
// commentFixer = (d) => {
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
    //  .then(info => {
    //   info.forEach(this.commentFixer)
    //   return info
    // })
    // .then(conclusion => conclusion.filter(this.customfilter))
    .then(data => {
      
      if(data[0]){this.setState({products: data,
    found: "done"})}
    else{
      toast.dark('Sorry, No Product Found')
      this.setState({products: data,
        found: null})
    }
    })
    
    .catch(err => {
      toast.error("Couldn't Get Data, Please Try Again."+ err)
      this.setState({found: null})})
    
    // axios.post('/store/search', search)
    // .then((res)=>this.setState((prev)=> {products: [...prev, res]}))
  }

  render(){ 
    const deta = (id) => {
      localStorage.setItem('id2', id)
      this.props.history.push(`/details?gigvee=true&product=1`);
    }
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
      <div className="search-card-div">
         {this.state.products.map((product)=>
        
         <div>
         
          <Cards key={product._id} createdAt={product.createdAt} storeName={product.storename}
                 productName={product.productName} img={product.src}
                 productDescription={product.productDescription}
                 deta={deta} comm={comm} address={product.location.address}
                 comments={product.comments} owner={product.owner} id={product._id}/>
                 </div>
                 
           
                
         )}
         </div>
      //   </Col>

      //  </Row> 
         }
      <ToastContainer />
      <Footer id={this.state.id} />
    </div>
  );
  }
}

export default Search;
