import { useParams } from "react-router-dom";

const Author = () => {
  const { name } = useParams();

  const formatName = (name) => {
    let words = name.split("-");
    words = words.map((word) => word[0].toUpperCase() + word.substring(1));
    return words.join(" ");
  };

  return (
    <>
      <h1>{formatName(name)}'s Articles</h1>

      <ul>
        <li>
          <a href="#">Sample Article</a>
        </li>
      </ul>
    </>
  );
};

export default Author;
