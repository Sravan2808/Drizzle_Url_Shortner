import express from "express";
import { shortenPostRequestBodySchema } from "../validation/request.validation.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import { createUrl, getAllUserCodes, getUrlByCode } from "../services/user.service.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  const shortCode = code ?? nanoid(6);

  const result = await createUrl(shortCode,url,req.user.id)
  
  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
});

router.get("/codes",ensureAuthenticated,async (req,res)=>{
    const codes = await getAllUserCodes(req.user.id);
    return res.json({codes})
})
router.get('/:shortCode',async(req,res)=>{
    const code = req.params.shortCode;
    const result = await getUrlByCode(code);

    if(!result){
        res.status(404).json({error:"Invalid URL"})
    }

    res.redirect(result.targetURL)

})

export default router;
