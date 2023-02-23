import http from "http";
import url from "url";
import { calculator } from "./functions.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { PORT } = process.env;

const handleError = (resp: http.ServerResponse) => {
  resp.writeHead(404, {
    "Content-Type": "text/html",
  });

  resp.write(`<h1>ERROR 404</h1> <p>Pathname not found</p>`);
};

const server = http.createServer((req, resp) => {
  console.log("Server ok");
  const { pathname, query } = url.parse(req.url!);

  if (pathname !== "/calculator") {
    if (pathname !== "/favicon.ico") {
      server.emit("error", new Error("404"));
      handleError(resp);
      return;
    }
  }

  if (!query) {
    server.emit("error", new Error("404"));
    handleError(resp);
    return;
  }

  const parseQuery = query?.split("&").map((item) => item.split("="));
  if (!parseQuery) return;
  const queryData = {
    a: Number(parseQuery[0][1]),
    b: Number(parseQuery[1][1]),
  };

  if (isNaN(queryData.a) || isNaN(queryData.b)) {
    server.emit("error", new Error("404"));
    handleError(resp);
    return;
  }

  const data = calculator(queryData.a, queryData.b);

  switch (req.method) {
    case "GET":
      resp.writeHead(200, {
        "Content-Type": "text/html",
      });

      resp.write(
        `<h1>Calculator results</h1><main><p>${queryData.a} + ${queryData.b} = ${data.add}</p>
        <p>${queryData.a} - ${queryData.b} = ${data.substract}</p>
        <p>${queryData.a} * ${queryData.b} = ${data.multiply}</p>
        <p>${queryData.a} / ${queryData.b} = ${data.divide}</p>
        </main>`
      );
      break;
    case "PATCH":
      break;
    case "POST":
      break;
    case "DELETE":
      resp.write("Sin implementar de momento el método " + req.method);
      break;
    default:
      resp.write("No conozco ese metodo");
  }

  resp.end();
});
server.on("error", () => {
  console.error("error", 404);
});
server.listen(PORT);
