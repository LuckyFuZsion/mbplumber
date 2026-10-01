"use client";

import { useState } from "react";
import { SERVICES, SITE } from "@/lib/site";

const field =
  "w-full rounded-xl border border-white/20 bg-black px-4 py-3 font-medium text-white placeholder:text-white/40 focus:border-brand focus:outline-none";

/** Opens the visitor's email app pre-filled. No backend or email service needed. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Address / area: ${f.get("area")}`,
      `Service: ${f.get("service")}`,
      "",
      `${f.get("message")}`,
    ].join("\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Website enquiry from ${f.get("name")}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-ink-soft p-7 sm:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Name
          <input name="name" required className={`${field} mt-1.5`} autoComplete="name" />
        </label>
        <label className="block text-sm font-bold">
          Phone
          <input name="phone" type="tel" required className={`${field} mt-1.5`} autoComplete="tel" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Town / area
          <input name="area" className={`${field} mt-1.5`} placeholder="e.g. Grantham" />
        </label>
        <label className="block text-sm font-bold">
          Service
          <select name="service" className={`${field} mt-1.5`}>
            {SERVICES.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Something else</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-bold">
        How can we help?
        <textarea name="message" required rows={5} className={`${field} mt-1.5`} />
      </label>
      <button className="btn btn-red w-full text-lg">Send enquiry</button>
      {sent && (
        <p className="text-center text-sm font-semibold text-white/70">
          Your email app should have opened. If not, email us at {SITE.email} or call {SITE.phone}.
        </p>
      )}
    </form>
  );
}
