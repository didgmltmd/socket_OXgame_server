export const FIELD = { width: 800, height: 400, dividerX: 400 } as const;

export const MAX_PLAYERS = 50;
export const START_DELAY = 5; // 모두 Ready 후 시작까지
export const QUESTION_TIME = 10; // 문제 시간(이동 가능)
export const RESULT_TIME = 3; // 정답 공개 연출
export const TICK_HZ = 20; // 20fps 틱
export const SPEED = 160; // px/s
export const RADIUS = 14; // 플레이어 표시 반경

// 더미 10문제 (나중에 API/파일로 교체 가능)
export const QUESTIONS = [
  {
    id: 1,
    text: "나는 내년에 3학년이다.",
    answer: "O" as const, // JS 함수형 컴포넌트로도 작성 가능
  },
  {
    id: 2,
    text: "나는 백엔드 분야를 목표로 하고 있다.",
    answer: "X" as const,
  },
  {
    id: 3,
    text: "나는 교내 해커톤에서 대상을 수상했다.",
    answer: "O" as const, // setState 함수를 통해서만 렌더링 발생
  },
  {
    id: 4,
    text: "나의 깃허브 닉네임은 didgmltmd 이다.",
    answer: "O" as const,
  },
  {
    id: 5,
    text: "나의 주력 언어는 JavaScript이다.",
    answer: "O" as const, // React는 camelCase로 작성 (onClick)
  },
  {
    id: 6,
    text: "연암공대의 마스코트는 말벌이다.",
    answer: "X" as const, // 기본적으로 리렌더링됨 (React.memo로 방지 가능)
  },
  {
    id: 7,
    text: "나의 전화번호에는 7이 안들어간다.",
    answer: "O" as const,
  },
  {
    id: 8,
    text: "나의 생일은 5월이다.",
    answer: "X" as const, // 대부분의 경우 효율적이지만, 항상 빠르다고는 할 수 없음
  },
  {
    id: 9,
    text: "나의 나이는 25살이다.",
    answer: "X" as const,
  },
  {
    id: 10,
    text: "나의 mbti는 INTJ이다.",
    answer: "X" as const,
  },
];
