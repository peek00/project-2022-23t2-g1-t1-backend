export const initialPolicy = [
  {
    endpoint: "*",
    GET: ["Owner"],
    POST: ["Owner"],
    PUT: ["Owner"],
    DELETE: ["Owner"],
  },
  {
    endpoint: "/auth",
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
  }
]
