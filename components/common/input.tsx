"use client";

import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface inputType extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  type?: string;
  handleChange?: (e: any) => void;
  msg?: string[] | null;
  required?: boolean;
  value?: string;
}

export const CustomInput = ({
  title,
  type = "text",
  msg,
  handleChange,
  required = true,
  value = "",
}: inputType) => {
  const [isHide, setHide] = useState(true);

  if (type === "password") {
    return (
      <div className="space-y-1">
        <label
          htmlFor={title}
          className="block text-sm font-medium text-gray-700"
        >
          {title}
        </label>
        <div className="flex w-full p-2 gap-2 border border-gray-300 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 rounded-lg transition-all duration-200">
          <input
            id={title}
            placeholder={`Masukan ${title}`}
            type={isHide ? "password" : "text"}
            className="block flex-1 focus:outline-none text-gray-900 placeholder:text-gray-400 text-sm"
            onChange={handleChange}
            required={required}
            value={value}
          />
          <button
            type="button"
            onClick={() => setHide(!isHide)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {isHide ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
          </button>
        </div>
        <small className="text-emerald-500 text-xs">{msg ? msg : " "}</small>
      </div>
    );
  }

  if (type === "area") {
    return (
      <div className="space-y-1">
        <label
          htmlFor={title}
          className="block text-sm font-medium text-gray-700"
        >
          {title}
        </label>
        <textarea
          id={title}
          placeholder={`Masukan ${title}`}
          className="w-full p-2 border border-gray-300 focus-within:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg transition-all duration-200 text-sm"
          onChange={handleChange}
          required={required}
          value={value}
        />
        <small className="text-red-500 text-xs">{msg ?? " "}</small>
      </div>
    );
  }

  return (
  <div className="space-y-1">
    <label
      htmlFor={title}
      className="block text-sm font-medium text-gray-700"
    >
      {title}
    </label>
    <input
      id={title}
      placeholder={`Masukan ${title}`}
      type={type}
      className="w-full p-2 border border-gray-300 focus:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 rounded-lg transition-all duration-200 text-sm focus:outline-none"
      onChange={handleChange}
      required={required}
      accept={type === "file" ? "image/*" : undefined}
      {...(type !== "file" ? { value } : {})} 
    />
    <small className="text-red-500 text-xs">{msg ?? " "}</small>
  </div>
);

};
