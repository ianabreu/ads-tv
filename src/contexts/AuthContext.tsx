import { useState, useEffect, createContext, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthProviderProps {
  children: ReactNode;
}

export type AuthContextData = {
  user: UserProps | null;
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;

  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  logout: () => void;
};
type UserProps = {
  uid: string;
  name: string | null;
  email: string | null;
};

type SignInProps = {
  email: string;
  password: string;
};

type SignUpProps = {
  name: string;
  email: string;
  password: string;
};
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email,
        });

        setLoadingAuth(false);
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({
      name,
      email,
      uid,
    });
  }

  async function signUp({ name, email, password }: SignUpProps) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, { displayName: name });
      handleInfoUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao cadastrar");
    }
  }

  async function signIn({ email, password }: SignInProps) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      handleInfoUser({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });
    } catch (error) {
      console.log("ERRO AO LOGAR");
      console.log(error);
      throw new Error("Erro ao logar");
    }
  }

  function logout() {
    signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        user,
        handleInfoUser,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
