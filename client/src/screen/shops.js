import React, {Component, useEffect} from 'react';
import Footer from './foot';
import Header from './header';
//import Container from 'reactstrap/lib/Container';
import { Media, Button } from 'reactstrap';

import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

import './setup/setup.css'


function Tiler (prop) {
  const visit = (ev) => {
    prop.deta(prop.id);
  }
  

  return (
   <div>
     <div>
      
         <Media className="media-div">
           <Media left>
             <img src={prop.img} className="book-img" alt="product img" />
           </Media>
           <Media body>
             <Media heading>
               {prop.productName}
             </Media>
             {prop.description}
             {prop.storeName}    
           </Media>
           <Media right href="#">
           <Button className="btn btn-success" onClick={visit}>Visit</Button>
            
           </Media>
         </Media>
       
     </div>
   </div>
  );
}


class Shops extends Component {
  constructor(){
    super();
    this.state = {
      long1: '',
      lat1: '',
      products: []
    }
  }

  componentDidMount(){
    let user = {userID: this.props.match.params.id}
    axios.post('/profiles/showone', user)
   
    .then((response) => response.data.response.bookmarks.map((a) =>{
      let id = {productID: a}
      axios.post('/products/showone',id)
    }))
    .then((data) => {console.log(data)})
    .catch(err => {toast.error("Couldn't Get Data, Please Try Again."+ err)})
  }

  render(){
    const pcaccounts = { 
        id: "1",
        name: "John",
        productName: "Classical Guitar",
        img: "",
        produtDescription: "Classical Guitar Good For Both Beginners, and professionals,  $100",
        comments: [
          "cool, reallly good and quality assured. i guarantee you", "wow, wow, wow, thank you Bmac"
        ],
        chats: [
          {storeName: "BMAC"
          },
          {storeName: "Funsho Global"
          }
        ],
      }
    

    const storeaccounts = 
      { 
        id: "1",
        storeName: "BMAC",
        productName: "Classical Guitar",
        img: "logo",
        produtDescription: "Classical Guitar Good For Both Beginners, and professionals,  $100",
        comments: [
          "cool, reallly good and quality assured. i guarantee you", "wow, wow, wow, thank you Bmac"
        ],
        chats: [],
        notifications:  ['john sent an enquiry', 'peter sent an enquiry'],
      }
      
    

    
  const deta = (id) => {
    this.props.history.push(`/details/${this.props.match.params.id}?uid=${id}`);
    }

    return (
     <div>
       <Header  id={this.props.match.params.id} />
       
       {this.state.products.map((prod)=>
          <Tiler key={prod.productname} productName={prod.productname} description={prod.productDescription} id={prod.id} img={prod.avatar} storeName={prod.storename} deta={deta} />
       )}
        <ToastContainer />
        <Footer id={this.props.match.params.id} />
     </div>
    );
  }
}

export default Shops;
