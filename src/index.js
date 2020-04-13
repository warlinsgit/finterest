const express = require('express')
const path = require('path')
const morgan = require('morgan')
const multer = require('multer')
const uuid = require('uuid/v4')
const { format } = require('timeago.js');


const app = express()
require('./database')

//settings 
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



//middlewares 

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename:(req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname))
    }
})

app.use(multer({storage: storage }).single('image'))
//globals variables 
app.use((req, res, next ) => {
    app.locals.format = format
    next()
})

//routes 
app.use(require('./routes/index'))

//static files 
app.use(express.static(path.join(__dirname,  'public')))

//start server 

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
})


//https://www.youtube.com/watch?v=aNYX2F1RX-s&t=1771s