import { useRef, useState, type FormEvent } from "react";
import { CustomInput } from "../common/input";
import { Link, useNavigate } from "react-router";
import { CustomButton } from "../common/button";
import { Logo } from "../common/logo";
import useApiRequest from "hooks/request";
import apiClient from "services/api-service";
import { MessageRes } from "components/common/message";
// import { useRouter } from "next/navigation";
// import apiClient from "@/services/apiService";
// import { User } from "@/types";

export const SignUpForm = () => {
  const { loading, error, makeRequest } = useApiRequest<unknown, string>();

  const navigate = useNavigate()

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
      console.log(data)
      // if (data) {
      //   localStorage.setItem("userId", data.id);
      //   localStorage.setItem("email", data.email);
      // }
      formRef.current?.reset();
      await navigate('/verify-message')
    } catch (err) {
      formRef.current?.reset();
      console.error(err)
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 border-2 rounded-2xl border-gray-200 p-10 bg-white min-w-[30rem]">
      <div className="flex items-center flex-col gap-2 mb-3">
        <h2 className="font-semibold text-xl">Masuk Ke</h2>
        <Logo variant="text"/>
      </div>
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
          title={"Daftar"}
          type="submit"
          otherStyle="w-full py-2.5"
          loading={loading}
        />
      </div>

      <p className="text-center mt-6 text-sm text-gray-600">
        Sudah punya akun?{" "}
        <Link
          className="text-emerald-500 hover:text-emerald-600 font-medium"
          to={`/`}
        >
          Masuk
        </Link>
      </p>
    </form>
  );
};
