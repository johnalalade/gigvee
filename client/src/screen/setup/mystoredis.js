import React, {Component} from 'react';
import Header from '../header';

// import '/Users/user/Desktop/bro AY/exploits/backend/uploads';

import './setup.css';
import axios from 'axios';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Footer from '../foot';

import Col from 'reactstrap/lib/Col';
import { faStore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Cards = (prop) => {
  
 const det = (ev) => {
    prop.deta(prop.id);
  }
  
  return(
    <div>
       
         <div className="card-bg">
           <div>
             <h6>{prop.storeName}</h6>
             <h5>{prop.productName}</h5>
           </div>
           <img width="100%" src={prop.img} alt="prod" />
           <div>
             <hr/>
             <p>Description</p>
             <h6>{prop.productDescription}</h6>
            
              <a className="btn btn-danger" onClick={det}>Delete</a>
           </div>
           {/* <CardFooter className="text-muted">{prop.comments}</CardFooter> */}
          
         </div>
         <br/>
         </div>
      
  );
}


class MyStoreDis extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: null,
      store: {},
      address: ""
    }
  }
// dateChecker
dateChecker = (c) => {
  
  var date1 = new Date(c.createdAt);
  var date2 = new Date();

  var difference_In_Time = date2.getTime() - date1.getTime();

  var difference_In_Days = difference_In_Time / (1000 * 3600 *24)
 
  if(difference_In_Days >= 30){
    let todele = {product: c._id}
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
  componentDidMount(){
    let store = {storeID: this.props.id}
    axios.post('/store/showone', store)
    
    .then((data) => { 
      // console.log(data);
      this.setState({
      store: data.data.response,
      address: data.data.response.location.address
    })})

    let prod = {ownerId: this.props.id}
    axios.post('/products/myproducts', prod)
    .then((data) => {return data.data.response})
    .then(ans => ans.map(this.dateChecker))
    .then(dd => dd.filter(this.datefilter))
    .then((data) =>{this.setState({
      products: data
    })})
    .catch(err => {toast.error("Couldn't Get Data, Please Try Again."+ err)})
  }
    render() {

   
     
    
      const deta = (id) => {
        let todele = {product: id}
        toast.success('Deleting, please wait...')
        axios.post('/products/deleteone', todele)
        .then(() => toast.success('Delete Successful.'))
        .then(() => window.location.reload())
      }
        return (
            <div>
              <Header id={this.props.id} />
              <br/> <br/>
              <br/>
           <div className="store">
              <div className="card-bg">
                 <div className="img-card">
                   {this.state.store.image &&
                  <img width="100%" src={`/${this.state.store.image}`} className="setupimg" alt="prod" /> || <FontAwesomeIcon icon={faStore} size='lg'></FontAwesomeIcon>
                  }
                  </div>
                  <div className="lists">
                   
                    <h5 className="card-list" > {this.state.store.storename}</h5> 

                    <h6 className="card-list">Address: {this.state.address}</h6>
                  <br/>
                    <a className="btn btn-primary" onClick={()=>
                                  window.location =`/updatestore/${this.props.id}`} >Update</a>

                  <br/>
                   <a className="btn btn-outline-success" onClick={()=>
                                  window.location = `/addstock/${this.props.id}`} >Add Product</a>  
                               
                  </div>
                  
                  
              </div>
              <br/>

            <h4>Your  Products: </h4>
                    <h5>Products will be deleted after 30 days</h5>
                  {this.state.products && 
                this.state.products.map((product) => 
                  <Cards key={product._id} storeName={product.storename} productName={product.productName} img={`/${product.image}`} productDescription={product.productDescription} deta={deta} id={product._id} />
                )
                || <p>No products yet</p>}  
               
             <ToastContainer />
             <br/>
             </div>
             <br/>
             
              <Footer id={this.props.id} />
            </div>
            );
    }
}

export default MyStoreDis;