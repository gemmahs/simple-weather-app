import FadeLoader from "react-spinners/FadeLoader";

const override = {
  display: "block",
  margin: "0 auto",
  opacity: "0.5",
};

export default function Spinner() {
  return <FadeLoader cssOverride={override} color="#a7a7a7" />;
}
