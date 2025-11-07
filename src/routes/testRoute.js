import express from "express";
import { firstFunc } from "../controllers/testController.js";

const testRoute = express.Router();

//path:/api/
//description: testFunc
testRoute.get("/", firstFunc);

export default testRoute;
