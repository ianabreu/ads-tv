import { useState, useEffect, createContext, ReactNode } from "react";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "@/lib/firebase";
import { User, DB_NAME } from "@/types";

interface AuthProviderProps {
  children: ReactNode;
}

export type AuthContextData = {
  user: User | null;
  signed: boolean;
  loadingAuth: boolean;

  signIn: (credentials: SignInProps) => Promise<boolean>;
  signUp: (credentials: SignUpProps) => Promise<boolean>;
  logout: () => void;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  username: string;
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  const loadUser = () => {
    setLoadingAuth(true);
    const storageUser = localStorage.getItem("@user");
    if (storageUser) {
      const data = JSON.parse(storageUser) as User;
      setUser(data);
    } else {
      localStorage.removeItem("@user");
      setUser(null);
    }
    setLoadingAuth(false);
  };

  useEffect(() => {
    loadUser();
    return () => {
      loadUser();
    };
  }, []);

  async function signUp({ username, email, password }: SignUpProps) {
    try {
      setLoadingAuth(true);

      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(newUser, { displayName: username });

      await setDoc(doc(db, DB_NAME.users, newUser.uid), {
        username: username,
        email: email,
      });

      const userResponse: User | null = {
        email: email,
        id: newUser.uid,
        username: username,
      };

      localStorage.setItem("@user", JSON.stringify(userResponse));
      setUser(userResponse);
      setLoadingAuth(false);
      return true;
    } catch (error) {
      console.log(error);
      setLoadingAuth(false);
      return false;
    }
  }

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        ({ user }) => {
          const data: User = {
            email: user.email as string,
            username: user.displayName as string,
            id: user.uid,
          };
          localStorage.setItem("@user", JSON.stringify(data));
          setUser(() => data);
          toast.success("Logado com sucesso!");
        }
      );
      setLoadingAuth(false);
      return true;
    } catch (error) {
      localStorage.removeItem("@user");
      setUser(null);
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-password") {
          toast.error("Senha Inválida");
        } else if (error.code === "auth/invalid-credential") {
          toast.error("Credenciais Inválidas");
        } else {
          toast.error(error.code);
        }
      } else {
        toast.error("Erro ao logar!");
      }
      setLoadingAuth(false);
      return false;
    }
  }

  function logout() {
    signOut(auth);
    localStorage.removeItem("@user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        user,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
