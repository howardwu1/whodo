import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import { AppContext } from "../App";

const Layout = () => {
  const { username, setUsername } = useContext(AppContext);
  const [userDropdown, setUserDropdown] = useState(false);
  const loginButtonRef = useRef(null);
  const navigate = useNavigate();
  return (
    <>
      <nav className="navigation">
        <img
          src={"whodo.svg"}
          alt={"WhoDo Logo"}
          style={{ height: "25px", margin: "0 0.5em 0 1.5em" }}
          onClick={() =>
            username ? navigate("/dashboard") : navigate("/login")
          }
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
                <Link
                  onClick={() => setUserDropdown(true)}
                  ref={loginButtonRef}
                >
                  {username}
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {userDropdown ? (
        <div
          onClick={() => setUserDropdown(false)}
          style={{
            width: "100%",
            height: "100vh",
            zIndex: "1",
            position: "fixed",
          }}
        >
          <div
            style={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              position: "fixed",
              marginLeft: "auto",
              right: loginButtonRef.current.getBoundingClientRect()["y"] + "px",
              top: "50px",
              width: "130px",
              zIndex: "2",
            }}
          >
            <img
              src="blank-profile-picture-973460_1280.webp"
              className="profile-pic"
            />
            <p
              style={{
                borderBottom: "1.5px solid lightgray",
                fontWeight: "bold",
                paddingBottom: "1em",
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              {username}
            </p>
            <div
              style={{
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
                fontSize: "10pt",
                borderBottom: "1.5px solid lightgray",
              }}
            >
              <Link to="/profile" className="profile-menu">
                Profile
              </Link>
              <Link to="/reports" className="profile-menu">
                Reports
              </Link>
            </div>
            <div
              style={{
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
                fontSize: "10pt",
              }}
            >
              <Link
                to="/login"
                className="profile-menu"
                onClick={() => setUsername("")}
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <Outlet />
    </>
  );
};

export default Layout;
