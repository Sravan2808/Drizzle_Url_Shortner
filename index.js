import express from "express"

const app = express()
const PORT = process.env.PORT ?? 8000

app.get("/",(req,res)=>{
    res.status(200).json({message:`server is running at port ${PORT}`})
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`); 
})