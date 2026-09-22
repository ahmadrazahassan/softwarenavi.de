/** Shared form-action contract. Error messages are German and say how to fix the problem. */
export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  /** echo of submitted values so the form can re-render them after a server-side error */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { ok: false, message: "" };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
