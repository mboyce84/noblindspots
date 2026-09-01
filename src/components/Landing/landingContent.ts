/**
 * Every word on the landing page lives here so a copy edit never touches a
 * component. Sections import what they need and map over it.
 *
 * Honesty constraints, deliberately encoded:
 *  - The product is pre-launch. Nothing here claims a shipped feature.
 *  - No client is named. One of the reference dashboards needs written
 *    permission before public use, so the safe default is: name nobody.
 */

import {
  AlertTriangle,
  Calculator,
  FileSpreadsheet,
  Layers,
  MousePointerClick,
  Receipt,
  ShieldCheck,
  Upload,
  Wand2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const nav = {
  links: [
    { href: '#problem', label: 'The problem' },
    { href: '#how', label: 'How it works' },
  ],
  signIn: 'Sign in',
  cta: 'Get founding access',
};

export const hero = {
  eyebrow: 'Founding access — first 25',
  headline: 'Your numbers live in five places. None of them agree.',
  subhead:
    'GoHighLevel holds some of your revenue. Stripe holds more. The rest is in a processor, an ad account, and a spreadsheet someone updates when they remember. NoBlindSpots pulls all of it into one set of numbers you can actually trust.',
  cta: 'Get founding access',
  secondaryCta: 'See the demo',
  reassurance: 'No card. Founding pricing locked for life.',
};

export interface Problem {
  icon: LucideIcon;
  title: string;
  body: string;
}

export const problem = {
  heading: 'You already know the reporting is wrong. You just cannot prove where.',
  intro:
    'This is what a $100K–$1M GoHighLevel business actually looks like from the inside.',
  items: [
    {
      icon: FileSpreadsheet,
      title: 'The Monday ritual',
      body: 'An hour of exporting and pasting to produce a number nobody fully believes, including you.',
    },
    {
      icon: AlertTriangle,
      title: 'Revenue that never touches GHL',
      body: 'Payment plans, third-party processors, Cash App, wires. Your CRM total and your bank never match, and no report explains the gap.',
    },
    {
      icon: Receipt,
      title: 'No idea what an offer costs to sell',
      body: 'Revenue by offer hides ad spend, commission, and processing fees. Your best-selling tier may be losing money.',
    },
    {
      icon: Layers,
      title: 'A dead channel you find out about in September',
      body: 'Something stopped working in March. Nothing told you, because nothing is watching.',
    },
  ] as Problem[],
};

export interface Step {
  n: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

export const how = {
  heading: 'A working dashboard in under 30 minutes.',
  intro:
    'Not a blank canvas you abandon, and not eight fixed dashboards you cannot change. You start from a template built for your kind of business, then adjust anything.',
  steps: [
    {
      n: '01',
      icon: Upload,
      title: 'Bring your exports',
      body: 'A GHL CSV and a Stripe report is enough to start. Webhooks come later, once the history is loaded.',
    },
    {
      n: '02',
      icon: Wand2,
      title: 'Map your columns',
      body: 'We suggest the mapping and score our confidence. You override anything that looks wrong.',
    },
    {
      n: '03',
      icon: Layers,
      title: 'Pick your template',
      body: 'Coaching with a sales team, event business, consultant. Metrics, views, and role dashboards are created with your real data in them.',
    },
  ] as Step[],
};

export const formShrink = {
  heading: 'They made the form faster. We are deleting most of it.',
  intro:
    'Every sales tracker in this market assumes a human types the numbers in every night. Here is what your team is actually typing, and how much of it already exists somewhere else.',
  rows: [
    { role: 'Phone setter', total: 18, derivable: 12, human: 6 },
    { role: 'Closer', total: 13, derivable: 13, human: 0 },
    { role: 'DM setter', total: 24, derivable: 16, human: 8 },
  ],
  totals: { total: 55, derivable: 41, human: 14 },
  columns: {
    role: 'Role',
    total: 'Fields typed nightly',
    derivable: 'Already in GHL / Stripe',
    human: 'Genuinely needs a human',
  },
  kicker:
    'Your closer types 13 numbers every night. Every single one is already sitting in a calendar, a pipeline stage, or a Stripe charge.',
  keeps: {
    heading: 'The form stays. It just gets short.',
    body: 'Fourteen fields survive, and they are the ones no system can answer: how the day felt, what is blocking them, and why the deal was actually lost. Those live in the app, prefilled and tied to the person and the date, instead of a Google Form nobody fills in.',
  },
};

export const verify = {
  icon: MousePointerClick,
  heading: 'When someone says that number is wrong, you say: click it.',
  body: 'Every figure opens to show the calculation in plain language, the filters applied, and a scrollable table of the exact rows behind it. Export those rows to CSV and hand them over.',
  points: [
    'The calculation, written out in words',
    'Every filter condition that was applied',
    'The underlying rows, scrollable and exportable',
  ],
};

export const margin = {
  icon: Calculator,
  heading: 'The number almost nobody has: what each offer really earns.',
  body: 'Cash collected minus ad spend, commission, processing fees, and delivery cost, broken out per offer. It is the difference between the tier you think carries the business and the one that actually does.',
  note: 'Contracted revenue is not cash collected. A $12K program on a payment plan is not $12K today, and any dashboard that reports it that way is lying to you.',
};

export const security = {
  icon: ShieldCheck,
  heading: 'Your clients see their rows. Nothing else.',
  body: 'Row filters on shared views are enforced on the server, not in the browser. A client link cannot be edited to reveal someone else\'s data, and every access is logged.',
};

export const waitlist = {
  heading: 'Founding access, first 25.',
  body: 'NoBlindSpots is in build. Founding members get first access at a rate locked for life, and their setup shapes what ships. Tell me where your numbers live and I will tell you whether this is built for you.',
  emailLabel: 'Work email',
  emailPlaceholder: 'you@yourbusiness.com',
  firstNameLabel: 'First name',
  firstNamePlaceholder: 'Optional',
  numbersLabel: 'Where do your numbers live right now?',
  revenueLabel: 'Annual revenue',
  revenuePlaceholder: 'Prefer not to say',
  submit: 'Get founding access',
  submitting: 'Adding you…',
  successHeading: "You're on the list.",
  successBody:
    'Check your inbox shortly. If your answer was "both, and they don\'t match", you are exactly who this is being built for, and I will reach out personally.',
  fineprint: 'No card required. One email when there is something real to show you.',
};

export const founder = {
  heading: 'Who is building this',
  body: 'I run a white-label GoHighLevel agency and I have built the reporting behind businesses scaling from $150K a month to over $1M. NoBlindSpots is the tool I kept rebuilding by hand for every client, turned into software.',
  name: 'Marquiste Boyce',
};

export const footer = {
  tagline: 'The operating dashboard for GoHighLevel businesses.',
  note: 'In active development. Founding access open.',
};

export const notFound = {
  heading: 'That page does not exist.',
  body: 'The link may be out of date, or the address might have a typo in it.',
  cta: 'Go to the homepage',
};
