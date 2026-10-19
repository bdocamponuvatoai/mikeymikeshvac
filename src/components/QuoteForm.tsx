'use client';

import Link from 'next/link';
import { startTransition, useActionState, useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, ArrowUpRight, Check, Copy, Mail, Pencil, Phone } from 'lucide-react';
import { submitQuote } from '@/app/contact/actions';
import { ELAPSED_FIELD, HONEYPOT_FIELD } from '@/lib/bot';
import { form } from '@/lib/content';
import { contactMethods, isQuoteService, MESSAGE_MAX, quoteFields, quoteServices, serviceLabel, validateQuote, type ContactMethod, type QuoteErrors, type QuoteField, type QuoteService } from '@/lib/quote-schema';
import { initialQuoteState } from '@/lib/quote-state';
import { contacts, tel } from '@/lib/site';

type Values = { service: QuoteService | ''; name: string; phone: string; email: string; town: string; message: string; prefer: ContactMethod };
type TextField = 'name' | 'phone' | 'email' | 'town' | 'message';

const emptyValues: Values = { service: '', name: '', phone: '', email: '', town: '', message: '', prefer: 'call' };
const noSubscribe = () => () => {};

/** `?service=` from links such as the house drawing's "Ask about this". Server snapshot is empty, so hydration matches. */
function useServiceFromQuery(): QuoteService | '' {
  const search = useSyncExternalStore(noSubscribe, () => window.location.search, () => '');
  const value = new URLSearchParams(search).get('service');
  return isQuoteService(value) ? value : '';
}

const inputClass =
  'mt-2 block w-full rounded-[2px] border border-muted bg-white px-3.5 py-3 text-base text-ink placeholder:text-[#5f6a70] focus-visible:outline-offset-1 aria-[invalid=true]:border-error aria-[invalid=true]:border-2';

export function QuoteForm() {
  const id = useId();
  const queryService = useServiceFromQuery();
  const [values, setValues] = useState<Values>(emptyValues);
  const [clientErrors, setClientErrors] = useState<QuoteErrors>({});
  const [editedAt, setEditedAt] = useState(0);
  const [dismissedAt, setDismissedAt] = useState(0);
  const [copyStatus, setCopyStatus] = useState<'' | 'copied' | 'failed'>('');
  const [state, dispatch, pending] = useActionState(submitQuote, initialQuoteState);

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const limitedRef = useRef<HTMLParagraphElement>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const service: QuoteService | '' = values.service || queryService;
  const resultAt = state.status === 'idle' ? 0 : state.at;
  const showResult = (state.status === 'sent' || state.status === 'fallback') && resultAt !== dismissedAt;
  const serverErrors = state.status === 'invalid' && state.at !== editedAt ? state.errors : {};
  const errors: QuoteErrors = { ...serverErrors, ...clientErrors };

  function focusField(field: QuoteField) {
    const el =
      field === 'service'
        ? formRef.current?.querySelector<HTMLInputElement>('input[name="service"]:checked, input[name="service"]')
        : field === 'prefer'
          ? formRef.current?.querySelector<HTMLButtonElement>('[data-prefer][aria-pressed="true"]')
          : formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    el?.focus();
  }

  const scrollToCard = () => {
    const smooth = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    cardRef.current?.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
  };

  // Move focus once per server result: to the result panel, the first invalid field, or the rate-limit notice.
  useEffect(() => {
    if (state.status === 'sent' || state.status === 'fallback') {
      resultRef.current?.focus({ preventScroll: true });
      scrollToCard();
    } else if (state.status === 'invalid') {
      const first = quoteFields.find((f) => state.errors[f]);
      if (first) focusField(first);
    } else if (state.status === 'limited') {
      limitedRef.current?.focus();
    }
  }, [state]);

  // After "Edit" or "Send another", hand focus back to the form.
  useEffect(() => {
    if (!dismissedAt) return;
    formHeadingRef.current?.focus({ preventScroll: true });
    scrollToCard();
  }, [dismissedAt]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    // Editing retires any server-side errors from the current result.
    setEditedAt(resultAt);
    if (clientErrors[key as QuoteField])
      setClientErrors((e) => {
        const next = { ...e };
        delete next[key as QuoteField];
        return next;
      });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = { ...values, service };
    const result = validateQuote(input);
    if (!result.ok) {
      setClientErrors(result.errors);
      const first = quoteFields.find((f) => result.errors[f]);
      if (first) focusField(first);
      return;
    }
    setClientErrors({});
    setCopyStatus('');
    const data = new FormData(e.currentTarget);
    data.set('service', service);
    data.set('prefer', values.prefer);
    data.set(ELAPSED_FIELD, String(Date.now() - mountedAt.current));
    startTransition(() => dispatch(data));
  }

  async function copyRequest(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  // The hint is replaced by the error message, so reference exactly one of them.
  const describedBy = (field: QuoteField, hint?: boolean) =>
    errors[field] ? `${id}-${field}-error` : hint ? `${id}-${field}-hint` : undefined;

  const errorText = (field: QuoteField) =>
    errors[field] ? (
      <p id={`${id}-${field}-error`} className="mt-2 flex items-start gap-1.5 text-[0.9375rem] font-medium text-error">
        <AlertCircle className="mt-0.5 size-4 flex-none" aria-hidden="true" /> {errors[field]}
      </p>
    ) : null;

  const textField = (field: TextField, label: string, opts: { required?: boolean; hint?: ReactNode; input: ReactNode }) => (
    <div>
      <label htmlFor={`${id}-${field}`} className="flex flex-wrap items-baseline justify-between gap-2 font-semibold">
        {label}
        <span className="label font-normal text-muted">{opts.required ? form.required : form.optional}</span>
      </label>
      {opts.input}
      {opts.hint && !errors[field] && (
        <p id={`${id}-${field}-hint`} className="mt-1.5 text-sm text-muted">
          {opts.hint}
        </p>
      )}
      {errorText(field)}
    </div>
  );

  const inputProps = (field: TextField) => ({
    id: `${id}-${field}`,
    name: field,
    value: values[field],
    onChange: (e: { target: { value: string } }) => update(field, e.target.value),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': describedBy(field, field !== 'name' && field !== 'town'),
    className: inputClass,
  });

  return (
    <div ref={cardRef} id="quote" className="needs-js scroll-mt-[calc(var(--header-h)+1rem)] border border-ink bg-card">
      <div className="flex items-center justify-between border-b border-ink px-5 py-3 sm:px-8">
        <span className="label text-muted">Form Q-1</span>
        <span className="label text-copper">{showResult ? (state.status === 'sent' ? form.sent.title : form.fallback.title) : form.heading}</span>
      </div>

      {showResult && state.status === 'sent' && (
        <div ref={resultRef} tabIndex={-1} aria-labelledby={`${id}-result`} className="px-5 py-8 sm:px-8 sm:py-10">
          <p className="flex size-12 items-center justify-center rounded-full bg-copper text-white">
            <Check className="size-6" aria-hidden="true" />
          </p>
          <h2 id={`${id}-result`} className="mt-5 text-3xl sm:text-4xl">
            {form.sent.title}
          </h2>
          <p className="mt-3 text-muted">{form.sent.body}</p>
          <button
            type="button"
            className="btn btn-line mt-7 text-ink"
            onClick={() => {
              setValues(emptyValues);
              setDismissedAt(resultAt);
            }}
          >
            {form.sent.again}
          </button>
        </div>
      )}

      {showResult && state.status === 'fallback' && (
        <div ref={resultRef} tabIndex={-1} aria-labelledby={`${id}-result`} className="px-5 py-8 sm:px-8 sm:py-10">
          <h2 id={`${id}-result`} className="text-3xl sm:text-4xl">
            {form.fallback.title}
          </h2>
          <p className="mt-3 text-muted">{form.fallback.body}</p>
          <label htmlFor={`${id}-prepared`} className="sr-only">
            {form.heading}
          </label>
          <textarea id={`${id}-prepared`} readOnly value={state.text} rows={8} className={`${inputClass} font-mono text-sm`} />
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={state.mailto} className="btn btn-primary">
              <Mail className="size-4" aria-hidden="true" /> {form.fallback.open}
            </a>
            <button type="button" className="btn btn-line text-ink" onClick={() => copyRequest(state.text)}>
              <Copy className="size-4" aria-hidden="true" /> {form.fallback.copy}
            </button>
          </div>
          <p aria-live="polite" className="mt-3 min-h-6 text-sm font-medium">
            {copyStatus === 'copied' ? form.fallback.copied : copyStatus === 'failed' ? form.fallback.copyFailed : ''}
          </p>
          <p className="mt-4 font-semibold">{form.fallback.or}</p>
          <ul className="mt-2 flex flex-wrap gap-3">
            {contacts.map((c) => (
              <li key={c.name}>
                <a href={tel(c)} className="btn btn-ink">
                  <Phone className="size-4" aria-hidden="true" /> {c.name} · {c.display}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-copper hover:underline" onClick={() => setDismissedAt(resultAt)}>
            <Pencil className="size-4" aria-hidden="true" /> {form.fallback.edit}
          </button>
        </div>
      )}

      <form ref={formRef} method="post" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-heading`} hidden={showResult} className="grid gap-6 px-5 py-8 sm:px-8 sm:py-10">
        <div>
          <h2 id={`${id}-heading`} ref={formHeadingRef} tabIndex={-1} className="text-3xl sm:text-4xl">
            {form.heading}
          </h2>
          <p className="mt-3 text-muted">{form.intro}</p>
        </div>

        <p aria-live="polite" className="empty:hidden font-medium text-error">
          {Object.keys(clientErrors).length > 0 ? form.errorSummary : ''}
        </p>
        {state.status === 'limited' && state.at !== editedAt && (
          <p ref={limitedRef} tabIndex={-1} role="alert" className="border-l-4 border-error bg-white px-4 py-3 font-medium text-error">
            {form.limited}
          </p>
        )}

        <fieldset aria-describedby={errors.service ? `${id}-service-error` : undefined}>
          <legend className="flex w-full flex-wrap items-baseline justify-between gap-2 font-semibold">
            {form.service}
            <span className="label font-normal text-muted">{form.required}</span>
          </legend>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
            {quoteServices.map((s) => (
              <label
                key={s}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[2px] border px-3.5 py-2.5 transition-colors has-[:checked]:border-copper has-[:checked]:bg-[#f6e9df] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-copper ${
                  errors.service ? 'border-error' : 'border-muted'
                }`}
              >
                <input type="radio" name="service" value={s} checked={service === s} onChange={() => update('service', s)} className="size-4 accent-[#9a4a1f]" />
                <span>{serviceLabel(s)}</span>
              </label>
            ))}
          </div>
          {errorText('service')}
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          {textField('name', form.name, { required: true, input: <input {...inputProps('name')} autoComplete="name" maxLength={100} enterKeyHint="next" /> })}
          {textField('phone', form.phone, {
            required: true,
            hint: form.phoneHint,
            input: <input {...inputProps('phone')} type="tel" inputMode="tel" autoComplete="tel" maxLength={30} enterKeyHint="next" />,
          })}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {textField('email', form.email, {
            required: values.prefer === 'email',
            hint: form.emailHint,
            input: <input {...inputProps('email')} type="email" inputMode="email" autoComplete="email" maxLength={200} enterKeyHint="next" />,
          })}
          {textField('town', form.town, { required: true, input: <input {...inputProps('town')} autoComplete="address-level2" maxLength={100} enterKeyHint="next" /> })}
        </div>
        {textField('message', form.message, {
          required: true,
          hint: form.messageHint(values.message.length, MESSAGE_MAX),
          input: <textarea {...inputProps('message')} rows={5} maxLength={MESSAGE_MAX} placeholder={form.messagePlaceholder} />,
        })}

        <div role="group" aria-labelledby={`${id}-prefer`}>
          <p id={`${id}-prefer`} className="font-semibold">
            {form.prefer}
          </p>
          <div className="mt-3 inline-grid grid-cols-3 border border-ink">
            {contactMethods.map((m, i) => (
              <button
                key={m}
                type="button"
                data-prefer={m}
                aria-pressed={values.prefer === m}
                onClick={() => update('prefer', m)}
                className={`min-h-12 min-w-24 px-4 font-semibold transition-colors ${i > 0 ? 'border-l border-ink' : ''} ${
                  values.prefer === m ? 'bg-ink text-paper' : 'bg-card text-ink hover:bg-paper-deep'
                }`}
              >
                {form.preferOptions[m]}
              </button>
            ))}
          </div>
          {errorText('prefer')}
        </div>

        <div className="hp" aria-hidden="true">
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div className="border-t border-rule pt-6">
          <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:cursor-wait disabled:bg-[#7f3c18] sm:w-auto">
            {pending ? form.submitting : form.submit} {!pending && <ArrowUpRight className="size-4" aria-hidden="true" />}
          </button>
          <p className="mt-4 text-sm text-muted">{form.note}</p>
          <Link href="/privacy" className="prose-link mt-2 inline-flex min-h-11 items-center text-sm text-ink">
            {form.privacy}
          </Link>
        </div>
      </form>
    </div>
  );
}
