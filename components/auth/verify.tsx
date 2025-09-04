import { useRef, useState } from "react";
import { CustomInput } from "../common/input";
import { Link } from "react-router";
import { CustomButton } from "../common/button";
import { MessageRes } from "../common/message";
import { Logo } from "../common/logo";
// import useApiRequest from "@/hooks/useRequest";
// import { useRouter } from "next/navigation";
// import apiClient from "@/services/apiService";
// import { User } from "@/types";

export const VerifyForm = () => {
  // const { loading, error, makeRequest } = useApiRequest<User, string>();

  // const router = useRouter();

  // const formRef = useRef<HTMLFormElement | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const data = await makeRequest(() =>
  //       apiClient.post("/auth/signup", form)
  //     );
  //     if (data) {
  //       localStorage.setItem("userId", data.id);
  //       localStorage.setItem("email", data.email);
  //     }
  //     formRef.current?.reset();
  //     await router.push("/verify");
  //   } catch (err) {
  //     formRef.current?.reset();
  //   }
  // };

  return (
    // <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
    <form className="flex flex-col gap-4 border-2 rounded-2xl border-gray-200 p-10 bg-white min-w-[30rem]">
      <div className="flex items-center flex-col gap-2 mb-3">
        <h2 className="font-semibold text-xl">Verifikasi Email</h2>
        <Logo variant="text"/>
      </div>
      <div className="space-y-4">
        <p className="text-center">Kami telah mengirim email. Verifikasi email anda.</p>
      </div>
    </form>
  );
};
