import express, { Request, Response } from "express";
import { getBlobsInContainer } from "../lib/storage";
const router = express.Router();

/* GET users listing. */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.get("/", async function (req: Request, res: Response /*next*/) {
  try {
    const blobs = await getBlobsInContainer();
    console.log(blobs);
    res.json(blobs);
  } catch (error) {
    res.statusCode = 500;
    res.json({ error });
  }
});

export default router;
