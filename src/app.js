import express from "express";
import cors from "cors";
import cookiesParse from "cookie-parser";
import componentsRoutes from "./components/componentsRoutes.js";

const configuration = {
  origin: ["http://localhost:3000", "https://next-componets-new.pages.dev"],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
  optionsSuccessStatus: 200,
};
const app = express();
app.use(cors(configuration));
app.use(cookiesParse());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", componentsRoutes);

export default app;
