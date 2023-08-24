import SocialIcon from "./SocialIcon";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiTwitter,
  SiYoutube,
  SiGithub,
} from "@icons-pack/react-simple-icons";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 text-center">
      <div className="flex justify-center gap-4 mb-5">
        <SocialIcon
          href="https://www.linkedin.com/company/uwindsor-css/"
          icon={SiLinkedin}
        />
        <SocialIcon href="https://twitter.com/UWindsorCSS" icon={SiTwitter} />
        <SocialIcon
          href="https://instagram.com/uwindsorcss"
          icon={SiInstagram}
        />
        <SocialIcon href="https://facebook.com/uwindsorcss" icon={SiFacebook} />
        <SocialIcon href="https://youtube.com/@uwindsorcss" icon={SiYoutube} />
        <SocialIcon href="https://github.com/uwindsorcss" icon={SiGithub} />
      </div>
      <p>
        &copy; {new Date().getFullYear()} University of Windsor Computer Science
        Society. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
