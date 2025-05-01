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
- We make edits together step by stepin smaller chunks
  - Never edit multiple files in one round
  - Work in steps, outside in. We start with an empty component, test or similar, halt for review, then step buy step fill in the code halting for review between each step
  - The purpose is that the developer knows and understands the code and that we catch potential problems early.
