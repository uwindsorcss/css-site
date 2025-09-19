import fs from "fs/promises";
import path from "path";
import Image from "next/image";
import Anika from "../easter-eggs/Anika";

interface Member {
  name: string;
  image: string;
  position: string;
}

const EASTER_EGGS = {
  "Anika Khan": <Anika />
};

async function BoardMembers() {
  const membersFile = await fs.readFile(
    path.join(process.cwd(), "src", "components", "about") + "/content.json",
    "utf8"
  );
  const members = JSON.parse(membersFile) as Member[];

  return (
    <div className="not-prose grid grid-cols-2 gap-6 p-4 sm:grid-cols-3">
      {members.map((member, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="relative mb-2 h-24 w-24">
            <Image
              src={member.image}
              alt={member.name}
              className="rounded-full"
              fill
              sizes="100vw"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <p className="text-md font-semibold">
            {EASTER_EGGS[member.name as keyof(typeof EASTER_EGGS)] ?? member.name}
          </p>
          <p className="text-sm text-gray-300">{member.position}</p>
        </div>
      ))}
    </div>
  );
}

export default BoardMembers;
