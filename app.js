require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const mealRoutes = require("./routes/mealRoutes");
const chatRoutes = require("./routes/chatRoutes");
const port = process.env.PORT;
const { createServer } = require("http");



const app = express();
const httpServer = createServer(app);



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

app.use('/css', express.static('node_modules/bootstrap/dist/css'));
app.use('/js', express.static('node_modules/bootstrap/dist/js'));
app.use('/js', express.static('node_modules/jquery/dist'));

//const dburi = 'mongodb+srv://ahmednagy:test123@cluster0.jnhdmvn.mongodb.net/meals?retryWrites=true&w=majority';

//mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
//  .then((result) => {
//        console.log("conneted to the database");
//        httpServer.listen(port, () => {
//            console.log(`Server running on localhost:${port}`)
//        })
//    })
//    .catch((err) => { console.log(err) });


app.use(authRoutes);
app.use(mealRoutes);
app.use(chatRoutes(httpServer));


