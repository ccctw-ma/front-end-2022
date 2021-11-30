import Context from "./context";
import Table from "./fragment";
// const Button = lazy(() => import("./button"));
// const About = lazy(() => import("./about"));
import Example from "./hook"
function Home() {
  return (
    <div>
      <h1>Hello world</h1>
      <Context />
      <Table/>
      <Example/>
    </div>
  );
}

export default Home;
