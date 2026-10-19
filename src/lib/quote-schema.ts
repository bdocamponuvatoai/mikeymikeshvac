import { z } from 'zod';
import { cleanLine, cleanMultiline } from './sanitize';
import { serviceSlugs, services } from './site';
import { form } from './content';

// Zod probes `new Function` to decide whether to JIT-compile parsers. In the browser
// that probe trips the Content-Security-Policy (no 'unsafe-eval'), so keep it off everywhere.
z.config({ jitless: true });

export const MESSAGE_MAX = 1200;
export const quoteServices = [...serviceSlugs, 'other'] as const;
export const contactMethods = ['call', 'text', 'email'] as const;

export type QuoteService = (typeof quoteServices)[number];
export type ContactMethod = (typeof contactMethods)[number];

const line = (min: number, max: number, message: string) =>
  z
    .string({ error: message })
    .transform(cleanLine)
    .pipe(z.string().min(min, { error: message }).max(max, { error: message }));

const quoteSchema = z
  .object({
    service: z.enum(quoteServices, { error: form.errors.service }),
    name: line(2, 100, form.errors.name),
    phone: line(7, 30, form.errors.phone).refine(
      (v) => {
        const digits = v.replace(/\D/g, '').length;
        return digits >= 10 && digits <= 15 && /^[\d\s()+.-]+$/.test(v);
      },
      { error: form.errors.phone },
    ),
    email: z
      .string({ error: form.errors.email })
      .transform(cleanLine)
      .pipe(z.union([z.literal(''), z.email({ error: form.errors.email }).max(200, { error: form.errors.email })])),
    town: line(2, 100, form.errors.town),
    message: z
      .string({ error: form.errors.message })
      .transform(cleanMultiline)
      .pipe(z.string().min(10, { error: form.errors.message }).max(MESSAGE_MAX, { error: form.errors.message })),
    prefer: z.enum(contactMethods, { error: form.errors.prefer }),
  })
  .superRefine((v, ctx) => {
    if (v.prefer === 'email' && v.email === '') {
      ctx.addIssue({ code: 'custom', path: ['email'], message: form.errors.emailRequired });
    }
  });

export type QuoteInput = z.input<typeof quoteSchema>;
export type Quote = z.output<typeof quoteSchema>;
export type QuoteField = keyof QuoteInput;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

/** Field order on the page, used to focus the first invalid field. */
export const quoteFields: QuoteField[] = ['service', 'name', 'phone', 'email', 'town', 'message', 'prefer'];

export function validateQuote(input: unknown): { ok: true; data: Quote } | { ok: false; errors: QuoteErrors } {
  const result = quoteSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const errors: QuoteErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && (quoteFields as string[]).includes(field) && !errors[field as QuoteField]) {
      errors[field as QuoteField] = issue.message;
    }
  }
  return { ok: false, errors };
}

export function serviceLabel(service: QuoteService): string {
  return services.find((s) => s.slug === service)?.title ?? form.serviceOther;
}

export function isQuoteService(value: unknown): value is QuoteService {
  return typeof value === 'string' && (quoteServices as readonly string[]).includes(value);
}
