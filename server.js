require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
const app = express()
PORT = process.env.PORT || 3000
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')


//connect Database
connectDB()
//middleware
app.use(express.json())
//Routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/product',productRoutes)
app.use('/api/v1/cart',cartRoutes)
app.use('/api/v1/order',orderRoutes)


app.listen(PORT ,()=>{
    console.log('server is running on PORT');
})
