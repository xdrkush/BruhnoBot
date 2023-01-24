// import "./MainLayout.css"
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";

export default function MainLayout({ children } : any) {

  return (
    <div className="MainLayout">
      <NavbarHome />
        <main>
          {children}
        </main>
      <FooterHome />
    </div>
  );
};