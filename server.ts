import { z } from "zod";

const schema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string().optional(),
      data: z.object({
        name: z.string(),
        icon: z.string().optional(),
      }),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }),
  ),
  edges: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
    }),
  ),
});

const server = Bun.serve({
  port: 3000,
  fetch: async (request) => {
    const json = await request.text();
    const data = schema.parse(JSON.parse(json));
    if (!data?.nodes?.length) {
      return new Response("Error", {
        status: 500,
      });
    }
    Bun.write("./public/path.json", JSON.stringify(data, null, 2));
    return new Response("");
  },
});

console.log(`Listening on ${server.url}`);
