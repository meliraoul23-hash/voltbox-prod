"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [role, setRole] = useState<"PARTICULIER" | "PROFESSIONNEL">("PARTICULIER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, name, email, password, companyName, vatNumber }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription.");
      setLoading(false);
      return;
    }
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/compte");
  }

  return (
    <div className="container-wrap max-w-md py-16">
      <p className="label-eyebrow">Espace installateur</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Créer un compte</h1>

      <div className="mt-6 flex gap-2">
        {(["PARTICULIER", "PROFESSIONNEL"] as const).map((r) => (
          <button
            type="button"
            key={r}
            onClick={() => setRole(r)}
            className={`focus-ring flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
              role === r ? "border-ink bg-ink text-white" : "border-steel-300 text-steel-600"
            }`}
          >
            {r === "PARTICULIER" ? "Particulier" : "Professionnel"}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-ink">Nom complet</span>
          <input id="reg-name" required value={name} onChange={(e) => setName(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Email</span>
          <input id="reg-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Mot de passe (8 caractères min.)</span>
          <input id="reg-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        {role === "PROFESSIONNEL" && (
          <>
            <label className="block text-sm">
              <span className="font-medium text-ink">Société</span>
              <input id="reg-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink">Numéro de TVA</span>
              <input id="reg-vat" value={vatNumber} onChange={(e) => setVatNumber(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
            </label>
          </>
        )}
        {error && <p className="text-sm text-volt-600">{error}</p>}
        <button type="submit" disabled={loading} className="focus-ring w-full rounded-md bg-volt px-4 py-2.5 text-sm font-semibold text-white hover:bg-volt-600 disabled:opacity-60">
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
