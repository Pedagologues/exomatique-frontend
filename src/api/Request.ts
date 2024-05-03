const BACK_URL = process.env.REACT_APP_BACKEND_HOST;
const BACK_PORT = process.env.REACT_APP_BACKEND_PORT;

export default function Request(...path: string[]) {
  let uri = BACK_URL + ":" + BACK_PORT + "/" + path.join("/");
  console.log(uri)
  let header = {
    "Content-Type": "application/json",
  };

  return {
    params: (params: any) => {
      return Request(...populate_params(path, params));
    },
    post: (body: any) => fetch_(uri, "POST", header, body),
    get: (body?: any) => fetch_(uri, "GET", header, body || null),
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

async function fetch_(path: string, method: string, header: any, body: any) {
  const v = await fetch(path, {
    method: method,
    headers: header,
    body: body ? JSON.stringify(body) : null,
  });
  if (!v.headers.get("content-type")?.startsWith("application/json")) return v;
  let data = await v.json();
  data["$ok"] = v.ok;
  return await data;
}
