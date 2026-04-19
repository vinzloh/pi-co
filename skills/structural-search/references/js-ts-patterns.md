# JavaScript/TypeScript Patterns

Complete pattern library for ast-grep in JavaScript and TypeScript.

## Function Calls

```bash
# Find all console.log calls
ast-grep -p 'console.log($_)'

# Find all console methods
ast-grep -p 'console.$_($_)'

# Find fetch calls
ast-grep -p 'fetch($_)'

# Find await fetch
ast-grep -p 'await fetch($_)'

# Find specific function calls
ast-grep -p 'getUserById($_)'

# Find method chaining
ast-grep -p '$_.then($_).catch($_)'
```

## React Patterns

```bash
# Find useState hooks
ast-grep -p 'const [$_, $_] = useState($_)'

# Find useEffect with dependencies
ast-grep -p 'useEffect($_, [$$$])'

# Find useEffect without dependencies (runs every render)
ast-grep -p 'useEffect($_, [])'

# Find component definitions
ast-grep -p 'function $NAME($$$) { return <$$$> }'

# Find specific prop usage
ast-grep -p '<Button onClick={$_}>'

# Find useState without destructuring
ast-grep -p 'useState($_)'
```

## Imports

```bash
# Find all imports from a module
ast-grep -p 'import $_ from "react"'

# Find named imports
ast-grep -p 'import { $_ } from "lodash"'

# Find default and named imports
ast-grep -p 'import $_, { $$$ } from $_'

# Find dynamic imports
ast-grep -p 'import($_)'

# Find require calls
ast-grep -p 'require($_)'
```

## Async Patterns

```bash
# Find async functions
ast-grep -p 'async function $NAME($$$) { $$$ }'

# Find async arrow functions
ast-grep -p 'async ($$$) => { $$$ }'

# Find try-catch blocks
ast-grep -p 'try { $$$ } catch ($_) { $$$ }'

# Find Promise.all
ast-grep -p 'Promise.all([$$$])'

# Find unhandled promises (no await)
ast-grep -p '$_.then($_)'
```

## Error Prone Patterns

```bash
# Find == instead of ===
ast-grep -p '$_ == $_'

# Find assignments in conditions
ast-grep -p 'if ($_ = $_)'

# Find empty catch blocks
ast-grep -p 'catch ($_) {}'

# Find console.log (for cleanup)
ast-grep -p 'console.log($$$)'

# Find TODO comments
ast-grep -p '// TODO$$$'

# Find debugger statements
ast-grep -p 'debugger'
```

## Refactoring Patterns

### Find and Replace

```bash
# Preview replacement
ast-grep -p 'console.log($_)' -r 'logger.info($_)'

# Replace in place
ast-grep -p 'console.log($_)' -r 'logger.info($_)' --rewrite

# Replace with context
ast-grep -p 'var $NAME = $_' -r 'const $NAME = $_'
```

### Common Refactors

```bash
# Convert function to arrow
ast-grep -p 'function $NAME($ARGS) { return $BODY }' \
   -r 'const $NAME = ($ARGS) => $BODY'

# Convert require to import
ast-grep -p 'const $NAME = require("$MOD")' \
   -r 'import $NAME from "$MOD"'

# Add optional chaining
ast-grep -p '$OBJ.$PROP' -r '$OBJ?.$PROP'
```
