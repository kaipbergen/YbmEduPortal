import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    console.log("Login form data:", data);
    // TODO: Replace with your login API call
    alert("Вы успешно вошли!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Войти в аккаунт</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="login@real.com"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              {...register("email", { required: "Укажите email" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              {...register("password", { required: "Укажите пароль" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-blue-500 hover:underline text-sm">
              Забыли пароль?
            </a>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Войти в аккаунт
          </button>
        </form>
        <div className="mt-4 text-center">
          Еще нет аккаунта?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </div>
        <hr className="my-4" />
        {/* Google Auth Button */}
        <button
          onClick={() => (window.location.href = "http://localhost:5002/api/auth/google")}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Войти через Google
        </button>
      </div>
    </div>
  );
}