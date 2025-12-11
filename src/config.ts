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
    text: "React에서 상태 변경은 setState 함수를 호출해야만 렌더링이 발생한다.",
    answer: "O" as const,
  },
  {
    id: 2,
    text: "부모 컴포넌트에서 자식 컴포넌트로 값을 전달할 때 props를 사용한다.",
    answer: "O" as const,
  },
  {
    id: 3,
    text: "컴포넌트의 key는 배열의 인덱스를 항상 사용하는 것이 권장된다.",
    answer: "X" as const,
  },
  {
    id: 4,
    text: "useEffect는 렌더링 직후 또는 의존성 배열이 변경될 때 실행된다.",
    answer: "O" as const,
  },
  {
    id: 5,
    text: "React에서 이벤트 핸들러는 HTML처럼 소문자로 작성한다(onclick).",
    answer: "X" as const, // camelCase(onClick) 사용
  },
  {
    id: 6,
    text: "React.memo는 props가 변경되지 않으면 컴포넌트의 리렌더링을 방지해준다.",
    answer: "O" as const,
  },
  {
    id: 7,
    text: "useState는 비동기로 동작할 수 있다.",
    answer: "O" as const,
  },
  {
    id: 8,
    text: "useRef로 생성한 값이 변경되면 컴포넌트는 리렌더링된다.",
    answer: "X" as const,
  },
  {
    id: 9,
    text: "JSX에서는 조건부 렌더링을 위해 if 문을 직접 사용할 수 있다.",
    answer: "X" as const, // JSX 안에서는 삼항/&& 등을 주로 사용
  },
  {
    id: 10,
    text: "useCallback은 함수의 재생성을 방지하여 불필요한 렌더링을 줄이는 데 도움이 된다.",
    answer: "O" as const,
  },
];
