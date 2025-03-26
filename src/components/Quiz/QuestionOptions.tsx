import React from "react";
import { QuestionOptionsProps } from "../../types";

const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  options,
  selectedOption,
  setSelectedOption,
}) => {
  return (
    <ul className="w-4/5 text-sm font-medium text-gray-900 bg-slate-800 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ml-6 mb-4">
      {options.map((option, index) => (
        <li
          key={index}
          className={`w-full border-b border-gray-200 ${
            index === options.length - 1 ? "rounded-b-lg" : ""
          } dark:border-gray-600`}
        >
          <div className="flex items-center pl-3">
            <input
              type="radio"
              name="list-radio"
              id={option}
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
              className="w-5 h-5 bg-gray-100 border-gray-300 focus:ring-cyan-950"
            />
            <label
              htmlFor={option}
              className="w-full py-3 ml-2 text-xl font-medium text-gray-300 dark:text-gray-300"
            >
              {option}
            </label>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default QuestionOptions;
