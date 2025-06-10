import React from "react";

const Title = ({
  title,
  subTitle,
  align = "center",
  font = "font-playfair",
}) => {
  return (
    <div
      className={`flex flex-col justify-center mb-8 md:mb-16 ${
        align === "left" ? "items-start text-left" : "items-center text-center"
      }`}
    >
      <h1 className={`text-2xl md:text-4xl md:text-[40px] ${font}`}>{title}</h1>
      {subTitle && (
        <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-xl">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default Title;
