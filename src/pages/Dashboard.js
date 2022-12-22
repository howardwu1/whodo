import { AppContext } from "../App";
import { useContext } from "react";

const Dashboard = () => {
  const { username } = useContext(AppContext);
  return <h1>Dashboard {username}</h1>;
};

export default Dashboard;
