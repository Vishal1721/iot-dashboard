import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Activity } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const { registerUser, error, loading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (data) => {
    delete data.confirmPassword;
    try {
      await registerUser(data);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const password = watch("password");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear + i);

  const fields = [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      placeholder: "Ritika",
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      placeholder: "devi",
    },
    {
      name: "registerNumber",
      label: "Register number",
      type: "text",
      placeholder: "e.g. 7376231EC259",
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "e.g. Ritika123",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "you@bitsathy.ac.in",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      {/* bg */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M48 0H0V48"
                fill="none"
                stroke="rgb(148 163 184)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-teal-500/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-600/8 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* logo */}
        <div className="flex items-center gap-2 mb-8">
          {/* <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div> */}
          <span className="text-sm font-semibold text-slate-200 tracking-tight">
            IoT<span className="text-teal-400">Hub</span>
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-1">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Fill in your details to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* standard text fields */}
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs text-slate-400 mb-1.5">
                {label}
              </label>
              <Input
                type={type}
                placeholder={placeholder}
                {...register(name, { required: `${label} is required` })}
                className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-600 rounded-lg"
              />
              {errors[name] && (
                <p className="text-xs text-red-400 mt-1">
                  {errors[name].message}
                </p>
              )}
            </div>
          ))}

          {/* batch select */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Batch</label>
            <Select onValueChange={(v) => setValue("batch", v)}>
              <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-400 focus:border-teal-600 rounded-lg">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectGroup>
                  <SelectLabel className="text-slate-500 text-xs">
                    Graduation year
                  </SelectLabel>
                  {years.map((y) => (
                    <SelectItem
                      key={y}
                      value={String(y)}
                      className="hover:bg-slate-800"
                    >
                      {y}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.batch && (
              <p className="text-xs text-red-400 mt-1">
                {errors.batch.message}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
                className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-600 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* confirm password */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
                className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-teal-600 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors duration-150 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-teal-400 hover:text-teal-300 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
