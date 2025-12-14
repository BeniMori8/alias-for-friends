# Code Standards & Organization

## Component Structure

### Co-location of Files
- **Each component must have its TSX and CSS files in the same folder**
- Component folder name should match the component name (PascalCase)
- Structure:
  ```
  ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.css
  └── index.ts (optional barrel export)
  ```

### Component Hierarchy
- **Child components that are only used by a single parent should be nested inside the parent's folder**
- This creates a clear ownership and dependency structure
- Example:
  ```
  ParentComponent/
  ├── ParentComponent.tsx
  ├── ParentComponent.css
  └── ChildComponent/
      ├── ChildComponent.tsx
      └── ChildComponent.css
  ```
- **Shared components** used by multiple parents should live in a common location (e.g., `components/shared/` or `components/common/`)

## SOLID Principles

### Single Responsibility Principle (SRP)
- Each component should have one clear purpose
- If a component does multiple unrelated things, split it into separate components
- File and folder structure should reflect this - if you're tempted to name something "XAndY", it probably violates SRP

### Open/Closed Principle (OCP)
- Components should be open for extension but closed for modification
- Use composition over inheritance
- Leverage props, children, and render props to allow customization without changing component code

### Liskov Substitution Principle (LSP)
- Component variants should be substitutable for their base component
- Props interfaces should be properly typed and consistent
- Ensure child components don't break parent expectations

### Interface Segregation Principle (ISP)
- Don't force components to depend on props they don't use
- Keep prop interfaces focused and minimal
- Split large prop interfaces into smaller, focused ones

### Dependency Inversion Principle (DIP)
- Depend on abstractions (interfaces/types), not concrete implementations
- Use dependency injection via props
- Keep business logic separate from UI components

## Additional Best Practices

### TypeScript Standards
- **Use explicit types** for all component props
- Avoid `any` - use `unknown` if you truly don't know the type
- Define interfaces for complex data structures
- Use union types for component variants

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `GameBoard`)
- **Files**: Match component name exactly
- **CSS classes**: kebab-case, prefixed with component name to avoid conflicts (`game-board__cell`, `user-profile__avatar`)
- **Hooks**: camelCase with `use` prefix (`useGameState`, `useAuth`)
- **Utilities**: camelCase (`formatDate`, `calculateScore`)

### CSS Organization
- Use CSS Modules or scoped CSS to prevent style leakage
- Follow BEM-like naming: `component-name__element--modifier`
- Group related styles together (layout, typography, colors, animations)
- Keep CSS files focused on their component - no global styles in component CSS

### File Size & Complexity
- Keep components under ~150 lines; if larger, consider splitting
- Extract complex logic into custom hooks
- Move utility functions to separate files
- Extract constants to a constants file if reused

### Import Organization
- Group imports in this order:
  1. External libraries (React, third-party)
  2. Internal utilities and hooks
  3. Components
  4. Types/interfaces
  5. Styles (CSS imports last)
- Use absolute imports for better refactoring

### Testing & Documentation
- Each component folder can optionally include:
  - `ComponentName.test.tsx` for unit tests
  - `ComponentName.stories.tsx` for Storybook stories (if used)
  - JSDoc comments for complex components

### Performance Considerations
- Use `React.memo()` for expensive components that receive the same props frequently
- Memoize callbacks with `useCallback` when passing to child components
- Memoize expensive calculations with `useMemo`
- Code-split large components with `React.lazy()` when appropriate

### State Management
- Keep state as local as possible
- Lift state only when necessary
- Use composition to avoid prop drilling
- Consider context for deeply nested shared state

## Example Project Structure

```
src/
├── components/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx
│   │   ├── GameBoard.css
│   │   ├── GameCell/          # Only used by GameBoard
│   │   │   ├── GameCell.tsx
│   │   │   └── GameCell.css
│   │   └── GameToken/          # Only used by GameBoard
│   │       ├── GameToken.tsx
│   │       └── GameToken.css
│   ├── shared/
│   │   ├── Button/             # Used by multiple components
│   │   │   ├── Button.tsx
│   │   │   └── Button.css
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       └── Modal.css
│   └── ...
├── hooks/
│   └── useGameState.ts
├── utils/
│   └── calculations.ts
└── types/
    └── game.types.ts
```

## Enforcement

These standards should be followed for all new code. When refactoring existing code, gradually adopt these patterns. Code reviews should check for adherence to these principles.

## Consts
never use magic numbers or strings. Use consts instead. if the const is used in multiple places/ files, move it to a constants file.

## Jokes
for each resonse now, generate a short joke in the start of the response

---

# Benias Design System

## Primary Colors
| Name     | Hex       | Usage                          |
|----------|-----------|--------------------------------|
| Crimson  | `#c92a2a` | Primary background, titles     |
| Gold     | `#ffd700` | Buttons, accents, highlights   |
| Gold Light | `#ffed4e` | Gradient endpoints           |
| Cream    | `#fff9db` | Warm backgrounds (badges)      |

## Neutral Colors
| Name     | Hex       | Usage                          |
|----------|-----------|--------------------------------|
| Dark     | `#212529` | Text, dark buttons             |
| Gray     | `#495057` | Secondary text                 |
| Light Gray | `#868e96` | Dimmed text, labels          |

## Fonts
```css
/* Primary - headings, buttons, important text */
font-family: 'Fredoka', sans-serif;

/* Secondary - body text, labels */
font-family: 'Outfit', sans-serif;
```

## Button Styles (Gold Primary)
```css
.button-primary {
    font-family: 'Fredoka', sans-serif;
    font-weight: 700;
    padding: 1rem 2rem;
    border-radius: 50px;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #c92a2a;
    border: 4px solid white;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 0 6px rgba(255, 215, 0, 0.4);
}
```

## Overlay Pattern (NOT Mantine Modal)
```css
.overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

## Team Tokens
```css
.team-token {
    border-radius: 50%;
    background-color: var(--team-color);
    border: 3px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    opacity: 0.9;
}
```

## DO NOT
- ❌ Use Mantine Modal for overlays (causes visibility issues)
- ❌ Add new npm dependencies without approval
- ❌ Use fonts other than Fredoka/Outfit
