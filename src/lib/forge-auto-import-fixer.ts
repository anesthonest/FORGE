
/**
 * @fileOverview Forge OS Auto-Import Fixer
 * Analyzes code for missing React components, hooks, and icons, 
 * then automatically injects the required import statements.
 */

const UI_COMPONENTS: Record<string, string> = {
  Card: '@/components/ui/card',
  CardHeader: '@/components/ui/card',
  CardTitle: '@/components/ui/card',
  CardDescription: '@/components/ui/card',
  CardContent: '@/components/ui/card',
  CardFooter: '@/components/ui/card',
  Button: '@/components/ui/button',
  Badge: '@/components/ui/badge',
  Input: '@/components/ui/input',
  Label: '@/components/ui/label',
  Tabs: '@/components/ui/tabs',
  TabsList: '@/components/ui/tabs',
  TabsTrigger: '@/components/ui/tabs',
  TabsContent: '@/components/ui/tabs',
  Separator: '@/components/ui/separator',
  Progress: '@/components/ui/progress',
  Table: '@/components/ui/table',
  TableHeader: '@/components/ui/table',
  TableBody: '@/components/ui/table',
  TableHead: '@/components/ui/table',
  TableRow: '@/components/ui/table',
  TableCell: '@/components/ui/table',
  Avatar: '@/components/ui/avatar',
  AvatarImage: '@/components/ui/avatar',
  AvatarFallback: '@/components/ui/avatar',
  Dialog: '@/components/ui/dialog',
  DialogContent: '@/components/ui/dialog',
  DialogHeader: '@/components/ui/dialog',
  DialogTitle: '@/components/ui/dialog',
  DialogDescription: '@/components/ui/dialog',
  Textarea: '@/components/ui/textarea',
  Select: '@/components/ui/select',
  SelectGroup: '@/components/ui/select',
  SelectValue: '@/components/ui/select',
  SelectTrigger: '@/components/ui/select',
  SelectContent: '@/components/ui/select',
  SelectItem: '@/components/ui/select',
};

const REACT_HOOKS = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext'];

export interface ImportDiagnostic {
  path: string;
  type: 'alias' | 'relative' | 'module';
  isBroken: boolean;
  suggestion?: string;
}

export class ForgeAutoImportFixer {
  /**
   * Attempts to fix missing imports in a code block.
   */
  static fixImports(code: string): string {
    if (!code) return code;

    const usedComponents = this.detectJSXComponents(code);
    const usedHooks = this.detectHooks(code);
    const existingImports = this.parseExistingImports(code);

    const missingBySource: Record<string, Set<string>> = {};

    // 1. Resolve UI Components
    usedComponents.forEach(comp => {
      if (!existingImports.has(comp) && UI_COMPONENTS[comp]) {
        const source = UI_COMPONENTS[comp];
        if (!missingBySource[source]) missingBySource[source] = new Set();
        missingBySource[source].add(comp);
      }
    });

    // 2. Resolve React Hooks
    const missingHooks = usedHooks.filter(hook => !existingImports.has(hook) && REACT_HOOKS.includes(hook));
    if (missingHooks.length > 0) {
      if (!missingBySource['react']) missingBySource['react'] = new Set();
      missingHooks.forEach(h => missingBySource['react'].add(h));
    }

    // 3. Construct import strings
    const newImportLines = Object.entries(missingBySource).map(([source, members]) => {
      const items = Array.from(members).join(', ');
      return `import { ${items} } from "${source}";`;
    });

    if (newImportLines.length === 0) return code;

    // 4. Inject at the top (after "use client" if present)
    const lines = code.split('\n');
    let insertIndex = 0;
    if (lines[0]?.includes('use client')) insertIndex = 1;

    lines.splice(insertIndex, 0, ...newImportLines);
    return lines.join('\n');
  }

  private static detectJSXComponents(code: string): string[] {
    const matches = code.matchAll(/<([A-Z][a-zA-Z0-9]*)/g);
    return Array.from(new Set(Array.from(matches).map(m => m[1])));
  }

  private static detectHooks(code: string): string[] {
    const matches = code.matchAll(/(use[A-Z][a-zA-Z0-9]*)/g);
    return Array.from(new Set(Array.from(matches).map(m => m[1])));
  }

  private static parseExistingImports(code: string): Set<string> {
    const imported = new Set<string>();
    const matches = code.matchAll(/import\s+{([^}]+)}\s+from/g);
    for (const match of matches) {
      const members = match[1].split(',').map(m => m.trim());
      members.forEach(m => {
        // Handle "Component as Alias"
        const name = m.split(/\s+as\s+/)[0].trim();
        if (name) imported.add(name);
      });
    }
    return imported;
  }

  /**
   * Scans an import string and detects potential issues. (Legacy support)
   */
  static analyzeImport(importLine: string): ImportDiagnostic | null {
    const match = importLine.match(/from\s+['"](.+)['"]/);
    if (!match) return null;

    const path = match[1];
    const diagnostic: ImportDiagnostic = {
      path,
      type: path.startsWith('@/') ? 'alias' : path.startsWith('.') ? 'relative' : 'module',
      isBroken: false
    };

    if (path.includes('src/ai/core') && !path.startsWith('@/')) {
      diagnostic.isBroken = true;
      diagnostic.suggestion = path.replace(/.*src\/ai\/core/, '@/ai/core');
    }

    return diagnostic;
  }

  static scanCode(code: string): ImportDiagnostic[] {
    const lines = code.split('\n');
    const results: ImportDiagnostic[] = [];
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('import')) {
        const diag = this.analyzeImport(trimmed);
        if (diag) results.push(diag);
      }
    });
    return results;
  }
}
