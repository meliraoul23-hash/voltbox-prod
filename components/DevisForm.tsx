"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ComplianceNotice from "./ComplianceNotice";

export default function DevisForm({ defaultType = "STANDARD" }: { defaultType?: "STANDARD" | "SUR_MESURE" }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const fromConfigurator = searchParams.get("source") === "configurateur";

  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState(session?.user?.companyName ?? "");
  const [powerKw, setPowerKw] = useState("");
  const [inverter, setInverter] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (fromConfigurator) {
      const raw = sessionStorage.getItem("voltbox-configurator-snapshot");
      if (raw) {
        setSnapshot(raw);
        try {
          const parsed = JSON.parse(raw);
          setPowerKw(String(parsed.state.installationPowerKw));
          setMessage(
            `Demande générée depuis le configurateur : ${parsed.state.phase}, ${parsed.state.installationPowerKw} kWc, ${parsed.state.mpptCount} MPPT${parsed.state.hasBattery ? `, batterie ${parsed.state.batteryPowerKwh} kWh` : ""}.`
          );
        } catch {}
      }
    }
  }, [fromConfigurator]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData();
    fd.append("type", fromConfigurator ? "CONFIGURATEUR" : defaultType);
    fd.append("name", name);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("company", company);
    if (powerKw) fd.append("powerKw", powerKw);
    fd.append("inverter", inverter);
    fd.append("quantity", String(quantity));
    fd.append("message", message);
    if (snapshot) fd.append("configuratorSnapshot", snapshot);
    if (files) Array.from(files).forEach((f) => fd.append("files", f));

    try {
      const res = await fetch("/api/quotes", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-ok/30 bg-ok/5 p-6">
        <p className="font-semibold text-ok">Demande envoyée</p>
        <p className="mt-1 text-sm text-steel-600">
          Votre demande de devis a bien été enregistrée. Nous revenons vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {fromConfigurator && (
        <p className="rounded-md bg-steel-50 px-3 py-2 text-sm text-steel-600">
          Cette demande reprend la configuration que vous venez de composer.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-ink">Nom complet</span>
          <input id="devis-name" required value={name} onChange={(e) => setName(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Email</span>
          <input id="devis-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Téléphone</span>
          <input id="devis-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Société (optionnel)</span>
          <input id="devis-company" value={company} onChange={(e) => setCompany(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Puissance (kWc)</span>
          <input id="devis-power" type="number" value={powerKw} onChange={(e) => setPowerKw(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Onduleur</span>
          <input id="devis-inverter" placeholder="Marque / modèle / puissance" value={inverter} onChange={(e) => setInverter(e.target.value)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-ink">Quantité</span>
          <input id="devis-quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2" />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-ink">Décrivez votre besoin</span>
        <textarea
          id="devis-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
          placeholder="Type d'installation, contraintes, délai souhaité…"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-ink">Schéma, photo du tableau existant ou plan (optionnel)</span>
        <input
          id="devis-files"
          type="file"
          multiple
          accept="image/*,.pdf,.dwg,.dxf"
          onChange={(e) => setFiles(e.target.files)}
          className="focus-ring mt-1.5 w-full rounded-md border border-dashed border-steel-300 px-3 py-2 text-sm"
        />
      </label>

      <ComplianceNotice />

      {status === "error" && <p className="text-sm text-volt-600">Une erreur est survenue, merci de réessayer.</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-ring w-full rounded-md bg-volt px-4 py-3 text-sm font-semibold text-white hover:bg-volt-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Envoi…" : "Demander mon devis"}
      </button>
    </form>
  );
}
