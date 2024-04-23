const BACK_URL = "http://localhost";
const BACK_PORT = 3002;

export default function Request(...path: string[]) {
  let uri = BACK_URL + ":" + BACK_PORT + "/" + path.join("/");
  let header = {
    "Content-Type": "application/json",
  };

  return {
    params: (params: any) => {
      return Request(...populate_params(path, params));
    },
    post: (body: any) => fetch_(uri, "POST", header, body),
    get: () => fetch_(uri, "GET", header, null),
    header: (h: any) => (header = h),
  };
}

function populate_params(path: string[], params: any): string[] {
  let populated_path: string[] = [];

  path.forEach((p) => {
    if (p.startsWith(":")) {
      if (params[p.substring(1)] !== undefined)
        populated_path.push(params[p.substring(1)]);
      else populated_path.push(p);
    } else populated_path.push(p);
  });

  return populated_path;
}

function fetch_(path: string, method: string, header: any, body: any) {
  console.log(method + " : " + path);
  return fetch(path, {
    method: method,
    headers: header,
    body: body ? JSON.stringify(body) : null,
  }).then(async (v) => {
    if (!v.headers.get("content-type")?.startsWith("application/json")) {
      console.log("HEADER_TYPE " + v.headers.get("content-type"));
      return v;
    }
    let data = await v.json();
    data["$ok"] = v.ok;
    return data;
  });
}
