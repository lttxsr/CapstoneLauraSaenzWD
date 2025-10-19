"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await register({ name, email, password });
      setOk(true);
      setTimeout(()=> router.push("/login"), 900);
    } catch {
      setErr("No se pudo crear la cuenta");
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-bold mb-2">Crear cuenta</h1>
      <p className="text-sm text-slate-600 mb-4">Regístrate para empezar a guardar favoritos y pedir préstamos.</p>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Nombre (opcional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Contraseña (mín. 6)" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
        {err && <div className="text-rose-600 text-sm">{err}</div>}
        {ok && <div className="text-emerald-700 text-sm">Cuenta creada. Redirigiendo…</div>}
        <button className="btn btn-primary w-full" type="submit">Registrarme</button>
      </form>
      <div className="text-sm text-slate-600 mt-3">
        ¿Ya tienes cuenta? <a href="/login" className="link">Inicia sesión</a>
      </div>
    </div>
  );
}
