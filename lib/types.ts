export type TaskMode = "write" | "code" | "analyze" | "debug" | "learn" | "brainstorm";

export type PromptFramework =
  | "TAG" | "BAB" | "RTF" | "CARE" | "RISE" | "AIM" | "GRO" | "FIT" | "LED";

export interface TaskModeOption {
  id: TaskMode;
  label: string;
  sublabel: string;
  icon: string;
}

export type Tone = "Professional" | "Casual" | "Academic" | "Friendly" | "Direct" | "Creative" | "Technical";
export type OutputFormat = "Paragraphs" | "Bullet Points" | "Step-by-Step" | "Table" | "Code Block" | "JSON" | "Markdown" | "XML";
export type Length = "Brief" | "Medium" | "Detailed" | "Comprehensive" | "As needed";
export type Audience = "Expert" | "Intermediate" | "Beginner" | "Non-technical" | "Mixed";

export type ExtraInstruction =
  | "Include examples"
  | "Suggest alternatives"
  | "Think step-by-step"
  | "Pros & cons"
  | "Cite sources"
  | "No filler / no fluff"
  | "Be critical / honest"
  | "Actionable output"
  | "Include code snippets"
  | "Compare approaches"
  | "Include example format";

export interface BuilderState {
  taskMode: TaskMode | null;
  framework?: PromptFramework | null;
  role: string;
  taskDescription: string;
  context: string;
  tone: Tone | null;
  outputFormat: OutputFormat | null;
  length: Length | null;
  audience: Audience | null;
  extras: ExtraInstruction[];
  avoid: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  taskMode: TaskMode;
  taskDescription: string;
  generatedPrompt: string;
  starred?: boolean;
}

export interface Template {
  id: string;
  name: string;
  state: BuilderState;
  isPreset: boolean;
}
