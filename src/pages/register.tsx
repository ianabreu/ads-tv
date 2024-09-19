import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const schema = z.object({
  username: z.string().trim().min(1, "Insira um nome válido"),
  email: z
    .string()
    .trim()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve possiur pelo menos 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const { signUp, logout, loadingAuth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    logout();
  }, [logout]);

  async function onSubmit({ username, email, password }: FormData) {
    try {
      await signUp({ username, email, password });
      toast.success("Bem vindo!");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Erro ao cadastrar!");
      console.log(error);
    }
  }
  return (
    <main className="lg:m-auto mx-2 flex flex-col items-center p-2">
      <div className="w-36 aspect-square">
        <img
          src="/logo.svg"
          alt="TV ads logotipo"
          className="w-full object-contain"
        />
      </div>
      <h2 className="text-xl font-bold my-2">Cadastrar</h2>
      <form
        className="flex flex-col max-w-sm w-full p-4 rounded bg-slate-800 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Nome</Label>
          <Input
            type="text"
            placeholder="Digite seu nome..."
            name="username"
            error={errors.username?.message}
            register={register}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Digite seu email..."
            name="email"
            error={errors.email?.message}
            register={register}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            type="password"
            placeholder="Digite sua senha..."
            name="password"
            error={errors.password?.message}
            register={register}
          />
        </div>
        <Button
          className="mt-2"
          variant={"default"}
          type="submit"
          disabled={loadingAuth}
        >
          {loadingAuth ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>
      <span className="my-2">
        Já possui uma conta?{" "}
        <Link className="text-amber-500" to="/login">
          Entre aqui
        </Link>
      </span>
    </main>
  );
}
