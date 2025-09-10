import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'    
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

dotenv.config()
//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


//api endpoints

app.use('/api/admin', adminRouter)
app.use('/api/doctors', doctorRouter)
app.use('/api/user', userRouter)

//localhost:4000/api/admin/add-doctor

app.get('/', (req, res) => {
  res.status(200).send('Api working fine')
})

app.listen(port, () => console.log('Server started', port))
