// components.routes.ts
// ⚠️ Write endpoints (POST /ai, POST /obj-input, GET /) have been moved to goniflow-admin-back.
// This file now only exposes read-only (GET) endpoints for the public frontend.

import express from "express";
import { componentsListFunc } from "./components.controller.js";

const componentsRoutes = express.Router();

// GET /api/components-list — Returns all public components from DB (read-only)
componentsRoutes.get("/components-list", componentsListFunc);

export default componentsRoutes;
