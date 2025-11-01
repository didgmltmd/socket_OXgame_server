import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "O/X 퀴즈 서버 API",
      version: "1.0.0",
      description: "Express + Socket.IO 기반 O/X 퀴즈 서버의 REST API 문서",
    },
    servers: [
      { url: "http://localhost:4000", description: "Local server" },
      { url: "https://ox-server.onrender.com", description: "Render server" }
    ],
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"], // Swagger 주석을 읽을 경로
});
