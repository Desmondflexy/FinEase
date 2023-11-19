import Header from "./Header";

function Layout({children}: LayoutProps){
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default Layout;

interface LayoutProps {
  children: React.ReactNode;
}