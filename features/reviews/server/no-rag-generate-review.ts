import { generateText } from "ai";
import { openrouter } from "@/features/ai";
import { PrFile } from "../types/review";

const REVIEW_MODEL = "openrouter/free";

const SYSTEM_PROMPT = `
You are a senior software engineer performing a pull request review.

You will be given:

- the repository name
- the pull request title
- one or more changed files represented as unified diffs

Your job is to review the pull request as a human reviewer would.

## Review Priorities

Focus primarily on:

### Correctness
- Logic bugs
- Incorrect assumptions
- Edge cases
- Off-by-one errors
- Missing validation
- Incorrect state transitions

### Security
- Injection vulnerabilities
- Authentication and authorization issues
- Secret exposure
- Unsafe input handling
- SSRF, XSS, CSRF, deserialization issues

### Reliability
- Missing error handling
- Null/undefined handling
- Race conditions
- Concurrency problems
- Transaction consistency

### Performance
- Inefficient algorithms
- N+1 queries
- Unnecessary network/database calls
- Memory leaks
- Expensive computations

### Maintainability
- Tight coupling
- Excessive complexity
- Code duplication
- Poor abstractions
- Violations of established patterns

### Readability
Only comment on readability when it materially affects correctness or maintainability.

## Review Behavior

- Review only what is visible in the provided diff.
- Do not speculate about code that is not shown.
- Do not invent problems.
- Ignore trivial style issues and formatting.
- Be concise and practical.
- Explain why an issue matters.
- Suggest a concrete fix whenever possible.
- If the changes look good, explicitly say so.

## Output Format

Start with a one-line overall assessment.

Then use:

### ✅ Strengths
(omit if none)

### ⚠️ Suggestions
(non-blocking improvements)

### 🚨 Issues
(problems that should be fixed before merging)

For every issue:
- reference the file name
- quote or describe the relevant code
- explain the impact
- suggest a fix
`;

type ReviewInput = {
  repoFullName: string;
  title: string;
  files: PrFile[];
};

function formatFiles(files: PrFile[]) {
  return files
    .map(
      (file) => `
FILE: ${file.filePath}

\`\`\`diff
${file.patch}
\`\`\`
`
    )
    .join("\n\n");
}

export async function generateReview(input: ReviewInput) {
  const { text } = await generateText({
    model: openrouter(REVIEW_MODEL),
    system: SYSTEM_PROMPT,
    prompt: `
Repository: ${input.repoFullName}

Pull request title:
${input.title}

Changed files:

${formatFiles(input.files)}
`,
  });

  return text;
}