import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import Request from "../../api/Request";
import { useNavigate } from "react-router-dom";

export default function NewExerciseRedirection() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const navigate = useNavigate();
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    Request("exercises", ":token", "new")
      .params({ token })
      .post({})
      .then((v): undefined => {
        if (v.message === "Invalid token") return;
        if (v.$ok) {
          navigate("/exercises/edit/" + JSON.parse(v.message).id, {
            replace: true,
          });
        } else {
          navigate("/exercises/error", { replace: true });
        }
      });
  });

  return <div>Waiting for redirection ...</div>;
}
