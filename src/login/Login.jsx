import { useState, useEffect } from "react";
import { login, signUp, loginWithGoogle } from "../lib/auth";
import Input from "./Input";
import ButtonClick from "./Button";
import { toast } from "react-toastify";
import useAuth from "../lib/useAuth";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmePassword, setConfirmePassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/home");
    }
  }, [user, loading, navigate]);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setEmail("");
    setPassword("");
    setConfirmePassword("");
    setError("");
  };

  const handleAuth = async () => {
    try {
      if (!email) return toast.info("Digite um E-mail");
      if (!password) return toast.info("Digite sua senha!");

      if (isLogin) {
        await login(email, password, setEmail, setPassword, setConfirmePassword);
      } else {
        if (password.length < 6) return toast.info("A senha deve ter no mínimo 6 dígitos");
        if (password !== confirmePassword) return toast.info("Senhas divergentes");

        await signUp(email, password, setIsLogin, setEmail, setPassword, setConfirmePassword);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEsqueciSenha = async () => {
    if (!email) {
      toast.info("Digite seu e-mail para redefinir a senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("E-mail de redefinição enviado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar e-mail. Verifique o endereço.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          {isLogin ? "Login" : "Registro"}
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
          className="space-y-6"
        >
          <Input
            idInput="email"
            textLabel="* E-mail"
            typeInput="email"
            placeholderInput="Digite seu E-mail"
            valueInput={email}
            setValue={setEmail}
            required
          />
          <Input
            idInput="password"
            textLabel="* Senha"
            typeInput="password"
            placeholderInput="Digite sua senha"
            valueInput={password}
            setValue={setPassword}
            required
          />

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleEsqueciSenha}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          {!isLogin && (
            <Input
              idInput="confirmePassword"
              textLabel="* Confirme a senha"
              typeInput="password"
              placeholderInput="Confirme sua senha"
              valueInput={confirmePassword}
              setValue={setConfirmePassword}
              required
            />
          )}

          <ButtonClick
            txtBtn={isLogin ? "Entrar" : "Registrar"}
            onClick={handleAuth}
            variant="primary"
          />

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-4 flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 rounded-md py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.805 10.023h-9.815v3.954h5.652c-.246 1.49-1.665 4.372-5.652 4.372-3.401 0-6.175-2.81-6.175-6.266 0-3.456 2.774-6.266 6.175-6.266 1.938 0 3.236.827 3.984 1.543l2.713-2.605C16.445 5.2 14.346 4.13 11.815 4.13 6.915 4.13 3 8.2 3 13.133c0 4.932 3.915 9.003 8.815 9.003 5.08 0 8.447-3.558 8.447-8.574 0-.577-.067-1.03-.457-1.54z"
                fill="#4285F4"
              />
            </svg>
            Entrar com Google
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="w-full text-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-600 font-medium mt-6"
          >
            {isLogin
              ? "Não tem uma conta? Registre-se"
              : "Já tem uma conta? Entre"}
          </button>

          {error && (
            <p className="mt-4 text-center text-red-600 dark:text-red-400 font-semibold">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
