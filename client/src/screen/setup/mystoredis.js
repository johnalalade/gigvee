import React, { Component } from 'react';
import Header from '../header';

import './setup.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Footer from '../foot';
// import ScrollToBottom from 'react-scroll-to-bottom'
//import Col from 'reactstrap/lib/Col';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'react-moment';

const Cards = (prop) => {

  const det = (ev) => {
    prop.deta(prop.id);
  }

  return (
    <div>

      <div className="card-bg">
        <div className="c-top">
          <div>
            <h6>{prop.storeName}</h6>
            <h5 className="h-h5">{prop.productName}</h5>
          </div>
          <Moment className="datetime" fromNow>{prop.createdAt}</Moment>
        </div>
        <img width="100%" src={prop.img} alt="prod" />
        <div>
          <hr />
          <p>Description</p>
          <h6>{prop.productDescription}</h6>

          <a className="btn btn-danger" onClick={det}>Delete</a>
        </div>
        <p>Comments({prop.comments.length})</p>
            {prop.comments[0] && prop.comments.slice(0,11).reverse().map(comment =>
            <div className="scroll">
             
              <p className="comment">{comment}</p>
              
              
              </div>
              )
            || "No comments on this product yet"}
        {/* <CardFooter className="text-muted">{prop.comments}</CardFooter> */}

      </div>
      <br />
    </div>

  );
}


class MyStoreDis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      products: null,
      store: {},
      address: "",
      id: localStorage.getItem('id')
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
  // filter
  datefilter = (k) => {
    return k.owner !== "delete"
  }
  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.replace(`/login`);
    } 
    let store = { storeID: this.state.id, token: this.state.token }
    axios.post('/store/showone', store)

      .then((data) => {
        // console.log(data);
        this.setState({
          store: data.data.response,
          address: data.data.response.location.address
        })
      })

    let prod = { ownerId: this.state.id, token: this.state.token }
    axios.post('/products/myproducts', prod)
      .then((data) => { return data.data.response })
      .then(ans => ans.map(this.dateChecker))
      .then(dd => dd.filter(this.datefilter))
      .then((data) => {
        this.setState({
          products: data
        })
      })
      .catch(err => { toast.error("Couldn't Get Data, Please Try Again.") })
  }
  render() {




    const deta = (id) => {
      let todele = { product: id, token: this.state.token }
      toast.success('Deleting, please wait...')
      axios.post('/products/deleteone', todele)
        .then(() => toast.success('Delete Successful.'))
        .then(() => this.setState(
          prevState => {
            return {
            products: prevState.products.filter((u) => {
              return u._id !== id 
            })
          }
        }
        ))
    }
    return (
      <div>
        <Header id={this.state.id} />
        <br /> <br />
        <br />
        <div className="store">
          <div className="card-bg">
            <div className="img-card">
              {this.state.store.src &&
                <img src={this.state.store.src} className="setupimg" alt="store image" /> || <FontAwesomeIcon icon={faStore} size='lg'></FontAwesomeIcon>
              }
            </div>
            <div className="lists">

              <h5 className="card-list" > {this.state.store.storename}</h5>

              <h6 className="card-list">Address: {this.state.address}</h6>
              <br />
              <a className="btn btn-primary" onClick={() =>
                window.location = `/updatestore?gigvee=true&product=1`} >Update</a>

              <br />
              <a className="btn btn-outline-success" onClick={() =>
                window.location = `/addstock?gigvee=true&product=1`} >Add Product</a>

            </div>


          </div>
          <br />

          <h6>Your  Products: </h6>
          <p>Products will be deleted after 30 days</p>
          {this.state.products &&
            this.state.products.map((product) =>
              <Cards key={product._id} createdAt={product.createdAt} storeName={product.storename} productName={product.productName} img={product.src} productDescription={product.productDescription} deta={deta} id={product._id} comments={product.comments}/>
            )
            || <p>No products yet</p>}

          <ToastContainer />
          <br />
        </div>
        <br />

        <Footer id={this.state.id} />
      </div>
    );
  }
}

export default MyStoreDis;