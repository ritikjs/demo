// mongoose package//////
const  mongoose  = require("mongoose")
///dotenv//////
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.MongoDBUrl;
 


const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connect = () => {
    
    return mongoose
      .connect(url, connectionParams)
      .then(() => {
        console.log("Connected to the database ");
      })
      .catch((err) => {
        console.error(`Error connecting to the database${err}`);
      });
}


 

module.exports= connect

