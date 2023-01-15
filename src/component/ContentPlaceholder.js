const ContentPlaceholder = ({ color }) => {
  const heights = [50, 30, 40, 50];
  return (
    <>
      <div
        style={{
          marginTop: "20%",
        }}
      />
      {heights.map((height, index) => {
        return (
          <div
            key={height + "" + index}
            style={{
              margin: "2% 10% 0% 10%",
              backgroundColor: color,
              height: height + "px",
              borderRadius: "5pt",
            }}
          />
        );
      })}
    </>
  );
};

export default ContentPlaceholder;
