import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/css-logo-shield.png"
        alt="CSS Logo"
        width={40}
        height={40}
      />
    </Link>
  );
}

export default Logo;
