# Project coding standards

## TypeScript Guidelines
- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators

## React Guidelines
- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling

## Naming Conventions
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (_)
- Use ALL_CAPS for constants

## Error Handling
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information

## Code Style
- Strictly andhere to the eslint and prettier configurations in the project root

## Editing Behavior
- Never make changes, additions or edits unless explicitly asked to
- We make edits together step by step in smaller chunks
  - Never edit multiple files in one round
  - Work in steps, outside in. We start with an empty component, test or similar, halt for review, then step by step fill in the code halting for review between each step
  - The purpose is that the developer knows and understands the code and that we catch potential problems early.

### Initiating Edits and Suggestions
- **Assistant Proposes Suggestions:** The assistant will break down tasks into small, actionable steps. Each proposed step will be clearly labeled as a "suggestion". A suggestion describes a potential file edit or action.
- **User MUST Use "SS" to Trigger Edits:** File edits or actions described in suggestions MUST ONLY be performed when the user explicitly requests them by starting their prompt with "SS" followed by the instruction (e.g., "SS Apply the suggested change", "SS Define the interface"). Instructions like "SS proceed", "SS do it" and "SS go ahead" means that the assistant should perform the latest proposed suggestion.
- **No Edits Without "SS":** The assistant MUST NOT perform any file edits or tool actions unless instantiated by prompts that do start with "SS", including general affirmative responses like "proceed", "do it", "go ahead", etc. If the user provides such a response, the assistant should wait for an "SS" command or ask for clarification.
- **Assistant NEVER Uses "SS":** The assistant MUST NOT use the "SS" prefix in its responses.
- **Assistant NEVER Pushes the user:** The Assistant MUST NOT appear eager to proceed. If we are currently working on solving issues that are not a part of it's planned tasks, such as fixing tooling or editor settings the assistant MUST NOT suggest further steps or ask to proceed. The assistant MUST use neutral language like "Awaiting instructions..." and avoid eager phrasing like "Should I proceed" or "Let's continue"
- **Pause Suggestions During Meta-Tasks:** When the user is focused on refining instructions, addressing tooling/editor issues, or discussing the assistant's behavior, the assistant MUST NOT propose new suggestions related to the original coding task until the user explicitly signals readiness to resume (e.g., "Okay, back to the code", "SS proceed with the last coding suggestion"). During these pauses, respond neutrally (e.g., "Acknowledged.", "Okay, awaiting further instructions.").
- **No Change Comments** The assistant MUST NOT add code comments describing the changes it has made. Any comments should be meaningful outside the context of hte code session.
- **TODO-comments** Comments describing work to be done MUST be prefixed with "TODO: " so they can be highlighted by ESLint
