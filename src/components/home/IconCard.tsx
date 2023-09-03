import React from "react";

interface IconCardProps {
  icon: any;
  heading: string;
  description: string;
}

function IconCard({ icon, heading, description }: IconCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 max-w-sm bg-card dark:bg-card/50 p-8 rounded-md border border-border cursor-default transition-all duration-300 ease-in-out transform hover:-translate-y-2">
      {React.createElement(icon, { className: "w-12 h-12 lg:w-16 lg:h-16" })}
      <h3 className="text-xl lg:text-2xl font-bold text-center">{heading}</h3>
      <h4 className="text-sm lg:text-md text-center text-muted-foreground">
        {description}
      </h4>
    </div>
  );
}

export default IconCard;
