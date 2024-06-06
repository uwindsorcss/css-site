import ThemeButton from "./ThemeButton";
import DesktopMenu from "./DesktopMenu";
import Logo from "./Logo";
import AccountButton from "./AccountButton";
import MobileMenuButton from "./MobileMenuButton";
import { auth } from "@/auth";
import AlertBanner from "../ui/alert-banner";
import alertBanner from "./alertBanner.json";
import clsx from "clsx";
import { zeroRightClassName } from "react-remove-scroll-bar";

async function NavBar() {
  const session = await auth();

  return (
    <div
      className={clsx(
        "fixed left-0 right-0 top-0 z-50 bg-primary text-primary-foreground",
        zeroRightClassName
      )}>
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
      <div className="grid-row-1 mx-auto my-1 grid h-full max-w-7xl grid-cols-2 items-center px-8 lg:grid-cols-3">
        <div className="flex justify-between justify-self-start py-2">
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
