---
description: Check project standards before making changes
---

# Before Starting Any Task

Before writing or modifying code in this project, ALWAYS:

1. **Read the code standards file:**
   ```
   .agent/CODE_STANDARDS.md
   ```

2. **Remember the key design rules:**
   - **Colors:** Crimson `#c92a2a`, Gold `#ffd700`, Gold Light `#ffed4e`
   - **Fonts:** Fredoka (primary), Outfit (secondary)
   - **Buttons:** Gold gradient with white border, pill shape (50px radius)
   - **Overlays:** Use custom div overlays, NOT Mantine Modal
   - **RTL:** Hebrew text, right-to-left support

3. **Component structure:**
   - Each component in its own folder with `.tsx` + `.css`
   - No magic numbers - use constants
   - Co-locate child components with parents

4. **DO NOT:**
   - ❌ Use Mantine Modal (visibility issues)
   - ❌ Add npm dependencies without approval
   - ❌ Use fonts other than Fredoka/Outfit
   - ❌ Use colors outside the design system
