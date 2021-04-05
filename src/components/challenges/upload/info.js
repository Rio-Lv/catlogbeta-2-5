import FadeIn from "react-fade-in";

const info = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        color: "#4e4e4e",
        fontSize: "20px",
      }}
    >
      <FadeIn>
        <p1>Drag and Drop an Image</p1>
        <br />
        <p1>or</p1>
        <br />
        <p1>Click to open file explorer</p1>
      </FadeIn>
    </div>
  );
};
const infoHover = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        color: "#4e4e4e",
        fontSize: "20px",
      }}
    >
      <FadeIn>
        <p1>
          Images should be a perfect square within 1500px to 3500px length
        </p1>
        <br />
        <p1>
          If the images arent squares they will be resized(not cropped) into
          squares, ps... please do your own crop, its hard to code it in :(
        </p1>
        <br />
        <p1>
          You can replace your submission for this week by submitting again
        </p1>
      </FadeIn>
    </div>
  );
};

export { info, infoHover };
