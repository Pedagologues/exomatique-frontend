const BACK_URL = import.meta.env.VITE_REACT_APP_BACKEND_HOST;
const BACK_PORT = import.meta.env.VITE_REACT_APP_BACKEND_PORT;

class RequestObj {
  use_env: boolean;
  path: string[];
  timeout_v: number;
  header: any;
  constructor(...path: string[]) {
    this.path = path;
    this.use_env = true;
    this.timeout_v = 1000;
    this.header = {
      "Content-Type": "application/json",
    };
  }

  public env(b: boolean) {
    this.use_env = b;
    return this;
  }

  public params(params: any) {
    let populated_path: string[] = [];

    this.path.forEach((p) => {
      if (p.startsWith(":")) {
        if (params[p.substring(1)] !== undefined)
          populated_path.push(params[p.substring(1)]);
        else populated_path.push(p);
      } else populated_path.push(p);
    });
    this.path = populated_path;

    return this;
  }

  public timeout(t: number | undefined) {
    this.timeout_v = t || -1;
    return this;
  }

  public uri(): string {
    if (this.use_env)
      return (
        BACK_URL +
        (BACK_PORT !== "" ? ":" + BACK_PORT : "") +
        "/" +
        this.path.join("/")
      );
    else return this.path.join("/");
  }

  public post(body?: any) {
    return fetch_(this.uri(), "POST", this.header, body, this.timeout_v);
  }

  public get(body?: any) {
    return fetch_(this.uri(), "GET", this.header, body || null, this.timeout_v);
  }
}

export default function Request(...path: string[]) {
  return new RequestObj(...path);
}

async function fetch_(
  path: string,
  method: string,
  header: any,
  body: any,
  timeout: number
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let data: any = null;
    if (timeout > 0)
      setTimeout(() => {
        if (data == null)
          reject(new Error("Timeout on " + method + " " + path));
      }, timeout);

    fetch(path, {
      method: method,
      headers: header,
      body: body ? JSON.stringify(body) : null,
    })
      .then((response) => {
        if (response == null) {
          reject(new Error("Undefined"));
        } else if (
          !response.headers.get("content-type")?.startsWith("application/json")
        ) {
          resolve(response);
        } else {
          response.json().then((data) => {
            data["$ok"] = response.ok;
            data["$status"] = response.status;
            data["$status_text"] = response.statusText;
            resolve(data);
          });
        }
      })
      .catch((e) => {});
  });
}
