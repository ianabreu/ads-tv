import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .min(1, "O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve possiur pelo menos 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
    resetField,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  async function onSubmit({ email, password }: FormData) {
    try {
      await signIn({ email, password });
      toast.success("Logado com sucesso!");
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-password") {
          toast.error("Senha Inválida");
          resetField("password");
          setFocus("password");
          return;
        }
        if (error.code === "auth/invalid-credential") {
          toast.error("Credenciais Inválidas");
          resetField("password");
          resetField("email");
          setFocus("email");
          return;
        }
        toast.error(error.code);
      } else {
        toast.error("Erro ao logar!");
      }
    }
  }
  return (
    <main className="lg:m-auto mx-2 flex flex-col items-center p-2  rounded">
      <div className="w-36 aspect-square">
        <img src="/logo.svg" alt="" className="w-full object-contain" />
      </div>
      <h2 className="text-xl font-bold my-2">Entrar</h2>
      <form
        className="flex flex-col max-w-sm w-full p-4 rounded bg-slate-800 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
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
        <Button className="mt-2" variant={"default"} type="submit">
          Entrar
        </Button>
      </form>
      <span className="my-2">
        Novo por aqui?{" "}
        <Link className="text-amber-500" to="/cadastro">
          Cadastre-se
        </Link>
      </span>
    </main>
  );
}
