import React from "react";
import { QuestionOptionsProps } from "../../types";

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <div className="w-full space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedOption === option;

        return (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`w-full px-5 py-3 text-lg rounded-lg transition-all duration-200 text-white 
              ${
                isSelected
                  ? "bg-primary-500 border-primary-600"
                  : "bg-dark-3 border-dark-4 hover:bg-dark-4"
              } 
              border shadow-md focus:outline-none`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionOptions;
