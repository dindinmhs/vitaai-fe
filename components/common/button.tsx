import React from "react";

interface button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  otherStyle?: string;
  loading?: boolean;
}

export const CustomButton = ({
  title,
  otherStyle,
  loading,
  ...otherProps
}: button) => {
  return (
    <button
      {...otherProps}
      disabled={loading}
      className={`rounded-full px-4 py-2 text-white font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-lg shadow-transparent hover:scale-105 hover:shadow-emerald-200 duration-200 flex justify-center items-center cursor-pointer ${otherStyle}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Memproses...
        </>
      ) : (
        title
      )}
    </button>
  );
};
