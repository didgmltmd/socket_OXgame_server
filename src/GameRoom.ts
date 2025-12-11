import type { Server as IOServer } from "socket.io";
import {
  FIELD,
  MAX_PLAYERS,
  START_DELAY,
  QUESTION_TIME,
  RESULT_TIME,
  TICK_HZ,
  SPEED,
  RADIUS,
} from "./config";
import type { GamePhase, Player, Question, RoomState } from "./types";

export class GameRoom {
  io: IOServer;
  id = "default";
  state: RoomState;

  // inputs는 단 하나만
  private inputs = new Map<
    string,
    Partial<{ up: boolean; down: boolean; left: boolean; right: boolean }>
  >();

  private loop?: NodeJS.Timeout;
  questions: Question[];

  constructor(io: IOServer, questions: Question[]) {
    this.io = io;
    this.questions = questions;
    this.state = {
      code: this.id,
      phase: "LOBBY",
      players: {},
      questionIndex: -1,
      countdown: 0,
      winners: [],
    };
  }

  // 공용 스냅샷 브로드캐스트
  public broadcastState(targetSocketId?: string) {
    if (targetSocketId) this.io.to(targetSocketId).emit("state", this.state);
    else this.io.to(this.id).emit("state", this.state);
  }

  public startLoop() {
    if (this.loop) return;
    this.loop = setInterval(() => this.tick(), 1000 / TICK_HZ);
  }

  private lastTick = Date.now(); // 클래스 필드로 유지

  private tick() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    if (["STARTING", "QUESTION", "RESULT"].includes(this.state.phase)) {
      if (this.state.countdown > 0) {
        this.state.countdown -= 1 / TICK_HZ;
        if (this.state.countdown <= 0) {
          if (this.state.phase === "STARTING") this.beginQuestion();
          else if (this.state.phase === "QUESTION") this.lockMovement();
          else if (this.state.phase === "RESULT") this.nextRoundOrEnd();
        }
      }
    }


    if (this.state.phase === "QUESTION" || this.state.phase === "STARTING") {
      this.updatePositions(dt);
    }

    const visible = Object.values(this.state.players)
      .filter((p) => p.alive && !p.spectator)
      .map((p) => ({ id: p.id, x: p.x, y: p.y }));

    this.io.to(this.id).emit("tick", {
      players: visible,
      countdown: this.state.countdown,
      phase: this.state.phase,
    });
  }
  private transition(phase: GamePhase, countdown = 0) {
    this.state.phase = phase;
    this.state.countdown = countdown;
    this.io.to(this.id).emit("phase", {
      phase,
      countdown,
      questionIndex: this.state.questionIndex,
    });
  }

  addPlayer(id: string, name: string) {
    if (Object.keys(this.state.players).length >= MAX_PLAYERS)
      throw new Error("방이 가득 찼습니다.");
    if (this.state.phase !== "LOBBY")
      throw new Error("이미 시작되어 입장 불가합니다.");
    this.state.players[id] = {
      id,
      name,
      x: FIELD.width * 0.25 + Math.random() * FIELD.width * 0.5,
      y: FIELD.height * 0.2 + Math.random() * FIELD.height * 0.6,
      alive: true,
      spectator: false,
      ready: false,
    };
    this.broadcastState();
  }

  setReady(id: string) {
    const p = this.state.players[id];
    if (!p) return;
    p.ready = !p.ready;
    this.broadcastState();
    this.maybeStart();
  }

  private maybeStart() {
    if (this.state.phase !== "LOBBY") return;
    const players = Object.values(this.state.players);
    if (players.length < 2) return;
    if (players.every((p) => p.ready)) this.transition("STARTING", START_DELAY);
  }

  private updatePositions(dt: number) {
    for (const [id, input] of this.inputs) {
      const p = this.state.players[id];
      if (!p || !p.alive || p.spectator) continue;

      let vx = 0,
        vy = 0;
      if (input.left) vx -= 1;
      if (input.right) vx += 1;
      if (input.up) vy -= 1;
      if (input.down) vy += 1;

      const len = Math.hypot(vx, vy) || 1;
      p.x += (vx / len) * SPEED * dt;
      p.y += (vy / len) * SPEED * dt;

      p.x = Math.max(RADIUS, Math.min(FIELD.width - RADIUS, p.x));
      p.y = Math.max(RADIUS, Math.min(FIELD.height - RADIUS, p.y));
    }
  }

  receiveInput(
    id: string,
    payload: Partial<{
      up: boolean;
      down: boolean;
      left: boolean;
      right: boolean;
    }>
  ) {
    if (!this.inputs.has(id)) this.inputs.set(id, {});
    Object.assign(this.inputs.get(id)!, payload);
  }

  private beginQuestion() {
    this.state.questionIndex += 1;
    const q = this.questions[this.state.questionIndex];
    if (!q) {
      this.end([]);
      return;
    } 
    this.state.question = q;
    this.transition("QUESTION", QUESTION_TIME);
    this.io.to(this.id).emit("question", { id: q.id, text: q.text });
  }

  private lockMovement() {
    this.transition("LOCKED");
    setTimeout(() => this.judge(), 500);
  }

  private judge() {
    const correct = this.state.question!.answer;
    const eliminated: string[] = [];

    for (const p of Object.values(this.state.players)) {
      if (!p.alive || p.spectator) continue; 

      const isOnRight = p.x >= FIELD.dividerX; 
      const side = isOnRight ? "X" : "O";

      if (side !== correct) {
        p.alive = false;
        p.spectator = true;

        this.inputs.delete(p.id);
        eliminated.push(p.id);
      }
    }

    this.io.to(this.id).emit("result", { correct, eliminated });

    const alive = Object.values(this.state.players).filter((p) => p.alive);

    if (alive.length <= 1) {
      const winners = alive.length === 1 ? [alive[0].id] : [];
      this.end(winners);
      return;
    }

    this.transition("RESULT", RESULT_TIME);

    this.broadcastState();
  }

  private nextRoundOrEnd() {
    if (this.state.questionIndex >= this.questions.length - 1) {
      const winners = Object.values(this.state.players)
        .filter((p) => p.alive)
        .map((p) => p.id);
      this.end(winners);
    } else {
      this.beginQuestion();
    }
  }

  public end(winnerIds: string[]) {
    this.state.phase = "END";
    this.state.winners = winnerIds;
    this.state.countdown = 0;

    const winnerNames = winnerIds.map(
      (id) => this.state.players[id]?.name ?? id
    );

    this.io.to(this.id).emit("end", { winnerIds, winners: winnerNames });
    this.broadcastState();

    setTimeout(() => {
      for (const id of Object.keys(this.state.players)) {
        this.io.sockets.sockets.get(id)?.disconnect(true);
      }
      this.io.socketsLeave(this.id);

      this.inputs.clear();
      this.state.players = {};
      this.state.questionIndex = -1;
      this.state.winners = [];
      this.state.countdown = 0;
      this.state.phase = "LOBBY";
    }, 1500);
  }
}
