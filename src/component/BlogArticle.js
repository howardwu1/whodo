import { Link } from "react-router-dom";

const BlogArticle = () => {
  return (
    <>
      <div className="blog-title">
        <img
          className="profile-pic"
          src="blank-profile-picture-973460_1280.webp"
        />
        <div>
          <p>
            Written by:{" "}
            <Link
              to="/author/howard-lorum-wu"
              state={{ name: "Howard Lorum Wu" }}
            >
              Howard Lorum Wu
            </Link>{" "}
            on December 18, 2022
          </p>
          <h1 style={{ width: "100%" }}>What is WhoDo</h1>
          <img src={"sample-1.jpeg"} />
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vel tortor pharetra diam porta rhoncus non id nibh. Aliquam vitae
            tortor tristique, accumsan ligula quis, fermentum leo. In non sapien
            non tortor blandit efficitur. In ligula justo, feugiat nec tellus
            sed, consectetur ultrices magna. In cursus, mauris et porta
            ultrices, libero nunc bibendum odio, eu facilisis enim turpis id
            lorem. Phasellus massa ipsum, hendrerit vitae metus quis, efficitur
            sodales purus. Etiam rutrum hendrerit ex, ut congue ex auctor non.
            Sed interdum orci dui, nec porttitor enim malesuada nec. Proin nibh
            orci, porta feugiat cursus a, fringilla a nisl. Fusce euismod
            consequat sapien, eu rutrum odio.
          </h4>
        </div>
      </div>
    </>
  );
};

export default BlogArticle;
