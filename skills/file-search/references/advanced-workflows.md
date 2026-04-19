# File Search Advanced Workflows

Advanced patterns combining fd, ripgrep (rg).

## fd Advanced Patterns

### Execution Patterns

```bash
# Execute command on each result
fd -e py -x wc -l {}                    # Line count per file
fd -e ts -x prettier --write {}         # Format each file
fd -e json -x jq '.name' {}             # Extract JSON field
fd -e md -x bat {}                      # Preview each with bat

# Parallel execution
fd -e ts -x -j4 tsc --noEmit {}         # 4 parallel type checks

# Batch mode (all files at once)
fd -e ts -X prettier --write            # Single prettier call
fd -e py -X wc -l                       # Single wc call
```

### Pattern Matching

```bash
# Regex patterns
fd "^test_.*\.py$"                      # Files starting with test_
fd ".*\.(ts|tsx)$"                      # TypeScript files
fd "\d{4}-\d{2}-\d{2}"                  # Date in filename

# Glob patterns
fd -g "*.test.ts"                       # Glob mode
fd -g "config.{json,yaml,toml}"         # Multiple extensions

# Case sensitivity
fd -s "README"                          # Case-sensitive
fd -i "readme"                          # Case-insensitive (default)
```

### Time-based Filtering

```bash
# Modified within time range
fd --changed-within 1h                  # Last hour
fd --changed-within 1d                  # Last day
fd --changed-before 1w                  # Older than 1 week

# Combine with other filters
fd -e py --changed-within 1d            # Python files modified today
```

### Size Filtering

```bash
# Filter by size
fd --size +1m                           # Larger than 1MB
fd --size -100k                         # Smaller than 100KB
fd -e log --size +10m                   # Large log files

# Find empty files
fd --type f --size 0                    # Empty files
fd --type d --type empty                # Empty directories
```

## ripgrep Advanced Patterns

### Multiline Matching

```bash
# Match across lines
rg -U "class.*\n.*def __init__"         # Class with __init__
rg -U "import.*\n.*from"                # Consecutive imports

# Dotall mode (. matches newline)
rg -U "(?s)""".*?""""                   # Python docstrings
```

### Replacement Preview

```bash
# Preview replacements without applying
rg "old_function" -r "new_function"     # Shows what would change
rg "v1" -r "v2" -n                      # With line numbers

# Apply with sd
sd "old_function" "new_function" $(rg -l "old_function")
```

### Stats and Counts

```bash
# Statistics
rg --stats "TODO"                       # Match stats
rg -c "TODO"                            # Count per file
rg -c "TODO" | sort -t: -k2 -rn         # Sort by count

# File-level info
rg -l "pattern"                         # Files with matches
rg -L "pattern"                         # Files without matches
rg --files-without-match "pattern"      # Explicit no-match
```

### Context Control

```bash
# Show context
rg -C 3 "error"                         # 3 lines before/after
rg -B 5 "def main"                      # 5 lines before
rg -A 10 "BEGIN"                        # 10 lines after

# Context separator
rg -C 2 --context-separator="---" "fn"  # Custom separator
```

## Combined Workflows

### Project Analysis

```bash
# Find TODO/FIXME with stats
rg -c "TODO|FIXME" | sort -t: -k2 -rn | head -10

# Large files in project
fd -t f -x du -b {} | sort -rn | head -20 | \
  awk '{printf "%.2f MB %s\n", $1/1048576, $2}'

# Files by extension
fd -t f | sed 's/.*\.//' | sort | uniq -c | sort -rn

# Dead code detection (imports not used)
rg "^import (\w+)" -o -r '$1' | sort -u > imports.txt
for imp in $(cat imports.txt); do
  count=$(rg "\b$imp\b" | wc -l)
  if [ "$count" -lt 2 ]; then
    echo "Possibly unused: $imp"
  fi
done
```

## Performance Optimization

| Technique | Example | Speedup |
|-----------|---------|---------|
| Narrow path | `rg pattern src/` | 2-10x |
| Use types | `rg -t py pattern` | 1.5-3x |
| Fixed strings | `rg -F "[literal]"` | 1.2-2x |
| Limit depth | `fd -d 3 pattern` | Variable |
| Ignore more | `fd -E "*.log" -E "tmp/"` | Variable |
| Parallel | `fd -x -j8 command` | 2-8x |

## Tips

1. **Use `.ignore` files** - Create project-specific ignore rules
2. **Combine tools** - fd for finding, rg for searching
3. **Preview everything** - Use `--preview` to verify before acting
4. **Shell functions** - Create aliases for common workflows
