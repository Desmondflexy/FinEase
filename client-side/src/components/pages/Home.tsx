import { Link } from "react-router-dom";

function Home(){
  return (
    <div id="home-screen">
      <h1>FinEase</h1>
      <hr />
      <p>Your personal finance app that helps you manage your money.</p>
      <Link to="/signup">Get started</Link>
    </div>
  )
}

export default Home;