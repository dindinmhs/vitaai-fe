"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { CustomButton, CustomInput, MessageRes } from "../common";
import useApiRequest from "@/hooks/useRequest";
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiService";
import { User } from "@/types";

export const SignUpForm = () => {
  const { loading, error, makeRequest } = useApiRequest<User, string>();

  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await makeRequest(() =>
        apiClient.post("/auth/signup", form)
      );
      if (data) {
        localStorage.setItem("userId", data.id);
        localStorage.setItem("email", data.email);
      }
      formRef.current?.reset();
      await router.push("/verify");
    } catch (err) {
      formRef.current?.reset();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-4">
        <CustomInput
          title="Nama Lengkap"
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
          value={form.name}
        />
        <CustomInput
          type="email"
          title="Email"
          handleChange={(e) => setForm({ ...form, email: e.target.value })}
          value={form.email}
        />
        <CustomInput
          type="password"
          value={form.password}
          title="Password"
          handleChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <MessageRes error={error} />

      <div className="mt-4">
        <CustomButton
          title={loading ? "Memproses..." : "Daftar"}
          type="submit"
          loading={loading}
          otherStyle="w-full py-2.5"
        />
      </div>

      <p className="text-center mt-6 text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link
          className="text-red-500 hover:text-red-600 font-medium"
          href={`/signin`}
        >
          Masuk
        </Link>
      </p>
    </form>
  );
};
