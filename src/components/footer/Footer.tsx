import SocialIcon from "./SocialIcon";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiX,
  SiYoutube,
  SiGithub,
} from "@icons-pack/react-simple-icons";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-14 px-5 text-center">
      <div className="flex justify-center gap-4 mb-8">
        <SocialIcon href="https://www.linkedin.com/company/uwindsorcss/" icon={SiLinkedin} />
        <SocialIcon href="https://x.com/UWindsorCSS" icon={SiX} />
        <SocialIcon href="https://instagram.com/uwindsorcss" icon={SiInstagram} />
        <SocialIcon href="https://facebook.com/uwindsorcss" icon={SiFacebook} />
        <SocialIcon href="https://youtube.com/@uwindsorcss" icon={SiYoutube} />
        <SocialIcon href="https://github.com/uwindsorcss" icon={SiGithub} />
      </div>
      <p>
        &copy; {new Date().getFullYear()} University of Windsor Computer Science Society. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
