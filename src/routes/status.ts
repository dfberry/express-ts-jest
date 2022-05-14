import express from "express";
const router = express.Router();

/* GET users listing. */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.get("/", function (req, res /*ext*/) {
  res.json({ status: "running" });
});

export default router;
