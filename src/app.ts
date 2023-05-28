import logWithLocation from "./utils/logger";
import express from "express";
import v1Router from "./routes"
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/v1", v1Router);


const PORT = 5000;

app.listen(PORT, () => logWithLocation("info", `Server is running on ${PORT}`))