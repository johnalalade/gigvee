const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// const profileRoute = require('./Routes/userProfileRoutes');
const storeRoute = require('./Routes/StoreRoutes');
const productsRoute = require('./Routes/ProductsRoutes');
const authRoute = require('./Routes/AuthRoute');

const port = process.env.PORT || 5000

const router = require('./router');
const uri = process.env.ATLAS_URI
mongoose.connect('mongodb+srv://Exploits:Exploits4444@cluster0.vtnwl.gcp.mongodb.net/Exploits?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});
const db = mongoose.connection

db.on('error', (err) => {
  console.log(err)
})

db.once('open', () =>{
  console.log('Database connection Established')
})

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(router);

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

// serve static asset if in production
if(process.env.NODE_ENV === 'production') {
  // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


server.listen(port, () => console.log(`Server has started.on port ${port}$`));

// app.use('/', profileRoute)
app.use('/', storeRoute)
app.use('/', productsRoute)
app.use('/', authRoute)