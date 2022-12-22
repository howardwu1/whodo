import { Outlet, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../App";

const Layout = () => {
  const { username } = useContext(AppContext);
  const [userDropdown, setUserDropdown] = useState(false);
  return (
    <>
      <nav className="navigation">
        <img
          src={"whodo.svg"}
          alt={"WhoDo Logo"}
          style={{ height: "25px", margin: "0 0.5em 0 1.5em" }}
        />
        <h3 style={{ color: "white" }}> WhoDo </h3>
        <div className="navigation-menu">
          <ul>
            <li>
              <Link to="/">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              {username === "" ? (
                <Link to="/login">Login</Link>
              ) : (
                <Link onClick={() => setUserDropdown(true)}>{username}</Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {userDropdown ? (
        <div
          style={{
            border: "1px solid black",
            position: "absolute",
            right: "300px",
          }}
        >
          <p>hey</p>
        </div>
      ) : null}
      <Outlet />
    </>
  );
};

export default Layout;
