// path: /api/componentsRoutes.ts

import express from "express";
import {
  firstFunc,
  aiFunc,
  componentsListFunc,
} from "./componentsControllers.js"; // Note the .js extension

const componentsRoutes = express.Router();

// path:/api/
// description: testFunc
componentsRoutes.get("/", firstFunc);
componentsRoutes.post("/ai", aiFunc);
componentsRoutes.get("/components-list", componentsListFunc);

export default componentsRoutes;
