const mongoose = require('mongoose');
const {DB_NAME} = process.env
mongoose.Promise = global.Promise;

let uri = `mongodb://localhost:27017/${DB_NAME}`
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(uri, options)
.then(() => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log('***** Connected to data base - ', uri)
    },err => {
        /** handle initial connection error */
        console.log('***** Error while connecting database *****') 
    }
).catch(err => console.log(err));

module.exports = mongoose;