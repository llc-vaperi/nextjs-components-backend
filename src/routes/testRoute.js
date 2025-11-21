import express from "express";
import { firstFunc, aiFunc } from "../controllers/testController.js";

const testRoute = express.Router();

//path:/api/
//description: testFunc
testRoute.get("/", firstFunc);
testRoute.post("/ai", aiFunc);

export default testRoute;
