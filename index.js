import "dotenv/config" 
import express from "express"
import userRoute from "./routes/user.route.js"
import {authenticationMiddleware} from  "./middleware/auth.middleware.js"
import urlRouter from "./routes/url.route.js"

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())
app.use(authenticationMiddleware)

app.use("/user", userRoute)
app.use(urlRouter)

app.get("/",(req,res)=>{
    res.status(200).json({message:`server is running at port ${PORT}`})
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`); 
})