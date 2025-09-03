import express from "express"
import userRoute from "./routes/user.route.js"

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())

app.use("/user", userRoute)

app.get("/",(req,res)=>{
    res.status(200).json({message:`server is running at port ${PORT}`})
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`); 
})