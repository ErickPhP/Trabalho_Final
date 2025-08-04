"use client";

import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebaseConfig";
import Swal from "sweetalert2";

export default function Button({
  txtBtn,
  variant = "neutral",
  icon: Icon,
  setOption,
  link,
  optionDefault = "",
  onClick,
  requireAuth = false,
}) {
  const navigate = useNavigate();

  const formatPath = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_");

  const handleClick = async () => {
    const user = auth.currentUser;

    if (requireAuth && !user) {
      await Swal.fire({
        icon: "warning",
        title: "Acesso restrito",
        text: "Você precisa estar logado para acessar esta opção.",
        confirmButtonText: "OK",
      });
      navigate("/login");
      return;
    }

    if (onClick) {
      try {
        await onClick();
      } catch (error) {
        console.error("Erro ao executar ação externa:", error);
      }
      return;
    }

    if (setOption) {
      setOption(txtBtn);
    } else if (link) {
      const path = `/${formatPath(optionDefault)}/${formatPath(txtBtn)}`;
      navigate(path, { replace: true });
    }
  };

  const baseClasses =
    "inline-flex items-center px-4 py-2 rounded-md font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    neutral: "bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-500",
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning: "bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:ring-yellow-400",
  };

  const btnClass = `${baseClasses} ${variantClasses[variant] ?? variantClasses.neutral}`;

  return (
    <button type="button" className={btnClass} onClick={handleClick}>
      {Icon && <Icon className="w-5 h-5 mr-2" aria-hidden="true" />}
      {txtBtn}
    </button>
  );
}
