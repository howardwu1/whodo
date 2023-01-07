const ContentPlaceholder = ({ color }) => {
  console.log(color);
  return (
    <>
      <div
        style={{
          margin: "20% 10% 0% 10%  ",
          backgroundColor: color,
          height: "50px",
          borderRadius: "5pt",
        }}
      />

      <div
        style={{
          margin: "2% 10% 0% 10%  ",
          backgroundColor: color,
          height: "30px",
          borderRadius: "5pt",
        }}
      />

      <div
        style={{
          margin: "2% 10% 0% 10%  ",
          backgroundColor: color,
          height: "40px",
          borderRadius: "5pt",
        }}
      />
      <div
        style={{
          margin: "2% 10% 0% 10%  ",
          backgroundColor: color,
          height: "50px",
          borderRadius: "5pt",
        }}
      />
    </>
  );
};

export default ContentPlaceholder;
