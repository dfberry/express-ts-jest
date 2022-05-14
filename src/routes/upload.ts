import express, { Request, Response, ErrorRequestHandler } from "express";
import { uploadImage } from "../lib/storage";

const router = express.Router();

router.post("/", async function (req: Request, res: Response /*next*/) {
  //let sampleFile: any;
  //let uploadPath: string;

  if (!req.file || Object.keys(req.file).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let imageBlob = null;

  if (req.file) {
    imageBlob = await uploadImage(req.file);
    if (imageBlob) {
      return res.send("File uploaded!");
    }
  }

  return res.status(500).send("Upload files files - unknown");
});

export default router;
