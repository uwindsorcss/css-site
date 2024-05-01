import ThemeButton from "./ThemeButton";
import DesktopMenu from "./DesktopMenu";
import Logo from "./Logo";
import AccountButton from "./AccountButton";
import MobileMenuButton from "./MobileMenuButton";
import { auth } from "@/auth";
import AlertBanner from "../ui/alert-banner";
import alertBanner from "./alertBanner.json";

async function NavBar() {
  const session = await auth();

  return (
    <div className="z-50 w-full fixed top-0 left-0 right-0 bg-primary text-primary-foreground">
      {alertBanner && alertBanner.display && (
        <AlertBanner
          id={alertBanner.id}
          prefix={alertBanner.prefix}
          text={alertBanner.text}
          url={alertBanner.url}
          expirationDate={new Date(alertBanner.expirationDate)}
          hideOnMobile={alertBanner.hideOnMobile}
          linkText={alertBanner.linkText}
        />
      )}
      <div className="h-full px-8 my-1 mx-auto items-center max-w-7xl grid grid-row-1 grid-cols-2 lg:grid-cols-3">
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
