import connectToMongoDB from "./src/config/mongooseConfig";
import router from "./src/router";
import { auth } from "./src/config/firebaseConfig";
import { client } from "./src/config/redisConfig";
import swaggerOptions from "./src/swaggerConfig";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const xssClean = require("xss-clean");
import helmet from "helmet";
dotenv.config();

// Define express app & swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
const app: Application = express();

// Cors options
const corsOptions: CorsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(xssClean());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", router);

app.use("*", (req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Connection MongoDB  &  Firebase & redis
Promise.all([connectToMongoDB(), auth.listUsers(1), client.connect()])
  .then(() => {
    const PORT = Number(process.env.PORT) || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
      console.log("Firebase Authentication is working!");
      console.log("Redis is connected!");
    });
  })
  .catch((err) => {
    console.error("Server initialization failed:", err);
    process.exit(1);
  });
