const privateResolver = (
  resolverFunction: (parent, args, context, info) => any
) => async (parent, args, context, info) => {
  if (!context.request.user) {
    throw new Error("로그인된 사용자가 업습니다. 먼저 로그인해주세요");
  }
  const resolved = await resolverFunction(parent, args, context, info);
  return resolved;
};

export default privateResolver;
