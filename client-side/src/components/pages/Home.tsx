import { Link } from "react-router-dom";

function Home(){
  return (
    <div id="home-screen">
      <h1>Home</h1>
      <p>Home page content</p>
      <Link to="/signup">Get started</Link>
    </div>
  )
}

export default Home;