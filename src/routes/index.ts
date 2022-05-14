import express from "express";
import path from "path";
const router = express.Router();

/* GET home page. */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.get("/", function (req, res /*next*/) {
  res.sendFile(path.join(__dirname, "../../public", "index.html"));
});

export default router;
