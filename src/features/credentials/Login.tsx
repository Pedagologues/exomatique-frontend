import { useState } from "react";
import Request from "../../api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store";
import { CredentialsSlice, CredentialsState } from "./CredentialsStore";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  if (token !== null) {
    return <Navigate to="../" replace />;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Request("accounts", "login")
      .post({ username, password })
      .then((v) => {
        let state : CredentialsState = {
          ...v,
          clearOnLoad: !remember
        }
        dispatch(
          CredentialsSlice.actions.setToken(state
          )
        );
        navigate("../", { replace: true });
      });
  };

  return (
    <div>
      <div className="login-page">
        <div className="form">
          <form className="login-form">
            <div className="input-group m-b-20">
              <span className="input-group-addon">
                <i className="zmdi zmdi-account"></i>
              </span>
              <div className="fg-line">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  onChange={(e) => setUserName(e.target.value || "")}
                />
              </div>
            </div>

            <div className="input-group m-b-20">
              <span className="input-group-addon">
                <i className="zmdi zmdi-lock"></i>
              </span>
              <div className="fg-line">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value || "")}
                />
              </div>
            </div>
            <div className="checkbox-outer">
              <div className="checkbox">
                <label>
                  Remember me
                  <input id="checker" type="checkbox" defaultChecked={true}
                  onChange={(e) => {

                    setRemember(e.target.checked)
                  }}/>
                </label>
              </div>
            </div>

            <button onClick={handleSubmit}>login</button>
            {/* <p className="message">
              Unable to login? Contact our admin <a href="#">here</a>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
}
