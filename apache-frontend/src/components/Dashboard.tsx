import React, { useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

const Dashboard = () => {
  const { currentUser }: any = useContext(AuthContext);

  var navigate: NavigateFunction = useNavigate();

  const { firstName, lastName } = currentUser;

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h1>
        Welcome {firstName} {lastName}
      </h1>
      <button
        onClick={() => {
          navigate("/", { replace: true });
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
