const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/keys');

require('./models/user');
require('./models/course');
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/course'))

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', ()=>{
    console.log('connected To Mongo Yeah.. :-)');
})
mongoose.connection.on('error', (err)=>{
    console.log(`Error While connecting :-(:  ${err}`);
})

if(process.env.NODE_ENV === "production"){
    console.log("I am In")

    app.use(express.static('mini_learning/build'))

    const path = require('path')
    
    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'mini_learning','build', 'index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log(`Server is Successfully running on port ${PORT} :-) `)
})