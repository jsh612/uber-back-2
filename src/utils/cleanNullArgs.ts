import { INotNull } from "../types/custom";

const cleanNullArgs = args => {
  // args 중 그 값이 null이 아닌 것들만 모아온다
  // 그 이유는 User에 값들 중 null일 수 없는 것이 있기 때문이다.
  const notNull: INotNull = {};
  Object.keys(args).forEach(key => {
    if (key !== "placeId") {
      if (args[key] !== null || args[key] !== undefined) {
        notNull[key] = args[key];
      }
    }
  });
  return notNull;
};

export default cleanNullArgs;
