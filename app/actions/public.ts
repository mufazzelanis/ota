"use server";

import { randomUUID } from "crypto";
import { updateLeads } from "@/lib/content";

export type LeadState = { ok: boolean; message: string; errors?: Record<string, string> } | null;

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 2000);
  const name = get("name");
  const email = get("email");
  const company = get("company");
  const businessType = get("businessType");
  const message = get("message");
  const products = formData.getAll("products").map(String).slice(0, 20);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid work email";
  if (company.length < 2) errors.company = "Please enter your company";
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields", errors };

  const lead = {
    id: randomUUID(),
    name,
    email,
    company,
    businessType,
    products,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  await updateLeads((leads) => [lead, ...leads].slice(0, 5000));
  return { ok: true, message: "Thanks! Our integration team will reach out within one business day." };
}
