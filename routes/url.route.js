import express from "express";
import { shortenPostRequestBodySchema } from "../validation/request.validation.js";
import { urlsTable } from "../models/url.model.js";
import { db } from "../db/index.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/shorten", async (req, res) => {
  const userId = req.user?.id;
  

  if (!userId)
    return res
      .status(401)
      .json({ error: "You must be logged in to access this resource" });

  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body
  );
  

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  const shortCode = code ?? nanoid(6);
  const [result] = await db
    .insert(urlsTable)
    .values({ shortCode, targetURL: url, userId: req.user.id })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return res
    .status(201)
    .json({
      id: result.id,
      shortCode: result.shortCode,
      targetURL: result.targetURL,
    });
});

export default router;
