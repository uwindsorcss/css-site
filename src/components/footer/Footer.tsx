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
    <footer className="bg-primary px-5 py-20 text-center text-primary-foreground">
      <div className="mb-8 flex justify-center gap-4">
        <SocialIcon href="https://www.linkedin.com/company/uwindsorcss/" Icon={SiLinkedin} />
        <SocialIcon href="https://x.com/UWindsorCSS" Icon={SiX} />
        <SocialIcon href="https://instagram.com/uwindsorcss" Icon={SiInstagram} />
        <SocialIcon href="https://facebook.com/uwindsorcss" Icon={SiFacebook} />
        <SocialIcon href="https://youtube.com/@uwindsorcss" Icon={SiYoutube} />
        <SocialIcon href="https://github.com/uwindsorcss" Icon={SiGithub} />
      </div>
      <p>
        &copy; {new Date().getFullYear()} University of Windsor Computer Science Society. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
