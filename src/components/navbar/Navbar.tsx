import ThemeButton from "./ThemeButton";
import DesktopMenu from "./DesktopMenu";
import Logo from "./Logo";
import AccountButton from "./AccountButton";
import MobileMenuButton from "./MobileMenuButton";
import { auth } from "@/auth";

async function NavBar() {
  const session = await auth();

  return (
    <div className="z-50 w-screen h-16 fixed top-0 left-0 right-0 bg-primary text-primary-foreground">
      <div className="h-full px-8 mx-auto items-center max-w-7xl grid grid-row-1 grid-cols-2 lg:grid-cols-3 my-auto">
        <div className="flex justify-between py-2 justify-self-start">
          <Logo />
        </div>
        <DesktopMenu />
        <div className="flex gap-2 justify-self-end">
          <ThemeButton />
          <AccountButton session={session} />
          <MobileMenuButton />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
