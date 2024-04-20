import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { CredentialsSlice } from "./CredentialsStore";

export default function Logout() {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(CredentialsSlice.actions.reset());
    }, [dispatch]);
    return <Navigate to="../" replace />;
  }