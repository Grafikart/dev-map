import { z } from "zod";

const schema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.string().optional(),
      data: z.object({
        name: z.string(),
        progress: z.number().min(0).max(100).optional(),
        rotate: z.boolean().optional(),
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
      type: z.string().optional(),
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
    // Clean edges to only keep exiting ones
    const nodeIds = new Set(data.nodes.map((n) => n.id));
    data.edges = data.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
    );
    Bun.write("./public/path.json", JSON.stringify(data, null, 2));
    return new Response("");
  },
});

console.log(`Listening on ${server.url}`);
