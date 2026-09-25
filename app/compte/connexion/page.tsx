"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();

async function onSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
setError("");
const res = await signIn("credentials", { email, password, redirect: false });
setLoading(false);
if (res?.error) setError("Email ou mot de passe incorrect.");
else router.push("/compte");
}

function fillDemo(role: "particulier" | "pro" | "admin") {
setEmail(`${role}@voltbox-demo.lu`);
setPassword("Demo1234!");
}

return (
<div className="container-wrap max-w-md py-16">
<p className="label-eyebrow">Mon compte</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Connexion</h1>

<form onSubmit={onSubmit} className="mt-8 space-y-4">
<label className="block text-sm">
<span className="font-medium text-ink">Email</span>
<input
id="login-email"
type="email"
required
value={email}
onChange={(e) => setEmail(e.target.value)}
className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
/>
</label>
<label className="block text-sm">
<span className="font-medium text-ink">Mot de passe</span>
<input
id="login-password"
type="password"
required
value={password}
onChange={(e) => setPassword(e.target.value)}
className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
/>
</label>
{error && <p className="text-sm text-volt-600">{error}</p>}
<button
type="submit"
disabled={loading}
className="focus-ring w-full rounded-md bg-volt px-4 py-2.5 text-sm font-semibold text-white hover:bg-volt-600 disabled:opacity-60"
>
{loading ? "Connexion…" : "Se connecter"}
</button>
</form>

<p className="mt-4 text-sm text-steel-600">
Pas encore de compte ?{" "}
<Link href="/compte/inscription" className="text-volt hover:underline">
Créer un compte
</Link>
</p>

<div className="mt-8 rounded-lg border border-steel-200 bg-steel-50 p-4 text-sm">
<p className="font-medium text-ink">Comptes de démonstration</p>
<p className="mt-1 text-steel-600">Mot de passe pour les trois comptes : Demo1234!</p>
<div className="mt-3 flex flex-wrap gap-2">
<button type="button" onClick={() => fillDemo("particulier")} className="rounded-full border border-steel-300 px-3 py-1 text-xs hover:border-ink">
particulier@voltbox-demo.lu
</button>
<button type="button" onClick={() => fillDemo("pro")} className="rounded-full border border-steel-300 px-3 py-1 text-xs hover:border-ink">
pro@voltbox-demo.lu
</button>
<button type="button" onClick={() => fillDemo("admin")} className="rounded-full border border-steel-300 px-3 py-1 text-xs hover:border-ink">
admin@voltbox-demo.lu
</button>
</div>
</div>
</div>
);
}
