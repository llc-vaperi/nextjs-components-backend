import express from "express";
import {
  firstFunc,
  aiFunc,
  componentsListFunc
} from "../controllers/testController.js";

const testRoute = express.Router();

//path:/api/
//description: testFunc
testRoute.get("/", firstFunc);
testRoute.post("/ai", aiFunc);
testRoute.get("/components-list", componentsListFunc);

export default testRoute;
