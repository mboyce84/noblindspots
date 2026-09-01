import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import {
  NUMBERS_LOCATION_OPTIONS,
  REVENUE_BAND_OPTIONS,
  createEmptyInput,
  submitWaitlist,
  validateWaitlist,
} from '../../lib/waitlist';
import type { NumbersLocation, RevenueBand, WaitlistErrors, WaitlistInput } from '../../lib/waitlist';
import { waitlist } from './landingContent';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const INPUT_CLASS =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent';

const WaitlistForm: React.FC = () => {
  const [input, setInput] = useState<WaitlistInput>(createEmptyInput);
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const set = <K extends keyof WaitlistInput>(key: K, value: WaitlistInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the user works on it.
    if (key === 'email' || key === 'numbersLocation') {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const found = validateWaitlist(input);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    const result = await submitWaitlist(input);
    if (result.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setServerMessage(result.message);
    }
  };

  // Success replaces the form outright. Resubmitting a waitlist is noise.
  if (status === 'success') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 animate-slide-up">
        <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-gray-900">{waitlist.successHeading}</h3>
        <p className="mt-3 text-gray-600 leading-relaxed">{waitlist.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-lg border border-gray-200 p-8">
      {status === 'error' && serverMessage && (
        <div className="flex items-center space-x-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700">{serverMessage}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-email" className="block text-sm font-medium text-gray-700 mb-2">
            {waitlist.emailLabel}
          </label>
          <input
            id="wl-email"
            type="email"
            autoComplete="email"
            value={input.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder={waitlist.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'wl-email-error' : undefined}
            className={`${INPUT_CLASS} ${errors.email ? 'border-red-400' : ''}`}
          />
          {errors.email && (
            <p id="wl-email-error" className="mt-2 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="wl-first-name" className="block text-sm font-medium text-gray-700 mb-2">
            {waitlist.firstNameLabel}
          </label>
          <input
            id="wl-first-name"
            type="text"
            autoComplete="given-name"
            value={input.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            placeholder={waitlist.firstNamePlaceholder}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Radio cards rather than a select: reading the four answers is itself
          the problem-agitation step. */}
      <fieldset className="mt-6">
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          {waitlist.numbersLabel}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {NUMBERS_LOCATION_OPTIONS.map((option) => {
            const checked = input.numbersLocation === option.value;
            return (
              <label
                key={option.value}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  checked
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="numbersLocation"
                  value={option.value}
                  checked={checked}
                  onChange={() => set('numbersLocation', option.value as NumbersLocation)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-800">{option.label}</span>
              </label>
            );
          })}
        </div>
        {errors.numbersLocation && (
          <p className="mt-2 text-sm text-red-600">{errors.numbersLocation}</p>
        )}
      </fieldset>

      <div className="mt-6">
        <label htmlFor="wl-revenue" className="block text-sm font-medium text-gray-700 mb-2">
          {waitlist.revenueLabel}
        </label>
        <select
          id="wl-revenue"
          value={input.revenueBand}
          onChange={(e) => set('revenueBand', e.target.value as RevenueBand | '')}
          className={INPUT_CLASS}
        >
          <option value="">{waitlist.revenuePlaceholder}</option>
          {REVENUE_BAND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div className="absolute w-px h-px -m-px overflow-hidden" aria-hidden="true">
        <label htmlFor="wl-company">Company</label>
        <input
          id="wl-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={input.company}
          onChange={(e) => set('company', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`mt-8 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          status === 'submitting'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {status === 'submitting' ? waitlist.submitting : waitlist.submit}
        {status !== 'submitting' && <ArrowRight className="w-4 h-4" />}
      </button>

      <p className="mt-4 text-sm text-gray-500 text-center">{waitlist.fineprint}</p>
    </form>
  );
};

export default WaitlistForm;
