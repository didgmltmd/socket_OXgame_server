import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer, Socket } from "socket.io";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./swagger";
import questionsRouter from "./routes/questions";
import { GameRoom } from "./GameRoom";
import { QUESTIONS } from "./config";

// ----- CORS 허용 도메인 배열로 준비 (문자열 -> 배열) -----
const ALLOW: string[] = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// 로컬 개발/배포 기본값(환경변수 없을 때)
if (ALLOW.length === 0) {
  ALLOW.push("http://localhost:5173");
  ALLOW.push("https://socket-oxgame.onrender.com");
}

const app = express();

// HTTP(REST/Swagger) CORS
app.use(
  cors({
    origin: ALLOW,
    credentials: false,
  })
);
app.use(express.json());

// 라우터 & Swagger
app.use("/api/questions", questionsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/docs.json", (_req: Request, res: Response) => res.json(swaggerSpec));
app.get("/health", (_req: Request, res: Response) =>
  res.json({ ok: true, service: "ox-server" })
);

// Socket.IO
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: ALLOW,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
  },
});

// 게임룸
const room = new GameRoom(io, QUESTIONS);
room.startLoop();

// 클라로부터 오는 입력 payload 타입
type InputPayload = Partial<{
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}>;

io.on("connection", (socket: Socket) => {
  console.log("connected:", socket.id);

  socket.on("join", ({ name }: { name?: string }) => {
    try {
      if (room.state.phase !== "LOBBY") {
        socket.emit("error", { message: "이미 시작되어 입장 불가합니다." });
        return;
      }
      room.addPlayer(socket.id, (name ?? "").toString().slice(0, 16));
      socket.join(room.id);
      room.broadcastState(socket.id); // 개인에게 스냅샷
    } catch (e: any) {
      socket.emit("error", { message: e?.message ?? "입장 실패" });
    }
  });

  socket.on("getState", (cb: (s: any) => void) => {
    try {
      cb(room.state);
    } catch (e) {
      cb(room.state);
    }
  });

  socket.on("ready", () => room.setReady(socket.id));

  socket.on("input", (payload: InputPayload) => {
    room.receiveInput(socket.id, payload);
  });

  socket.on("disconnect", () => {
    if (room.state.players[socket.id]) {
      delete room.state.players[socket.id];
      room.broadcastState();
    }
    console.log("disconnected:", socket.id);
  });
});

// Render는 반드시 PORT 사용 + 0.0.0.0 바인딩
const PORT = Number(process.env.PORT) || 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`server on :${PORT} (docs: /docs, health: /health)`);
});
