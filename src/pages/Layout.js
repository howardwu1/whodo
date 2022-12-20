import { Outlet, Link } from "react-router-dom";

const Layout = () => {
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
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
