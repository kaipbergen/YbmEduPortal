import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    // Check that passwords match
    if (data.password !== data.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      // Make a POST request to /api/auth/register
      const response = await axios.post("/api/auth/register", {
        email: data.email,
        password: data.password,
      }, { withCredentials: true });

      // If the server responds with { success: true }, navigate to /profile
      if (response.data.success) {
        navigate("/profile");
      } else {
        // Otherwise show an error message from the server or a fallback
        alert(response.data.message || "Registration failed");
      }
    } catch (error: any) {
      // If the server returns an error (like 400), display its message
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Введите email"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              {...register("email", { required: "Укажите email" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">
              Повторите пароль
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              {...register("confirmPassword", {
                required: "Повторите пароль",
                validate: (value) =>
                  value === watch("password") || "Пароли не совпадают",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register("terms", {
                required: "Примите политику конфиденциальности",
              })}
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Я ознакомился(ась) с{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                политикой конфиденциальности
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Зарегистрировать аккаунт
          </button>
        </form>

        <div className="mt-4 text-center">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </div>
        <hr className="my-4" />
        {/* Google Auth Button */}
        <button
          onClick={() => (window.location.href = "/api/auth/google")}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Продолжить с Google
        </button>
      </div>
    </div>
  );
}