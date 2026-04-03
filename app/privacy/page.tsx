import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Prompt Engine",
};

const sections = [
  {
    heading: "Overview",
    body: "Prompt Engine is a tool that helps you craft better prompts for Claude AI. We take your privacy seriously.",
  },
  {
    heading: "Data We Collect",
    body: "We collect no personal data. All prompts and history are stored locally on your device using browser localStorage. Nothing is sent to our servers.",
  },
  {
    heading: "Third-Party Services",
    body: "Clicking 'Open Claude' opens claude.ai in your browser. Please review Anthropic's privacy policy for how they handle data.",
  },
  {
    heading: "Analytics",
    body: "We do not use any analytics or tracking services.",
  },
  {
    heading: "Your Data",
    body: "You can delete all your data at any time using the 'Clear History' option in the app settings. Uninstalling the app permanently removes all data.",
  },
  {
    heading: "Contact",
    body: "Questions? Contact us at support@promptengine.app",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#060a0d] text-white/80 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-8">Last updated: April 2026</p>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={section.heading}>
            {i > 0 && (
              <div className="mb-8 border-t border-white/[0.06]" />
            )}
            <h2 className="text-[15px] font-semibold text-white mb-2">
              {section.heading}
            </h2>
            <p className="text-[14px] leading-relaxed text-white/60">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-white/[0.06]">
        <Link
          href="/"
          className="text-[13px] text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to Prompt Engine
        </Link>
      </div>
    </div>
  );
}
