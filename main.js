import app from "./src/app.js";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.PORT);

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running on 4000");
});
