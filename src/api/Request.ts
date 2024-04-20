const BACK_URL = "http://localhost";
const BACK_PORT = 3002;

export default function request(...path: string[]) {
  let uri = BACK_URL + ":" + BACK_PORT + "/" + path.join("/");
  let header = {
    "Content-Type": "application/json",
  };

  return {
    post: (body: any) => fetch_(uri, "POST", header, body),
    get: (body: any) => fetch_(uri, "GET", header, body),
    header: (h: any) => (header = h),
  };
}

function fetch_(path: string, method: string, header: any, body: any) {
  return fetch(path, {
    method: method,
    headers: header,
    body: JSON.stringify(body),
  }).then((v) => v.json());
}
