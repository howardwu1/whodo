import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="navigation">
        <img
          src={"./whodo.svg"}
          alt={"WhoDo Logo"}
          style={{ height: "50px", margin: "0 1em" }}
        />
        <h1 style={{ color: "white" }}> WhoDo </h1>
        <div className="navigation-menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
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
