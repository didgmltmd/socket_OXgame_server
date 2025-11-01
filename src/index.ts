// src/index.ts
import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { GameRoom } from "./GameRoom";
import { QUESTIONS } from "./config";
import type { ClientToServer, ServerToClient } from "./types";
import questionsRouter from "./routes/questions";

const app = express();

/** CORS는 반드시 최상단에서 */
const ALLOW = "https://socket-oxgame.onrender.com";

app.use(cors({ origin: ALLOW, credentials: false }));
app.use(express.json());

/** REST 라우트 & Swagger */
app.use("/api/questions", questionsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_, res) => res.json(swaggerSpec));

/**
 * @openapi
 * /health:
 *   get:
 *     summary: 서버 상태 확인
 *     description: 서버가 정상적으로 실행 중인지 헬스체크용 API
 *     responses:
 *       200:
 *         description: 서버 정상 동작
 */
app.get("/health", (_, res) => res.json({ ok: true, service: "ox-server" }));

/** HTTP + Socket.IO */
const server = http.createServer(app);
const io = new Server<ClientToServer, ServerToClient>(server, {
  cors: { origin: ALLOW, methods: ["GET", "POST"] },
});

/** 단일 게임룸 */
const room = new GameRoom(io, QUESTIONS);
room.startLoop();

/** 소켓 이벤트 */
io.on("connection", (socket) => {
  console.log("✅ connected:", socket.id);

  socket.on("getState", (cb: (s: any) => void) => cb(room.state));

  socket.on("join", ({ name }) => {
    console.log("➡️ join", socket.id, name);
    try {
      if (room.state.phase !== "LOBBY") {
        socket.emit("error", { message: "이미 시작되어 입장 불가합니다." });
        return;
      }
      room.addPlayer(socket.id, (name ?? "").toString().slice(0, 16));
      socket.join(room.id);
      socket.emit("state", room.state); // 본인에게
      room.broadcastState(); // 전체에게
    } catch (e: any) {
      socket.emit("error", { message: e?.message ?? "입장 실패" });
    }
  });

  socket.on("ready", () => room.setReady(socket.id));

  socket.on("input", (payload) => {
    room.receiveInput(socket.id, payload);
  });

  socket.on("disconnect", () => {
    const p = room.state.players[socket.id];
    if (p) {
      delete room.state.players[socket.id]; // ✅ 완전 제거
      room.broadcastState();
    }
  });
});

/** 서버 시작 */
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀 server on :${PORT} allow=${ALLOW.join(" | ")}  (docs: /docs)`)
);
