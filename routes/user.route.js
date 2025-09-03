import express from "express"; 
import { signupPostRequestBodySchema,loginPostRequestBodySchema } from "../validation/request.validation.js"
import {hashPasswordWithSalt} from "../utils/hash.js"
import {getUserByEmail} from "../services/user.service.js"
import {createUser} from "../services/user.service.js"
import jwt from "jsonwebtoken"

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

  if(validationResult.error){
    return res.status(400).json({error:validationResult.error.format()})
  }

  const { firstname, lastname, email, password } = validationResult.data;

 
  const existingUser = await getUserByEmail(email)
  if (existingUser)
    return res
      .status(400)
      .json({ error: `User with email ${email} already exists!` });

   const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

   const user = await createUser({firstname,lastname,email,salt,hashedPassword});

   return res.status(201).json({data:{userId:user.id}})
});

router.post("/login",async (req,res)=>{
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body)

  if(validationResult.error){
    res.status(400).json({error:validationResult.error.format()})
  }

  const {email,password} = validationResult.data

  const user = await getUserByEmail(email)

  if(!user){
    return res.status(400).json({error:`User with email ${email} does not exist!`})
  }

  const {password:hashedPassword} = hashPasswordWithSalt(password,user.salt)

  if(user.password !== hashedPassword){
    return res.status(400).json({error:"Invalid password"})
  }

  const token = jwt.sign({id:user.id},process.env.JWT_SECRET)
  
  return res.json({token})


})

export default router;
