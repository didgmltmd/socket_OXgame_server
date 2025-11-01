export const FIELD = { width: 800, height: 400, dividerX: 400 } as const;

export const MAX_PLAYERS = 15;
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
    text: "React 컴포넌트는 반드시 JSX 문법으로만 작성해야 한다.",
    answer: "X" as const, // JS 함수형 컴포넌트로도 작성 가능
  },
  {
    id: 2,
    text: "props는 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달하는 용도이다.",
    answer: "O" as const,
  },
  {
    id: 3,
    text: "useState로 생성한 상태값은 직접 수정해도 자동으로 렌더링이 일어난다.",
    answer: "X" as const, // setState 함수를 통해서만 렌더링 발생
  },
  {
    id: 4,
    text: "useEffect는 컴포넌트가 마운트될 때와 의존성 배열 값이 변경될 때 실행된다.",
    answer: "O" as const,
  },
  {
    id: 5,
    text: "React에서 이벤트 핸들러는 DOM 이벤트 이름과 동일하게 소문자로 작성해야 한다. (예: onclick)",
    answer: "X" as const, // React는 camelCase로 작성 (onClick)
  },
  {
    id: 6,
    text: "부모가 자식을 렌더링할 때, 자식 컴포넌트의 props가 바뀌지 않으면 기본적으로 리렌더링되지 않는다.",
    answer: "X" as const, // 기본적으로 리렌더링됨 (React.memo로 방지 가능)
  },
  {
    id: 7,
    text: "key 속성은 React가 리스트 렌더링 시 각 요소를 구분하기 위해 사용하는 값이다.",
    answer: "O" as const,
  },
  {
    id: 8,
    text: "React의 Virtual DOM은 실제 DOM보다 항상 빠르다.",
    answer: "X" as const, // 대부분의 경우 효율적이지만, 항상 빠르다고는 할 수 없음
  },
  {
    id: 9,
    text: "React에서 상태 끌어올리기(Lifting State Up)는 여러 컴포넌트가 같은 상태를 공유할 수 있도록 하는 방법이다.",
    answer: "O" as const,
  },
  {
    id: 10,
    text: "Reconciliation 과정에서 key가 바뀌면 React는 해당 요소를 새로운 노드로 인식한다.",
    answer: "O" as const,
  },
];
