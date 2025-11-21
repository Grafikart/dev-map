const server = Bun.serve({
  port: 3000,
  fetch: async (request) => {
    const json = await request.text();
    const data = JSON.parse(json);
    if (!data?.nodes?.length) {
      return new Response("Error", {
        status: 500,
      });
    }
    Bun.write("./public/path.json", json);
    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on ${server.url}`);
