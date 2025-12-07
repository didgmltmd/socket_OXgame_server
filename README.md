# 🕹️ Socket OX Game – Backend

> 실시간 멀티플레이 OX 퀴즈 게임의 서버 엔진입니다.  
> Socket.IO 기반으로 플레이어 상태, 게임 단계, 라운드 진행 등을 관리합니다.

---

## 🚀 기술 스택

| 기술 | 설명 |
|------|------|
| Node.js | 서버 런타임 |
| Socket.IO | 양방향 실시간 통신 |
| Express | 기본 서버 구성 및 배포 환경 용이 |
| TypeScript | 타입 안정성 및 유지보수 향상 |

---

## 🚀 Deployment & Repository

🔗 **Live Demo (Backend Deploy)**  
[https://socket-oxgame-server.onrender.com/docs/](https://socket-oxgame-server.onrender.com/docs/)

🖥️ **Frontend Repository**  
[https://github.com/didgmltmd/socket_OXgame](https://github.com/didgmltmd/socket_OXgame)

---


## 📡 소켓 이벤트 흐름 구조

서버는 **권위 서버(Server-Authoritative Architecture)**로 동작합니다.  
→ 게임 진행/판단은 **항상 서버 기준**으로 처리

### 🔄 기본 연결 & 플레이어 등록

| 방향 | 이벤트 | 설명 |
|------|------|------|
| Client → Server | `join` | 플레이어 입장 + 닉네임 전달 |
| Server → 모든 Client | `playerList` | 전체 플레이어 목록 갱신 |

---

### 🎮 이동 처리 (WASD & Mobile Joystick)

| 방향 | 이벤트 | 설명 |
|------|------|------|
| Client → Server | `move` | 현재 입력 방향 상태 전달 `{ up, down, left, right }` |
| Server → 모든 Client | `playerUpdate` | 서버 tick(20fps) 기준 이동 상태 반영 |

> 입력을 바로 이동시키지 않고  
> **서버 tick 내에서 입력 누적 → 동기 처리**  
> → desync(위치 불일치) 문제 해결

---

### ❓ 문제 출제 & 게임 단계

| 방향 | 이벤트 | 설명 |
|------|------|------|
| Server → 모든 Client | `question` | 문제 + 제한시간 전송 |
| Server → 모든 Client | `countdown` | 남은 이동 가능 시간 전송 (1초 단위 또는 tick 단위) |
| Server → 모든 Client | `reveal` | 정답 공개 & 탈락자 목록 전달 |

---

### 🧾 라운드 결과 & 게임 종료

| 방향 | 이벤트 | 설명 |
|------|------|------|
| Server → 모든 Client | `roundResult` | 해당 라운드 결과 표시 |
| Server → 모든 Client | `gameOver` | 최종 생존자 또는 전원 탈락 메시지 |

---

### 🚪 접속 종료

| 방향 | 이벤트 | 설명 |
|------|------|------|
| Client → Server | 연결 종료 | 플레이어 목록 자동 제거 |
| Server → 모든 Client | `playerList` | 현재 플레이어 목록 재전송 |

---

## 🧠 서버 Tick 기반 게임 루프

```ts
setInterval(() => {
  updatePlayers();  // 입력 기반 이동 처리
  checkTimers();    // 문제, 제한시간 관리
  emitState();      // 모든 플레이어에게 최신 상태 전송
}, 1000 / 20);       // 20fps
```


