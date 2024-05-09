import { cookies } from "next/headers";
import clsx from "clsx";
import Link from "next/link";
import DismissBannerButton from "./dismiss-banner-button";

interface AlertBannerProps {
  id: string;
  prefix: string;
  text: string;
  url: string;
  expirationDate?: Date;
  hideOnMobile?: boolean;
  linkText?: string;
}

function AlertBanner({
  id,
  expirationDate,
  hideOnMobile,
  linkText,
  prefix,
  text,
  url,
}: AlertBannerProps) {
  const cookieStore = cookies();
  const dismissalCookieId = `dismiss_banner_${id}`;

  const isShown =
    !cookieStore.get(dismissalCookieId) &&
    (!expirationDate || expirationDate.getTime() > Date.now());

  async function dismissBanner(dismissalCookieId: string) {
    "use server";
    cookies().set(dismissalCookieId, "true", {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  if (!isShown) return null;

  const Text = () => (
    <>
      {prefix && (
        <span className="font-bold after:font-normal after:content-['|'] after:ml-2 after:mr-2">
          {prefix}
        </span>
      )}
      {text}
    </>
  );

  return (
    <div
      id={dismissalCookieId}
      className={clsx(
        "items-center p-1 text-center bg-indigo-600 text-xs sm:text-sm text-primary-foreground select-none",
        hideOnMobile ? "hidden md:flex" : "flex"
      )}>
      <div className="flex-1">
        {url && url.length > 0 ? (
          <Link href={url}>
            <Text />
            {linkText && (
              <span className="ml-2 text-white underline whitespace-nowrap">{linkText}</span>
            )}
          </Link>
        ) : (
          <Text />
        )}
      </div>
      <div className="flex-grow-0">
        <DismissBannerButton dismissalCookieId={dismissalCookieId} dismissBanner={dismissBanner} />
      </div>
    </div>
  );
}

export default AlertBanner;
