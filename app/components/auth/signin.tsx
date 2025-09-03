"use client";

import { Link } from "react-router";
import { CustomInput } from "../common/input";
import { useState } from "react";
import { MessageRes } from "../common/message";
import { CustomButton } from "../common/button";
import { Logo } from "../common/logo";
// import { FormEvent, useRef, useState } from "react";
// import { CustomButton, CustomInput, MessageRes } from "../common";
// import apiClient from "@/services/apiService";
// import useApiRequest from "@/hooks/useRequest";
// import { SignInRes } from "@/types";
// import { useRouter } from "next/navigation";
// import useAuthStore from "@/hooks/authStore";

export const SignInForm = () => {
  // const { loading, error, makeRequest } = useApiRequest<SignInRes, string>();

  // const { setUser } = useAuthStore();

  // const router = useRouter();

  // const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const data = await makeRequest(() =>
  //       apiClient.post("/auth/signin", form)
  //     );
  //     console.log(data);
  //     if (data) {
  //       setUser({
  //         accessToken: data.accessToken,
  //         refreshToken: data.refreshToken,
  //         name: data.name,
  //         email: data.email,
  //         userId: data.userId,
  //         userRole: data.userRole,
  //       });
  //     }
  //     formRef.current?.reset();
  //     await router.push("/module");
  //   } catch (err) {
  //     formRef.current?.reset();
  //     console.log(err);
  //   }
  // };

  return (
    // <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
    <form className="flex flex-col gap-4">
      {/* Social Login Options */}
      
      <div className="flex items-center flex-col gap-2 mb-3">
        <h2 className="font-semibold text-xl">Masuk Ke</h2>
        <Logo variant="text"/>
      </div>
      <div className="space-y-4">
        <CustomInput
          type="email"
          title="Email"
          value={form.email}
          handleChange={(e) => {
            setForm({ ...form, email: e.target.value });
          }}
        />
        <CustomInput
          type="password"
          title="Password"
          value={form.password}
          handleChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center">
        </div>
        <Link
          className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
          to={`/forgot-password`}
        >
          Lupa password?
        </Link>
      </div>
      
      {/* <MessageRes error={error} /> */}
      
      <div className="mt-2">
        <CustomButton title={"Masuk"} type="submit" otherStyle="w-full py-2.5" />
      </div>
      
      <p className="text-center mt-6 text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link className="text-emerald-500 hover:text-emerald-600 font-medium" to={`/signup`}>
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
};
