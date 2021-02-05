import React, { useState, Component } from 'react';
import Header from './header';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './style.css';
import axios from 'axios';


import Footer from './foot';
import { Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import Moment from 'react-moment';



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
      prop.comm(comment, prop.owner)
      prop.comments.unshift(comment)
      setComment('')
    }

  }

  return (
    <div>

      <div className="card-bg">
        <br />
        <div className="c-top">
          <div>
            <h6>Store: {prop.storeName}</h6>
            <h5 className="h-h5">Product Name: {prop.productName}</h5>
          </div>
          <Moment className="datetime" fromNow>{prop.createdAt}</Moment>
        </div>
        <img width="100%" src={prop.img} alt="prod" />
        <div>
          <hr />
          <p>Description</p>
          <h6 className="desc">{prop.productDescription}</h6>
          <hr />
          <a className="btn btn-primary form-control" onClick={det}><FontAwesomeIcon icon={faCartPlus}></FontAwesomeIcon> Visit</a>
        </div>
        <p>Comments</p>
        <p className="comment">{prop.comments[0] && prop.comments[0] || "No comments on this store yet"}</p>
        <div className="commenting">
          <textarea type="text" name="comment" placeholder="comment on this store..." onChange={
            (ev) => {
              let comment = ev.target.value;
              setComment(comment);
            }} value={comment} className="form-control" ></textarea>                        
             <button className="btn btn-warning" onClick={commenter}>comment</button>
        </div>
        <div className="add">
          <hr />
          <h6 align="center">Address: {prop.address}</h6>
          <hr />
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

  const anss = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlong / 2), 2);

  const c = 2 * Math.asin(Math.sqrt(anss));

  // Radius of earth in kilometers. Use 3956  
  // for miles 
  const ra = 6371;

  const conclu = c * ra
  return (Math.round(conclu));

}





class Home extends Component {
  constructor() {
    super();
    this.state = {
      token: localStorage.getItem('token'),
      long1: '',
      lat1: '',
      loader: 0,
      products: [],
      id: localStorage.getItem('id')
    }
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.handleLocationError = this.handleLocationError.bind(this);
    this.distancer = this.distancer.bind(this);
    this.getLocation()
  }


  getLocation(ev) {

    if (navigator.geolocation) {
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
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.dark('Please Allow Geolocation Permission')
        alert('Please Allow Geolocation Permission')
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

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24)

    if (difference_In_Days >= 30) {
      let todele = { product: c._id, token: this.state.token }
      axios.post('/products/deleteone', todele)
      return c = { owner: "delete" }

    }
    else {
      return c
    }
  }
  // distancer
  distancer = (c) => {
    var dista = distance(this.state.long1, this.state.lat1, c.location.longitude, c.location.latitude);
    c.distance = dista;
    return c.distance
  }
  // filter
  datefilter = (k) => {
    return k.owner !== "delete"
  }
  customfilter = (u) => {
    return u.owner !== this.state.id
  }
  // sort
  customSort = (a, b) => {
    var date1 = new Date(a.createdAt)
    var date2 = new Date(b.createdAt)

    const picker = Math.round((Math.random() * 10) + 1)


    if (picker % 2 === 0) {
      if (a.distance > b.distance) return 1;
      if (a.distance < b.distance) return -1;
    }
    else if (picker % 2 !== 0) {
      if (date1.getTime() > date2.getTime()) return -1;
      if (date1.getTime() < date2.getTime()) return 1;
    }
    return 0;
  }

  commentFixer = (d) => {
    axios.post('/store/showone', { token: this.state.token, storeID: d.owner })
      .then(data => {
        d.comments = data.data.response.comments
        return d.comments
      })
      .catch(err => {
        d.comments = ['No comments on this store']
        return
      })
  }
  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.replace(`/login`);
    }

    let token = { token: this.state.token }
    axios.post('/products', token)

      .then((data) => {
        //console.log(data)
        data.data.response.forEach(this.distancer)
        return data.data.response
      })
      .then(ans => ans.map(this.dateChecker))

      .then((result) => {
        result.sort(this.customSort);
        return result
      })

      .then((res) => {

        res.slice(0, 1001)
        return res
      })

      .then(conclusion => conclusion.filter(this.customfilter))
      .then(dd => dd.filter(this.datefilter))
      .then(info => {
        info.forEach(this.commentFixer)
        return info
      })
      .then(data => {
        //console.log(data)
        this.setState({ loader: 1 });
        this.setState({ products: data })
      })
      // .then(data => this.setState({products: data.data.response}))
      // .then(res => console.log(this.state.products))
      .catch(err => { toast.error("Couldn't Get Data, Please Try Again.") })
  }



  render() {


    const deta = (id) => {
      localStorage.setItem('id2', id)
      this.props.history.push(`/details?gigvee=true&product=1`);
    }
    const comm = (comment, owner) => {
      let comm = {
        token: this.state.token,
        storeID: owner,
        comment: comment
      }
      axios.post('/store/comment', comm)
        .then(() => toast.success("Comment added"))
        .catch((err) => toast.error("Comment error " + err))
    }

    return (
      <div>

        <div className="head">
          <Header id={this.state.id} />
        </div>

        {this.state.loader === 0 && <div className="spin">  <Spinner color="primary" className="spinner" size="lg" /> </div> ||
          <div className="home-div homer">


            {/* <Row className="mx-md-5"> */}
            {/* <Col> */}
            <div className="cardy">
              <br></br>
              <br></br>


              {this.state.products.map((product) =>
                <Cards key={product._id} createdAt={product.createdAt} storeName={product.storename} owner={product.owner}
                  productName={product.productName} img={product.src}
                  productDescription={product.productDescription}
                  deta={deta} comm={comm} address={product.location.address}
                  comments={product.comments} id={product._id} />
              )}
            </div>
            {/* </Col> */}
            <ToastContainer />
            {/* </Row> */}
            <br /><br />
            <br /><br />
          </div>
        }

        <Footer id={this.state.id} />
      </div>
    );
  }

}

export default Home;
