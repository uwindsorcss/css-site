import React from "react";

interface IconCardProps {
  icon: any;
  title: string;
  description: string;
}

function IconCard({ icon, title, description }: IconCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 max-w-sm">
      {React.createElement(icon, { className: "w-12 h-12 lg:w-16 lg:h-16" })}
      <h3 className="text-xl lg:text-2xl font-bold text-center">{title}</h3>
      <h4 className="text-sm lg:text-md text-center text-muted-foreground">
        {description}
      </h4>
    </div>
  );
}

export default IconCard;
