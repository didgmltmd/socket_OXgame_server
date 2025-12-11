export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  x: number;
  y: number;
  alive: boolean;
  spectator: boolean;
  ready: boolean;
}

export type GamePhase =
  | "LOBBY"
  | "STARTING"
  | "QUESTION"
  | "LOCKED"
  | "RESULT"
  | "END";

export interface Question {
  id: number;
  text: string;
  answer: "O" | "X";
}

export interface RoomState {
  code: string;
  phase: GamePhase;
  players: Record<PlayerId, Player>;
  questionIndex: number;
  question?: Question;
  countdown: number;
  winners: PlayerId[];
}

// 클라→서버
export interface ClientToServer {
  join: (payload: { name: string }) => void;
  ready: () => void;
  input: (p: {
    up?: boolean;
    down?: boolean;
    left?: boolean;
    right?: boolean;
  }) => void;

  getState: (ack: (s: RoomState) => void) => void;
}

// 서버→클라
export interface ServerToClient {
  state: (room: RoomState) => void;
  tick: (p: { players: Array<Pick<Player, "id" | "x" | "y">> }) => void;
  phase: (p: {
    phase: GamePhase;
    countdown: number;
    questionIndex: number;
  }) => void;
  question: (p: { id: number; text: string }) => void;
  result: (p: { correct: "O" | "X"; eliminated: PlayerId[] }) => void;
  end: (p: { winnerIds: PlayerId[]; winners: string[] }) => void;
  error: (p: { message: string }) => void;
}
