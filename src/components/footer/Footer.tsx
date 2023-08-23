import { BsGithub, BsLinkedin, BsTwitter, BsYoutube } from "react-icons/bs";
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import SocialIcon from "./SocialIcon";

const Footer = () => {
  return (
    <footer className="bg-primary/95 text-primary-foreground py-8 text-center">
      <div className="flex justify-center gap-4 mb-5">
        <SocialIcon
          href="https://www.linkedin.com/company/uwindsor-css/"
          icon={BsLinkedin}
        />
        <SocialIcon href="https://twitter.com/UWindsorCSS" icon={BsTwitter} />
        <SocialIcon
          href="https://instagram.com/uwindsorcss"
          icon={AiFillInstagram}
        />
        <SocialIcon
          href="https://facebook.com/uwindsorcss"
          icon={AiFillFacebook}
        />
        <SocialIcon href="https://youtube.com/@uwindsorcss" icon={BsYoutube} />
        <SocialIcon href="https://github.com/uwindsorcss" icon={BsGithub} />
      </div>
      <p>
        &copy; {new Date().getFullYear()} University of Windsor Computer Science
        Society. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
