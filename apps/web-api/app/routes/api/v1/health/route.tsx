export const loader = async () => {
  return Response.json({
    status: 200,
    body: {
      message: 'Hello, from the health directory',
    },
  });
};
