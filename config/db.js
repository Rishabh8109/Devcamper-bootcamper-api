const mongoose = require("mongoose");
const colors = require('colors');


const connectDB = () => {
  mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@rvcluster1.ukwk7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
)
.then((conn) => {
  console.log(`Mongodb connected to: ${conn.connection.host}`.white.inverse);
})
.catch((err) => {
  console.log(err);
});

};

module.exports = connectDB;
