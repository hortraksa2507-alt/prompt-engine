import { BuilderState, PromptFramework } from "./types";

// ── Mode-specific knowledge ─────────────────────────────────────

const modeRoles: Record<string, string> = {
  write: "an expert content strategist and writer with 15+ years crafting high-impact content across industries — blogs, white papers, marketing copy, technical docs, and executive communications",
  code: "a principal software engineer with 15+ years building production systems at scale — you write code that is clean, idiomatic, secure, thoroughly tested, and maintainable by teams",
  analyze: "a senior analyst and strategic advisor who turns raw information into clear, evidence-backed insights — you separate signal from noise, identify root causes, and deliver recommendations that drive decisions",
  debug: "a principal engineer specializing in systematic debugging — you methodically isolate root causes using divide-and-conquer, identify cascading failures, and deliver permanent fixes with full reasoning",
  learn: "a world-class educator and technical writer who specializes in making complex subjects immediately understandable — you build mental models progressively, use perfect analogies, and make learners feel capable",
  brainstorm: "a creative director and systems thinker who generates both obvious and non-obvious ideas across multiple dimensions — you balance creativity with feasibility and always connect ideas to impact",
};

const modeSystemBehavior: Record<string, string> = {
  write: `<thinking_approach>
Before writing, identify: (1) the ONE key message, (2) who is reading and what they care about, (3) the ideal structure for this content type.
</thinking_approach>`,
  code: `<thinking_approach>
Before coding: (1) state the approach in 2-3 sentences, (2) identify edge cases, (3) consider security implications. After coding: explain key design decisions.
</thinking_approach>`,
  analyze: `<thinking_approach>
Before analyzing: (1) identify what data/evidence is available, (2) what the key question really is, (3) what framework best fits this analysis. Distinguish facts from inferences.
</thinking_approach>`,
  debug: `<thinking_approach>
Before debugging: (1) restate observed vs expected behavior, (2) form a hypothesis, (3) design a test to confirm/deny. Show reasoning at every step.
</thinking_approach>`,
  learn: `<thinking_approach>
Before explaining: (1) identify what the learner likely already knows, (2) find the single best analogy, (3) plan a progressive complexity path from simple→nuanced.
</thinking_approach>`,
  brainstorm: `<thinking_approach>
Before ideating: (1) define the problem space, (2) identify at least 3 different angles/dimensions, (3) push past first-thought ideas to find non-obvious solutions.
</thinking_approach>`,
};

const modeInstructions: Record<string, string[]> = {
  write: [
    "Open with a compelling hook that immediately establishes value for the reader",
    "Structure with a clear logical flow — each paragraph leads naturally to the next",
    "Use concrete specifics: named examples, numbers, real scenarios — never vague generalizations",
    "Match the requested tone consistently from first word to last",
    "Vary sentence length deliberately — short for impact, longer for nuance",
    "End with a memorable conclusion or clear call-to-action",
  ],
  code: [
    "Write idiomatic code for the language/framework — follow established conventions",
    "Handle edge cases explicitly: null/undefined, empty inputs, boundary values, concurrent access",
    "Add security considerations: input validation, injection prevention, least privilege",
    "Include meaningful comments only for non-obvious logic",
    "Provide usage examples showing both happy path and error handling",
  ],
  analyze: [
    "Open with a 2-3 sentence executive summary — the 'so what' upfront",
    "Support every conclusion with specific evidence — no unsupported assertions",
    "Distinguish between confirmed facts, reasonable inferences, and assumptions",
    "Identify second-order effects and non-obvious patterns",
    "Quantify impact and priority — use numbers, percentages, or relative comparisons",
    "Close with a prioritized action plan",
  ],
  debug: [
    "Precisely restate the problem — observed vs expected",
    "Form a hypothesis about root cause before investigating",
    "Show reasoning: what you checked, what it told you, what you ruled out",
    "Trace execution from input to failure — identify exact divergence point",
    "Distinguish symptom (what fails) from root cause (why it fails)",
    "Provide fix with clear before/after comparison",
    "Recommend preventive measures: tests, patterns, monitoring",
  ],
  learn: [
    "Start with the single best mental model or analogy for the core concept",
    "Build progressively: simplest case first, then add complexity layer by layer",
    "Connect new concepts to things the learner already understands",
    "Include concrete, runnable examples for each key concept",
    "Call out top misconceptions and explain exactly why they're wrong",
    "End with a 'what to learn next' path",
  ],
  brainstorm: [
    "Generate ideas across at least 3 different dimensions — don't cluster in one direction",
    "Include both incremental (improve existing) and disruptive (rethink from scratch) ideas",
    "For each idea: what it is, why it could work, main risk",
    "Push past first-thought ideas — 4th and 5th are often more valuable",
    "Identify combinations that could compound individual value",
    "Rank by impact-to-effort ratio",
  ],
};

const outputContracts: Record<string, string> = {
  write: "Deliver polished, publication-ready content — not a draft or outline unless explicitly asked.",
  code: "Deliver working, complete code — not pseudocode or placeholders unless explicitly specified.",
  analyze: "Deliver a structured analysis with clear findings, evidence, and prioritized recommendations.",
  debug: "Deliver a definitive root cause diagnosis and a complete fix — not guesses.",
  learn: "Deliver a complete, self-contained explanation that leaves no important gaps.",
  brainstorm: "Deliver a concrete, evaluated list of ideas — not vague directions.",
};

// ── Builder functions ────────────────────────────────────────────

function buildRole(state: BuilderState): string {
  const custom = (state.role || "").trim();
  if (custom) return custom;
  return state.taskMode ? (modeRoles[state.taskMode] || "") : "";
}

function buildConstraints(state: BuilderState): string {
  const parts: string[] = [];

  if (state.tone) {
    parts.push(`Tone: ${state.tone.toLowerCase()}`);
  }

  if (state.audience) {
    const map: Record<string, string> = {
      Expert: "Expert — use precise terminology, skip basics",
      Intermediate: "Intermediate — explain specialized terms but don't over-explain",
      Beginner: "Beginner — define all terms, no assumptions about prior knowledge",
      "Non-technical": "Non-technical — use analogies, avoid jargon entirely",
      Mixed: "Mixed — accessible but not condescending",
    };
    parts.push(`Audience: ${map[state.audience] || state.audience}`);
  }

  if (state.length) {
    const map: Record<string, string> = {
      Brief: "Brief — say what needs to be said and stop",
      Medium: "Medium — cover key points without exhaustive detail",
      Detailed: "Detailed — cover all important angles with supporting detail",
      Comprehensive: "Comprehensive — leave nothing important out, cover edge cases",
      "As needed": "As needed — let content determine length",
    };
    parts.push(`Length: ${map[state.length] || state.length}`);
  }

  return parts.join("\n");
}

function buildFormat(state: BuilderState): string {
  if (!state.outputFormat) return "";
  const map: Record<string, string> = {
    Paragraphs: "Flowing prose paragraphs with clear topic sentences",
    "Bullet Points": "Scannable bullet points grouped under clear headers — one idea per bullet",
    "Step-by-Step": "Numbered steps — each step: one clear action + expected outcome",
    Table: "Well-structured table with clear column headers — every row comparable",
    "Code Block": "Properly-fenced code blocks with language specified — explanation separate from code",
    JSON: "Valid, pretty-printed JSON with descriptive keys",
    Markdown: "Clean Markdown with ## headers, **bold** key terms, - lists, ``` code blocks",
    XML: "Semantic XML tags describing content types with proper indentation",
  };
  return map[state.outputFormat] || state.outputFormat;
}

function buildExtras(state: BuilderState): string[] {
  if (!state.extras?.length) return [];
  const map: Record<string, string> = {
    "Include examples": "Include a concrete, specific example for every key point",
    "Suggest alternatives": "Suggest 2-3 alternatives with a clear reason to choose each",
    "Think step-by-step": "Think through this step-by-step before the final answer — show reasoning",
    "Pros & cons": "For each option/recommendation, explicitly list pros and cons",
    "Cite sources": "Cite specific sources, frameworks, or references — flag uncertainty explicitly",
    "No filler / no fluff": "No filler, no hedging, no preamble — get to the point immediately",
    "Be critical / honest": "Be critically honest — flag weaknesses, risks, and things that could go wrong",
    "Actionable output": "Every recommendation must be immediately actionable with specific next steps",
    "Include code snippets": "Include inline code snippets that are self-contained and runnable",
    "Compare approaches": "Compare approaches: list each option, trade-offs, and when to prefer it",
    "Include example format": "Include an example showing the exact output format and quality expected",
  };
  return state.extras.map((e) => map[e] || e);
}

function buildAvoid(state: BuilderState): string {
  return (state.avoid || "").trim();
}

// ── XML-structured prompt (default, no framework) ───────────────

function generateStructuredPrompt(state: BuilderState): string {
  const sections: string[] = [];
  const role = buildRole(state);
  const ctx = (state.context || "").trim();
  const task = state.taskDescription.trim();
  const mode = state.taskMode;
  const constraints = buildConstraints(state);
  const format = buildFormat(state);
  const extras = buildExtras(state);
  const avoid = buildAvoid(state);
  const instructions = mode ? (modeInstructions[mode] || []) : [];
  const contract = mode ? (outputContracts[mode] || "") : "";
  const thinking = mode ? (modeSystemBehavior[mode] || "") : "";

  // Role
  if (role) {
    sections.push(`<role>\nYou are ${role}.\n</role>`);
  }

  // Thinking approach (helps Claude produce better output)
  if (thinking) {
    sections.push(thinking);
  }

  // Context
  if (ctx) {
    sections.push(`<context>\n${ctx}\n</context>`);
  }

  // Task — the core request
  sections.push(`<task>\n${task}\n</task>`);

  // Instructions
  if (instructions.length > 0) {
    const instrLines = instructions.map((s, i) => `${i + 1}. ${s}`).join("\n");
    sections.push(`<instructions>\n${instrLines}\n</instructions>`);
  }

  // Constraints block
  const constraintParts: string[] = [];
  if (constraints) constraintParts.push(constraints);
  if (format) constraintParts.push(`Format: ${format}`);
  if (extras.length) constraintParts.push(...extras);

  if (constraintParts.length) {
    sections.push(`<constraints>\n${constraintParts.join("\n")}\n</constraints>`);
  }

  // Avoid
  if (avoid) {
    sections.push(`<avoid>\n${avoid}\n</avoid>`);
  }

  // Output contract
  if (contract) {
    sections.push(`<output_requirement>\n${contract}\n</output_requirement>`);
  }

  return sections.join("\n\n");
}

// ── Framework-based prompt builders ─────────────────────────────

function applyFramework(framework: PromptFramework, state: BuilderState): string {
  const task = state.taskDescription.trim();
  const role = buildRole(state);
  const ctx = (state.context || "").trim();
  const mode = state.taskMode;
  const instructions = mode ? (modeInstructions[mode] || []) : [];
  const contract = mode ? (outputContracts[mode] || "") : "";
  const constraints = buildConstraints(state);
  const format = buildFormat(state);
  const extras = buildExtras(state);
  const avoid = buildAvoid(state);

  // Build quality block shared across frameworks
  const qualityParts: string[] = [];
  if (constraints) qualityParts.push(constraints);
  if (format) qualityParts.push(`Format: ${format}`);
  if (extras.length) qualityParts.push(...extras);
  if (avoid) qualityParts.push(`Avoid: ${avoid}`);
  const quality = qualityParts.length
    ? `\n<constraints>\n${qualityParts.join("\n")}\n</constraints>`
    : "";

  switch (framework) {
    case "TAG": {
      const actionLines = instructions.length
        ? instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")
        : "Follow best practices for this type of task.";
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<task>\n${task}\n</task>`,
        `\n<action>\n${actionLines}\n</action>`,
        `\n<goal>\n${contract || "Deliver a complete, high-quality response that fully addresses the task."}\n</goal>`,
        ctx ? `\n<context>\n${ctx}\n</context>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "BAB": {
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<before>\n${ctx || "[Describe the current situation or problem]"}\n</before>`,
        `\n<after>\n${contract || "A complete, high-quality response that fully solves the task."}\n</after>`,
        `\n<bridge>\n${task}\n</bridge>`,
        instructions.length ? `\n<approach>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</approach>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "RTF": {
      return [
        `<role>\nYou are ${role || "an expert assistant"}.\n</role>`,
        `\n<task>\n${task}\n</task>`,
        `\n<format>\n${format || "Use the clearest format for this content type."}\n</format>`,
        ctx ? `\n<context>\n${ctx}\n</context>` : "",
        instructions.length ? `\n<instructions>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</instructions>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "CARE": {
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<context>\n${ctx || "No additional context provided."}\n</context>`,
        `\n<action>\n${task}\n</action>`,
        `\n<result>\n${contract || "A thorough, accurate, and immediately usable response."}\n</result>`,
        `\n<example>\nProvide a concrete example illustrating the expected output quality and format.\n</example>`,
        instructions.length ? `\n<guidelines>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</guidelines>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "RISE": {
      const steps = instructions.length
        ? instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")
        : "Follow best practices step by step.";
      return [
        `<role>\nYou are ${role || "an expert assistant"}.\n</role>`,
        `\n<input>\n${task}${ctx ? `\n\nContext: ${ctx}` : ""}\n</input>`,
        `\n<steps>\n${steps}\n</steps>`,
        `\n<expectation>\n${contract || "A complete, high-quality response."}\n</expectation>`,
        quality,
      ].filter(Boolean).join("\n");
    }

    case "AIM": {
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<action>\n${task}\n</action>`,
        `\n<intent>\n${ctx || "Achieve a high-quality outcome that is immediately actionable."}\n</intent>`,
        `\n<metric>\n${contract || "Success = the response fully solves the task with no follow-up needed."}\n</metric>`,
        instructions.length ? `\n<guidelines>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</guidelines>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "GRO": {
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<goal>\n${task}\n</goal>`,
        `\n<reason>\n${ctx || "Needed to achieve a high-quality, accurate, and complete result."}\n</reason>`,
        `\n<output>\n${contract || "A thorough, well-structured response ready to use immediately."}\n</output>`,
        instructions.length ? `\n<approach>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</approach>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "FIT": {
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<format>\n${format || "Use the most appropriate format for clarity and usefulness."}\n</format>`,
        `\n<input>\n${ctx || task}\n</input>`,
        `\n<task>\n${task}\n</task>`,
        instructions.length ? `\n<guidelines>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</guidelines>` : "",
        quality,
      ].filter(Boolean).join("\n");
    }

    case "LED": {
      const level = state.audience
        ? { Expert: "Expert — precise terminology, skip basics", Intermediate: "Intermediate — explain specialized terms", Beginner: "Beginner — define all terms, no prior knowledge assumed", "Non-technical": "Non-technical — analogies and plain language", Mixed: "Mixed — accessible but not condescending" }[state.audience] ?? state.audience
        : "Match complexity to the task";
      return [
        role ? `<role>\nYou are ${role}.\n</role>\n` : "",
        `<level>\n${level}\n</level>`,
        `\n<expectation>\n${task}\n</expectation>`,
        `\n<direction>\n${[state.tone ? `Tone: ${state.tone}` : "", format ? `Format: ${format}` : "", state.length ? `Length: ${state.length}` : ""].filter(Boolean).join("\n") || "Clear, structured, and immediately useful"}\n</direction>`,
        ctx ? `\n<context>\n${ctx}\n</context>` : "",
        instructions.length ? `\n<guidelines>\n${instructions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n</guidelines>` : "",
        contract ? `\n<output_requirement>\n${contract}\n</output_requirement>` : "",
        avoid ? `\n<avoid>\n${avoid}\n</avoid>` : "",
      ].filter(Boolean).join("\n");
    }
  }
}

// ── Public API ───────────────────────────────────────────────────

export function generatePrompt(state: BuilderState): string {
  if (state.framework) {
    return applyFramework(state.framework, state);
  }
  return generateStructuredPrompt(state);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
