const   express = require('express'),
        bodyParser = require('body-parser'),
        cors = require('cors'),
        port = process.env.PORT || 5000,
        {handler,notFound}  = require('./middleware/error'),
        {controller} = require('./controller'),
        path = require('path')
        publicPath = path.join(__dirname,"test_client","build")
        app = express()

app.use(cors())
app.options("*", cors())
app.use(bodyParser.urlencoded({extended:false}))

/**
 * Setting Public folder path
 */
app.use(express.static(publicPath))

/**
 * Get Items
 */
app.get('/api/items/:pageSize/:page',controller)

/**
 * Handles request which do not match  the ones above
 */
app.get('*', (req,res) =>{
    res.sendFile(path.join(publicPath,'index.html'));
});

//error handler 
app.use(handler)
//Catch a 404 error and foward it
app.use(notFound)




app.listen(port,()=>{
    console.log("Server is running on port ",port)
})