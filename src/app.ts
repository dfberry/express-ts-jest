import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";

import cookieParser from "cookie-parser";
import logger from "morgan";
import fileUpload from "express-fileupload";
import cors from "cors";
import multer from "multer";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import storageRouter from "./routes/storage";
import uploadRouter from "./routes/upload";
import statusRouter from "./routes/status";
import HttpException from "./models/HttpException";

// Multer
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single("image");

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const checkTrailingSlash = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const trailingSlashUrl = req.baseUrl + req.url;
  if (req.originalUrl !== trailingSlashUrl) {
    res.redirect(301, trailingSlashUrl);
  } else {
    next();
  }
};
const app = express();

app.use(logger("dev"));
app.use((req: Request, resp: Response, next: NextFunction) => {
  next();
}, cors({ origin: "*", maxAge: 84600 }));

app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// http://localhost:3000/ instead of
// http://locahost:3000 (no trailing slash)
app.use(checkTrailingSlash);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/storage", storageRouter);
app.use("/api/upload", uploadStrategy, uploadRouter);
app.use("/api/status", statusRouter);

// catch 404 and forward to error handler
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: HttpException, req: Request, res: Response /*next*/) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
