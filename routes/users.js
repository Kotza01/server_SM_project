import express from "express";

import { singIn, singUp } from "../controllers/users.js";

const route = express.Router();

route.post("/signup", singUp);
route.post("/signin", singIn);

export default route;
