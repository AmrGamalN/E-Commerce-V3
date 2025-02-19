const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce-V3",
      version: "1.0.0",
      description: "API documentation for the E-Commerce",
    },
    servers: [
      {
        url: "http://localhost:8080/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
