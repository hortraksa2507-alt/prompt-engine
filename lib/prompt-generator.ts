import { BuilderState } from "./types";

const modeRoles: Record<string, string> = {
  write: "an expert content strategist and writer with 15+ years crafting high-impact content across industries — blogs, white papers, marketing copy, technical docs, and executive communications",
  code: "a principal software engineer with 15+ years building production systems at scale — you write code that is clean, idiomatic, secure, thoroughly tested, and maintainable by teams",
  analyze: "a senior analyst and strategic advisor who turns raw information into clear, evidence-backed insights — you separate signal from noise, identify root causes, and deliver recommendations that drive decisions",
  debug: "a principal engineer specializing in systematic debugging — you methodically isolate root causes using divide-and-conquer, identify cascading failures, and deliver permanent fixes with full reasoning",
  learn: "a world-class educator and technical writer who specializes in making complex subjects immediately understandable — you build mental models progressively, use perfect analogies, and make learners feel capable",
  brainstorm: "a creative director and systems thinker who generates both obvious and non-obvious ideas across multiple dimensions — you balance creativity with feasibility and always connect ideas to impact",
};

const modeInstructions: Record<string, string[]> = {
  write: [
    "Open with a compelling hook in the first sentence that immediately establishes the value for the reader.",
    "Structure the content with a clear logical flow — each paragraph leads naturally to the next.",
    "Use concrete specifics: named examples, numbers, real scenarios — never vague generalizations.",
    "Match the requested tone from the first word to the last, never drifting.",
    "Vary sentence length deliberately — short for impact, longer for nuance.",
    "End with a memorable conclusion or clear call-to-action that gives the reader a next step.",
    "Before writing, briefly state the core message in one sentence, then build everything around it.",
  ],
  code: [
    "Before writing code, state your approach in 2-3 sentences — what pattern you're using and why.",
    "Write idiomatic code for the language/framework — follow established conventions, not generic patterns.",
    "Handle edge cases explicitly: null/undefined, empty inputs, boundary values, concurrent access.",
    "Add security considerations: input validation, injection prevention, least privilege, secrets handling.",
    "Include meaningful comments only for non-obvious logic — avoid comments that just restate the code.",
    "After the code, explain key design decisions and any trade-offs made.",
    "Provide usage examples showing both the happy path and error cases.",
  ],
  analyze: [
    "Open with a 2-3 sentence executive summary of the key findings — the 'so what' upfront.",
    "Support every conclusion with specific evidence, data, or examples — no unsupported assertions.",
    "Distinguish explicitly between: confirmed facts, reasonable inferences, and assumptions.",
    "Identify second-order effects and non-obvious patterns that a quick reading would miss.",
    "Flag what you don't know and what additional data would strengthen the analysis.",
    "Quantify impact and priority wherever possible — use numbers, percentages, or relative comparisons.",
    "Close with a prioritized action plan: what to do first, second, and what to monitor.",
  ],
  debug: [
    "Start by precisely restating the problem — what is observed vs. what is expected.",
    "Form a hypothesis about the root cause before investigating, then test it systematically.",
    "Show your reasoning at each step — what you checked, what it told you, what you ruled out.",
    "Trace the execution path from input to failure — identify the exact point where behavior diverges.",
    "Distinguish between the symptom (what fails) and the root cause (why it fails).",
    "Provide the fix with a clear before/after code comparison and explain why this resolves the root cause.",
    "Recommend preventive measures: tests to add, patterns to avoid, monitoring to set up.",
  ],
  learn: [
    "Start with the single best mental model or analogy that captures the core concept.",
    "Build understanding progressively: start with the simplest case, then add complexity layer by layer.",
    "Explicitly connect new concepts to things the learner already understands.",
    "Include at least one concrete, runnable example for each key concept.",
    "Call out the top 2-3 misconceptions learners typically have and explain exactly why they're wrong.",
    "Use the Feynman technique: explain as if to someone smart but unfamiliar with this domain.",
    "End with a clear 'what to learn next' path with specific resources or topics.",
  ],
  brainstorm: [
    "Generate ideas across at least 3 different dimensions or angles — don't cluster in one direction.",
    "Include both incremental ideas (improve what exists) and disruptive ideas (rethink from scratch).",
    "For each idea: one sentence on what it is, one on why it could work, one on the main risk.",
    "Actively push past first-thought ideas — the 4th and 5th ideas are often more valuable than the 1st.",
    "Identify 2-3 combinations of ideas that could compound their individual value.",
    "Score each idea on impact (1-5) and feasibility (1-5) to help prioritize.",
    "Close with a recommended top-3 ranked by impact-to-effort ratio with brief justification.",
  ],
};

const outputContracts: Record<string, string> = {
  write: "Deliver polished, publication-ready content — not a draft or outline unless explicitly asked.",
  code: "Deliver working, complete code — not pseudocode or placeholders unless explicitly specified.",
  analyze: "Deliver a structured analysis with clear findings, evidence, and prioritized recommendations.",
  debug: "Deliver a definitive root cause diagnosis and a tested, complete fix — not guesses.",
  learn: "Deliver a complete, self-contained explanation that leaves no important gaps.",
  brainstorm: "Deliver a concrete, evaluated list of ideas — not vague directions or categories.",
};

function buildRoleSentence(state: BuilderState): string {
  const customRole = (state.role || "").trim();
  if (customRole) return `You are ${customRole}.`;
  const defaultRole = state.taskMode ? modeRoles[state.taskMode] : null;
  if (defaultRole) return `You are ${defaultRole}.`;
  return "";
}

function buildConstraintsSentence(state: BuilderState): string {
  const parts: string[] = [];
  if (state.tone) parts.push(`Use a ${state.tone.toLowerCase()} tone throughout`);
  if (state.audience) {
    const audienceMap: Record<string, string> = {
      Expert: "Write for an expert audience — skip basics, use precise terminology",
      Intermediate: "Write for an intermediate audience — explain specialized terms but don't over-explain",
      Beginner: "Write for a beginner audience — define all terms, avoid assumptions about prior knowledge",
      "Non-technical": "Write for a non-technical audience — use analogies and avoid jargon",
      Mixed: "Write for a mixed audience — be accessible but not condescending",
    };
    parts.push(audienceMap[state.audience] || `target a ${state.audience.toLowerCase()} audience`);
  }
  if (state.length) {
    const lengthMap: Record<string, string> = {
      Brief: "be concise — say what needs to be said and stop",
      Medium: "provide moderate depth — cover key points without exhaustive detail",
      Detailed: "be thorough — cover all important angles with supporting detail",
      Comprehensive: "be exhaustive — leave nothing important out, cover edge cases and nuance",
      "As needed": "let the content determine the length — neither pad nor cut",
    };
    parts.push(lengthMap[state.length]);
  }
  if (parts.length === 0) return "";
  parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  return parts.join(". ") + ".";
}

function buildFormatSentence(state: BuilderState): string {
  if (!state.outputFormat) return "";
  const formatMap: Record<string, string> = {
    Paragraphs: "Format as flowing prose paragraphs. Use clear topic sentences. Group related ideas together.",
    "Bullet Points": "Format as scannable bullet points. Group related bullets under clear headers. Each bullet = one idea.",
    "Step-by-Step": "Format as numbered steps. Each step: one clear action + expected outcome. Don't combine multiple actions in one step.",
    Table: "Format as a table with clear column headers. Every row should be comparable across all columns.",
    "Code Block": "Format code in properly-fenced code blocks with the language specified. Separate explanation from code.",
    JSON: "Format output as valid, pretty-printed JSON. Use descriptive keys. Include a brief schema comment at the top.",
    Markdown: "Format in clean Markdown: use ## headers, **bold** for key terms, - for lists, and ``` for code.",
    XML: "Format using semantic XML tags that describe the content type. Include a root element. Indent properly.",
  };
  return formatMap[state.outputFormat] || `Format the output as ${state.outputFormat}.`;
}

function buildExtrasSentences(state: BuilderState): string {
  if (!state.extras || state.extras.length === 0) return "";
  const extraMap: Record<string, string> = {
    "Include examples": "For every key point, include a concrete, specific example — not a generic placeholder.",
    "Suggest alternatives": "After your main answer, suggest 2-3 alternatives with a clear reason to choose each one.",
    "Think step-by-step": "Think through this step-by-step out loud before giving your final answer. Show your reasoning.",
    "Pros & cons": "For each option or recommendation, explicitly list pros and cons before concluding.",
    "Cite sources": "Cite specific sources, frameworks, or references. If uncertain, flag it explicitly.",
    "No filler / no fluff": "No filler phrases, no hedging, no unnecessary preamble. Get to the point immediately.",
    "Be critical / honest": "Be critically honest. Actively flag weaknesses, risks, edge cases, and things that could go wrong.",
    "Actionable output": "Every recommendation must be immediately actionable — include specific next steps, not general advice.",
    "Include code snippets": "Include inline code snippets to illustrate key points. Snippets should be self-contained and runnable.",
    "Compare approaches": "Compare approaches in a structured way: list each option, its trade-offs, and when to prefer it.",
  };
  return state.extras.map((e) => extraMap[e] || e).join(" ");
}

function buildAvoidSentence(state: BuilderState): string {
  const avoid = (state.avoid || "").trim();
  if (!avoid) return "";
  return `Do not include: ${avoid}.`;
}

export function generatePrompt(state: BuilderState): string {
  const sections: string[] = [];

  const role = buildRoleSentence(state);
  if (role) sections.push(role);

  if ((state.context || "").trim()) {
    sections.push(`Context: ${state.context.trim()}`);
  }

  sections.push(state.taskDescription.trim());

  if (state.taskMode) {
    const instructions = modeInstructions[state.taskMode];
    if (instructions?.length) {
      sections.push(instructions.join("\n"));
    }
    const contract = outputContracts[state.taskMode];
    if (contract) sections.push(contract);
  }

  const constraints = buildConstraintsSentence(state);
  if (constraints) sections.push(constraints);

  const format = buildFormatSentence(state);
  if (format) sections.push(format);

  const extras = buildExtrasSentences(state);
  if (extras) sections.push(extras);

  const avoid = buildAvoidSentence(state);
  if (avoid) sections.push(avoid);

  return sections.join("\n\n");
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
