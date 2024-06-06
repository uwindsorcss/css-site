import React from "react";

interface IconCardProps {
  icon: any;
  heading: string;
  description: string;
}

function IconCard({ icon, heading, description }: IconCardProps) {
  return (
    <div className="dark:bg-card/50 flex max-w-sm transform cursor-default flex-col items-center gap-4 rounded-md border border-border bg-card p-8 drop-shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-2">
      {React.createElement(icon, { className: "w-12 h-12 lg:w-16 lg:h-16" })}
      <h3 className="text-center text-xl font-bold lg:text-2xl">{heading}</h3>
      <h4 className="lg:text-md text-center text-sm text-muted-foreground">{description}</h4>
    </div>
  );
}

export default IconCard;
