import { Link } from "react-router-dom";

function Home(){
  return (
    <>
      <h1>Home</h1>
      <p>Home page content</p>
      <Link to="/signup">Get started</Link>
    </>
  )
}

export default Home;