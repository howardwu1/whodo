import BlogArticle from "../component/BlogArticle";
const Blog = () => {
  return (
    <div>
      <h1>WhoDo Blog</h1>
      <h3>All things WhoDo - Updates/News/Random Musings</h3>
      <br />
      <br />

      <div className="columnContainer">
        <div style={{ maxWidth: "1200px", display: "flex" }}>
          <div className="column">
            <BlogArticle />
          </div>
          <div className="blog-links-column">
            <h3> New To WhoDo </h3>
            <div className="whodo-links">
              <ul>
                <li>
                  <a href="#">How To Get Set Up</a>
                </li>
                <li>
                  <a href="#">Contributing to WhoDo</a>
                </li>
                <li>
                  <a href="#">Microcontracting and WhoDo</a>
                </li>
              </ul>
            </div>
            <div>
              <h3> Blog Posts </h3>
              <div className="whodo-links">
                <ul>
                  <li>
                    <a href="#">Our Philosophy On Mentorship and Giving Back</a>
                  </li>
                  <li>
                    <a href="#">"WhoDo" We Look To Mentor</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
