import { Template, TemplateCategory } from "./types";

// ── Category metadata ──────────────────────────────────────────

export interface CategoryDef {
  id: TemplateCategory;
  nameEn: string;
  nameKm: string;
  emoji: string;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "daily",           nameEn: "Daily Tasks",     nameKm: "កិច្ចការប្រចាំថ្ងៃ",  emoji: "☀️" },
  { id: "developer",       nameEn: "Developer",       nameKm: "អ្នកអភិវឌ្ឍន៍",      emoji: "💻" },
  { id: "marketing",       nameEn: "Marketing",       nameKm: "ទីផ្សារ",            emoji: "📣" },
  { id: "finance",         nameEn: "Finance",         nameKm: "ហិរញ្ញវត្ថុ",         emoji: "💰" },
  { id: "writing",         nameEn: "Writing",         nameKm: "សរសេរ",             emoji: "✍️" },
  { id: "research",        nameEn: "Research",        nameKm: "ស្រាវជ្រាវ",          emoji: "🔬" },
  { id: "education",       nameEn: "Education",       nameKm: "អប់រំ",              emoji: "📚" },
  { id: "social-media",    nameEn: "Social Media",    nameKm: "បណ្ដាញសង្គម",        emoji: "📱" },
  { id: "engineering",     nameEn: "Engineering",     nameKm: "វិស្វកម្ម",           emoji: "⚙️" },
  { id: "medical",         nameEn: "Medical",         nameKm: "វេជ្ជសាស្ត្រ",         emoji: "🏥" },
  { id: "architecture",    nameEn: "Architecture",    nameKm: "ស្ថាបត្យកម្ម",        emoji: "🏛️" },
  { id: "problem-solving", nameEn: "Problem Solving", nameKm: "ដោះស្រាយបញ្ហា",      emoji: "🧩" },
];

// ── Helper ─────────────────────────────────────────────────────

function t(
  id: string,
  name: string,
  nameKm: string,
  cat: TemplateCategory,
  state: Omit<Template["state"], "framework"> & { framework?: Template["state"]["framework"] }
): Template {
  return { id: `preset-${id}`, name, nameKm, category: cat, isPreset: true, state: { framework: null, ...state } as Template["state"] };
}

// ── Templates ──────────────────────────────────────────────────

export const presetTemplates: Template[] = [

  // ─── Daily Tasks ──────────────────────────────────────────────

  t("email-reply", "Email Reply", "ឆ្លើយអ៊ីមែល", "daily", {
    taskMode: "write",
    role: "a professional writer who crafts concise, clear emails that get responses",
    taskDescription: "Write a reply to this email: [PASTE EMAIL]. Keep it brief, professional, and action-oriented.",
    context: "", tone: "Professional", outputFormat: "Paragraphs", length: "Brief",
    audience: "Mixed", extras: ["No filler / no fluff", "Actionable output"], avoid: "filler phrases, over-apologizing",
  }),

  t("meeting-notes", "Meeting Summary", "សង្ខេបកិច្ចប្រជុំ", "daily", {
    taskMode: "write",
    role: "an executive assistant who writes clear meeting summaries with crisp next steps",
    taskDescription: "Summarize these meeting notes into decisions, action items (with owners & deadlines), and key discussion points: [PASTE NOTES]",
    context: "", tone: "Professional", outputFormat: "Bullet Points", length: "Brief",
    audience: "Mixed", extras: ["Actionable output", "No filler / no fluff"], avoid: "",
  }),

  t("weekly-plan", "Weekly Planner", "ផែនការប្រចាំសប្តាហ៍", "daily", {
    taskMode: "brainstorm",
    role: "a productivity coach who helps people plan their weeks for maximum impact",
    taskDescription: "Help me plan my week. My priorities: [LIST 3-5 PRIORITIES]. Schedule them across Monday-Friday with time blocks, breaks, and buffer time.",
    context: "", tone: "Friendly", outputFormat: "Table", length: "Detailed",
    audience: "Mixed", extras: ["Actionable output"], avoid: "vague advice",
  }),

  t("explain-anything", "Explain Anything Simply", "ពន្យល់ឱ្យសាមញ្ញ", "daily", {
    taskMode: "learn",
    role: "a patient teacher who makes complex topics simple using everyday analogies",
    taskDescription: "Explain [TOPIC] in simple terms that anyone can understand. Use a real-world analogy, then build up to the details.",
    context: "", tone: "Friendly", outputFormat: "Paragraphs", length: "Medium",
    audience: "Beginner", extras: ["Include examples", "No filler / no fluff"], avoid: "jargon",
  }),

  t("decision-helper", "Help Me Decide", "ជួយសម្រេចចិត្ត", "daily", {
    taskMode: "analyze",
    role: "a strategic advisor who helps people make clear, rational decisions",
    taskDescription: "Help me decide between these options: [OPTION A] vs [OPTION B]. Consider cost, time, risk, and long-term impact.",
    context: "", tone: "Direct", outputFormat: "Table", length: "Medium",
    audience: "Mixed", extras: ["Pros & cons", "Be critical / honest", "Actionable output"], avoid: "",
  }),

  // ─── Developer ────────────────────────────────────────────────

  t("code-review", "Code Review", "ពិនិត្យកូដ", "developer", {
    taskMode: "analyze",
    role: "a principal engineer conducting a thorough code review focused on correctness, security, and maintainability",
    taskDescription: "Review this code for bugs, security issues, performance problems, and code quality: [PASTE CODE]",
    context: "", tone: "Technical", outputFormat: "Markdown", length: "Detailed",
    audience: "Expert", extras: ["Be critical / honest", "Include code snippets", "Suggest alternatives"], avoid: "",
  }),

  t("api-design", "API Design", "រចនា API", "developer", {
    taskMode: "code",
    role: "a senior API architect who designs RESTful and GraphQL APIs for scale, security, and developer experience",
    taskDescription: "Design an API for [FEATURE/SYSTEM]. Include endpoints, request/response schemas, authentication, error handling, and rate limiting.",
    context: "", tone: "Technical", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Include code snippets", "Compare approaches"], avoid: "",
  }),

  t("debug-fix", "Debug & Fix", "កែកំហុស", "developer", {
    taskMode: "debug",
    role: "a principal debugging engineer who methodically isolates root causes",
    taskDescription: "This code has a bug: [DESCRIBE BUG + PASTE CODE]. Find the root cause, explain why it happens, and provide the fix with before/after comparison.",
    context: "", tone: "Technical", outputFormat: "Step-by-Step", length: "Detailed",
    audience: "Intermediate", extras: ["Think step-by-step", "Include code snippets"], avoid: "",
  }),

  t("system-architecture", "System Architecture", "ស្ថាបត្យកម្មប្រព័ន្ធ", "developer", {
    taskMode: "brainstorm",
    role: "a solutions architect with experience scaling systems to millions of users",
    taskDescription: "Design the architecture for [SYSTEM]. Include components, data flow, tech stack recommendations, scaling strategy, and trade-offs.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Compare approaches", "Pros & cons"], avoid: "",
  }),

  t("sql-query", "SQL Query Builder", "សង្កេត SQL", "developer", {
    taskMode: "code",
    role: "a database engineer who writes optimized, secure SQL queries with clear explanations",
    taskDescription: "Write a SQL query to [DESCRIBE WHAT YOU NEED]. Include indexes, explain the query plan, and handle edge cases.",
    context: "", tone: "Technical", outputFormat: "Code Block", length: "Detailed",
    audience: "Intermediate", extras: ["Include examples", "Include code snippets", "Think step-by-step"], avoid: "",
  }),

  // ─── Marketing ────────────────────────────────────────────────

  t("marketing-copy", "Ad Copy / Landing Page", "ច្បាប់ចម្លងផ្សាយ", "marketing", {
    taskMode: "write",
    role: "a conversion copywriter who writes benefit-focused copy that drives action. You understand AIDA, PAS, and storytelling frameworks.",
    taskDescription: "Write compelling marketing copy for [PRODUCT/SERVICE]. Include headline, subhead, 3 key benefits, social proof section, and a strong CTA.",
    context: "", tone: "Creative", outputFormat: "Markdown", length: "Medium",
    audience: "Mixed", extras: ["Include examples", "Actionable output"], avoid: "generic claims, buzzwords without substance",
  }),

  t("email-campaign", "Email Campaign", "យុទ្ធនាការអ៊ីមែល", "marketing", {
    taskMode: "write",
    role: "an email marketing expert who writes high-converting email sequences with strong subject lines",
    taskDescription: "Write a [3/5/7]-email sequence for [GOAL: launch, nurture, re-engagement, etc.]. Include subject lines, preview text, body copy, and CTAs for each email.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Detailed",
    audience: "Mixed", extras: ["Include examples", "Actionable output"], avoid: "spam triggers, ALL CAPS",
  }),

  t("seo-content", "SEO Content Brief", "បទវិភាគ SEO", "marketing", {
    taskMode: "write",
    role: "an SEO strategist who creates content that ranks on Google while providing genuine value to readers",
    taskDescription: "Create an SEO-optimized article outline for the keyword '[KEYWORD]'. Include title, meta description, H2/H3 structure, target word count, internal linking strategy, and FAQ schema.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Detailed",
    audience: "Intermediate", extras: ["Actionable output", "Include examples"], avoid: "keyword stuffing",
  }),

  t("brand-voice", "Brand Voice Guide", "សៀវភៅសម្លេងម៉ាក", "marketing", {
    taskMode: "analyze",
    role: "a brand strategist who defines memorable, consistent brand voices",
    taskDescription: "Create a brand voice guide for [BRAND/COMPANY]. Include tone attributes (3-5), do's and don'ts, sample copy in different contexts (social, email, support), and vocabulary to use/avoid.",
    context: "", tone: "Creative", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Mixed", extras: ["Include examples", "Compare approaches"], avoid: "",
  }),

  // ─── Finance ──────────────────────────────────────────────────

  t("financial-analysis", "Financial Analysis", "វិភាគហិរញ្ញវត្ថុ", "finance", {
    taskMode: "analyze",
    role: "a senior financial analyst with expertise in valuation, ratio analysis, and strategic finance",
    taskDescription: "Analyze the financial health of [COMPANY/DATA]. Include revenue trends, profitability ratios, cash flow analysis, and key risks. Provide a clear recommendation.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Be critical / honest", "Cite sources", "Actionable output"], avoid: "speculation without data",
  }),

  t("investment-memo", "Investment Memo", "អនុស្សរណៈវិនិយោគ", "finance", {
    taskMode: "write",
    role: "a venture analyst who writes clear, evidence-backed investment memos",
    taskDescription: "Write an investment memo for [COMPANY/OPPORTUNITY]. Include thesis, market size, competitive landscape, team assessment, risks, and recommended terms.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Be critical / honest", "Pros & cons"], avoid: "",
  }),

  t("budget-plan", "Budget Planner", "ផែនការថវិកា", "finance", {
    taskMode: "analyze",
    role: "a financial planner who creates practical, actionable budgets",
    taskDescription: "Create a budget plan for [GOAL: monthly personal budget, project budget, startup runway, etc.]. Include categories, allocation percentages, and savings strategy.",
    context: "", tone: "Professional", outputFormat: "Table", length: "Detailed",
    audience: "Intermediate", extras: ["Actionable output", "Include examples"], avoid: "",
  }),

  // ─── Writing ──────────────────────────────────────────────────

  t("blog-post", "Blog Post", "អត្ថបទប្លក់", "writing", {
    taskMode: "write",
    role: "an expert content writer who creates engaging, well-researched blog posts that keep readers scrolling",
    taskDescription: "Write a blog post about [TOPIC]. Hook readers in the first line, provide unique insights, include data or examples, and end with a clear takeaway.",
    context: "", tone: "Casual", outputFormat: "Markdown", length: "Detailed",
    audience: "Mixed", extras: ["Include examples", "Actionable output"], avoid: "generic advice, filler phrases",
  }),

  t("product-spec", "Product Spec / PRD", "ឯកសារផលិតផល", "writing", {
    taskMode: "write",
    role: "a senior product manager who writes clear, complete product requirement documents",
    taskDescription: "Write a product spec for [FEATURE]. Include problem statement, goals, user stories, acceptance criteria, success metrics, and out-of-scope items.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Actionable output", "Think step-by-step"], avoid: "",
  }),

  t("cover-letter", "Cover Letter", "លិខិតដាក់ពាក្យ", "writing", {
    taskMode: "write",
    role: "a career coach who writes compelling cover letters that get interviews",
    taskDescription: "Write a cover letter for [JOB TITLE] at [COMPANY]. Highlight my skills: [LIST SKILLS]. Match my experience to the job requirements and show genuine enthusiasm.",
    context: "", tone: "Professional", outputFormat: "Paragraphs", length: "Medium",
    audience: "Mixed", extras: ["No filler / no fluff", "Actionable output"], avoid: "clichés, generic statements",
  }),

  t("press-release", "Press Release", "សេចក្ដីប្រកាសព័ត៌មាន", "writing", {
    taskMode: "write",
    role: "a PR specialist who writes newsworthy press releases that journalists actually want to cover",
    taskDescription: "Write a press release announcing [NEWS]. Include headline, dateline, lead paragraph (who/what/when/where/why), quotes, and boilerplate.",
    context: "", tone: "Professional", outputFormat: "Paragraphs", length: "Medium",
    audience: "Mixed", extras: ["No filler / no fluff"], avoid: "marketing fluff, adjectives without substance",
  }),

  // ─── Research ─────────────────────────────────────────────────

  t("literature-review", "Literature Review", "ពិនិត្យឯកសារ", "research", {
    taskMode: "analyze",
    role: "an academic researcher who synthesizes literature into clear, structured reviews",
    taskDescription: "Write a literature review on [TOPIC]. Identify key themes, compare methodologies, highlight gaps in current research, and suggest future directions.",
    context: "", tone: "Academic", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Cite sources", "Compare approaches", "Be critical / honest"], avoid: "",
  }),

  t("data-analysis", "Data Analysis Plan", "ផែនការវិភាគទិន្នន័យ", "research", {
    taskMode: "analyze",
    role: "a data scientist who designs rigorous analysis frameworks",
    taskDescription: "Design a data analysis plan for [RESEARCH QUESTION]. Include data collection strategy, variables, statistical methods, potential biases, and visualization approach.",
    context: "", tone: "Academic", outputFormat: "Step-by-Step", length: "Detailed",
    audience: "Expert", extras: ["Think step-by-step", "Be critical / honest"], avoid: "",
  }),

  t("case-study", "Case Study", "ករណីសិក្សា", "research", {
    taskMode: "write",
    role: "a business analyst who writes compelling case studies with clear before/after results",
    taskDescription: "Write a case study about [PROJECT/CLIENT]. Include challenge, approach, solution, results (with metrics), and key learnings.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Detailed",
    audience: "Mixed", extras: ["Include examples", "Actionable output"], avoid: "",
  }),

  // ─── Education ────────────────────────────────────────────────

  t("lesson-plan", "Lesson Plan", "ផែនការមេរៀន", "education", {
    taskMode: "write",
    role: "an experienced educator who creates engaging, outcome-focused lesson plans",
    taskDescription: "Create a lesson plan for teaching [TOPIC] to [AUDIENCE/GRADE]. Include learning objectives, activities, discussion questions, assessment, and materials needed.",
    context: "", tone: "Friendly", outputFormat: "Markdown", length: "Detailed",
    audience: "Intermediate", extras: ["Include examples", "Think step-by-step"], avoid: "",
  }),

  t("explain-like-5", "Explain Like I'm 5", "ពន្យល់ដូចក្មេង ៥ឆ្នាំ", "education", {
    taskMode: "learn",
    role: "a world-class educator who makes complex topics immediately understandable",
    taskDescription: "Explain [COMPLEX TOPIC] as if I'm 5 years old. Use everyday analogies, build understanding step by step, and point out common misconceptions.",
    context: "", tone: "Friendly", outputFormat: "Paragraphs", length: "Medium",
    audience: "Beginner", extras: ["Include examples", "No filler / no fluff"], avoid: "jargon, condescension",
  }),

  t("study-guide", "Study Guide", "សៀវភៅណែនាំសិក្សា", "education", {
    taskMode: "learn",
    role: "an academic tutor who creates comprehensive, exam-ready study guides",
    taskDescription: "Create a study guide for [SUBJECT/EXAM]. Include key concepts, definitions, formulas, practice questions with answers, and study tips.",
    context: "", tone: "Academic", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Intermediate", extras: ["Include examples", "Think step-by-step"], avoid: "",
  }),

  // ─── Social Media ─────────────────────────────────────────────

  t("instagram-content", "Instagram Content", "មាតិកា Instagram", "social-media", {
    taskMode: "write",
    role: "a social media strategist who creates scroll-stopping Instagram content with strong hooks and engagement",
    taskDescription: "Create [5] Instagram posts for [BRAND/NICHE]. Each post needs: hook (first line), caption body, CTA, and 15 relevant hashtags. Mix educational, entertaining, and promotional content.",
    context: "", tone: "Creative", outputFormat: "Markdown", length: "Detailed",
    audience: "Mixed", extras: ["Include examples", "Actionable output"], avoid: "generic hashtags",
  }),

  t("youtube-script", "YouTube Script", "ស្គ្រីប YouTube", "social-media", {
    taskMode: "write",
    role: "a YouTube content strategist who writes scripts optimized for retention and engagement",
    taskDescription: "Write a YouTube script for a [DURATION]-minute video about [TOPIC]. Include a strong hook (first 5 seconds), clear structure, B-roll suggestions, and end screen CTA.",
    context: "", tone: "Casual", outputFormat: "Markdown", length: "Detailed",
    audience: "Mixed", extras: ["Include examples", "Actionable output"], avoid: "slow intros, clickbait without payoff",
  }),

  t("linkedin-post", "LinkedIn Post", "អត្ថបទ LinkedIn", "social-media", {
    taskMode: "write",
    role: "a LinkedIn growth expert who writes posts that generate engagement and build professional authority",
    taskDescription: "Write a LinkedIn post about [TOPIC/INSIGHT]. Use the hook-story-lesson format. Start with a provocative first line, share a personal experience or data point, and end with a question to drive comments.",
    context: "", tone: "Professional", outputFormat: "Paragraphs", length: "Medium",
    audience: "Mixed", extras: ["No filler / no fluff", "Actionable output"], avoid: "hashtag spam, humble bragging",
  }),

  t("tiktok-hooks", "TikTok / Reels Hooks", "ក្បាលវីដេអូ TikTok", "social-media", {
    taskMode: "brainstorm",
    role: "a short-form video strategist who creates viral hooks and content concepts",
    taskDescription: "Generate [10] TikTok/Reels hook ideas for [NICHE/TOPIC]. Each hook should stop the scroll in under 2 seconds. Include the visual setup and text overlay for each.",
    context: "", tone: "Creative", outputFormat: "Bullet Points", length: "Medium",
    audience: "Mixed", extras: ["Include examples"], avoid: "overused hooks",
  }),

  // ─── Engineering ──────────────────────────────────────────────

  t("tech-spec", "Technical Specification", "លក្ខណៈបច្ចេកទេស", "engineering", {
    taskMode: "write",
    role: "a senior engineer who writes clear technical specifications that teams can execute",
    taskDescription: "Write a technical specification for [PROJECT/COMPONENT]. Include requirements, constraints, design decisions, interfaces, testing strategy, and deployment plan.",
    context: "", tone: "Technical", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Expert", extras: ["Think step-by-step", "Compare approaches"], avoid: "",
  }),

  t("troubleshooting", "Troubleshooting Guide", "សៀវភៅដោះស្រាយ", "engineering", {
    taskMode: "debug",
    role: "an experienced field engineer who creates systematic troubleshooting guides",
    taskDescription: "Create a troubleshooting guide for [SYSTEM/PROBLEM]. Include symptom checklist, diagnostic steps in order, common root causes, and fixes for each.",
    context: "", tone: "Technical", outputFormat: "Step-by-Step", length: "Detailed",
    audience: "Intermediate", extras: ["Think step-by-step"], avoid: "",
  }),

  t("project-estimate", "Project Estimate", "ការប៉ាន់ប្រមាណគម្រោង", "engineering", {
    taskMode: "analyze",
    role: "a project manager who creates realistic, defensible project estimates",
    taskDescription: "Create a project estimate for [PROJECT]. Break down into phases, tasks, time estimates (optimistic/realistic/pessimistic), dependencies, and risk factors.",
    context: "", tone: "Professional", outputFormat: "Table", length: "Detailed",
    audience: "Mixed", extras: ["Be critical / honest", "Actionable output"], avoid: "unrealistic optimism",
  }),

  // ─── Medical ──────────────────────────────────────────────────

  t("patient-education", "Patient Education", "អប់រំអ្នកជំងឺ", "medical", {
    taskMode: "write",
    role: "a medical communicator who explains health topics in clear, accurate, patient-friendly language",
    taskDescription: "Write patient education material about [CONDITION/TREATMENT]. Include what it is, symptoms, treatment options, what to expect, and when to seek urgent care.",
    context: "", tone: "Friendly", outputFormat: "Markdown", length: "Medium",
    audience: "Non-technical", extras: ["Include examples", "No filler / no fluff"], avoid: "medical jargon without explanation",
  }),

  t("clinical-summary", "Clinical Summary", "សង្ខេបគ្លីនិក", "medical", {
    taskMode: "write",
    role: "a medical professional who writes concise, structured clinical summaries",
    taskDescription: "Write a clinical summary for: [PASTE PATIENT NOTES]. Include chief complaint, history, exam findings, assessment, and plan. Use standard medical format.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Medium",
    audience: "Expert", extras: ["No filler / no fluff"], avoid: "",
  }),

  // ─── Architecture ─────────────────────────────────────────────

  t("design-brief", "Design Brief", "ប្រវត្តិរចនា", "architecture", {
    taskMode: "write",
    role: "an architectural project manager who creates comprehensive, client-ready design briefs",
    taskDescription: "Create a design brief for [PROJECT TYPE: residential, commercial, renovation, etc.]. Include client requirements, site constraints, design vision, sustainability goals, budget considerations, and project timeline.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Comprehensive",
    audience: "Mixed", extras: ["Actionable output", "Think step-by-step"], avoid: "",
  }),

  t("site-analysis", "Site Analysis", "វិភាគទីតាំង", "architecture", {
    taskMode: "analyze",
    role: "an urban planner and architect who conducts thorough site analyses",
    taskDescription: "Conduct a site analysis for [LOCATION/PROJECT]. Cover: topography, climate, access, zoning, surrounding context, environmental considerations, and design opportunities/constraints.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Detailed",
    audience: "Expert", extras: ["Be critical / honest", "Actionable output"], avoid: "",
  }),

  // ─── Problem Solving ──────────────────────────────────────────

  t("root-cause", "Root Cause Analysis", "វិភាគមូលហេតុ", "problem-solving", {
    taskMode: "analyze",
    role: "a Six Sigma Black Belt who systematically finds root causes using structured frameworks",
    taskDescription: "Perform a root cause analysis for: [DESCRIBE PROBLEM]. Use the 5 Whys and Fishbone (Ishikawa) frameworks. Identify the true root cause and recommend corrective actions.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Detailed",
    audience: "Mixed", extras: ["Think step-by-step", "Actionable output", "Be critical / honest"], avoid: "",
  }),

  t("decision-matrix", "Decision Matrix", "ម៉ាទ្រីសម្រេចចិត្ត", "problem-solving", {
    taskMode: "analyze",
    role: "a management consultant who uses structured decision-making frameworks",
    taskDescription: "Create a weighted decision matrix for: [DESCRIBE DECISION + OPTIONS]. Define criteria, assign weights, score each option, and provide a clear recommendation.",
    context: "", tone: "Professional", outputFormat: "Table", length: "Detailed",
    audience: "Mixed", extras: ["Pros & cons", "Actionable output"], avoid: "",
  }),

  t("process-improvement", "Process Improvement", "ធ្វើឱ្យប្រសើរដំណើរការ", "problem-solving", {
    taskMode: "analyze",
    role: "a process optimization expert who identifies waste and inefficiency",
    taskDescription: "Analyze and improve this process: [DESCRIBE CURRENT PROCESS]. Identify bottlenecks, unnecessary steps, and automation opportunities. Propose an improved process with expected gains.",
    context: "", tone: "Professional", outputFormat: "Step-by-Step", length: "Detailed",
    audience: "Mixed", extras: ["Think step-by-step", "Actionable output", "Compare approaches"], avoid: "",
  }),

  t("startup-pitch", "Startup Pitch", "បង្ហាញគម្រោង Startup", "problem-solving", {
    taskMode: "write",
    role: "a startup advisor who has helped companies raise $100M+ and knows what investors want to hear",
    taskDescription: "Write a pitch deck script for [STARTUP/IDEA]. Cover: problem, solution, market size, business model, traction, team, competitive advantage, and the ask.",
    context: "", tone: "Professional", outputFormat: "Markdown", length: "Detailed",
    audience: "Expert", extras: ["No filler / no fluff", "Actionable output"], avoid: "hand-waving, unsubstantiated claims",
  }),
];
