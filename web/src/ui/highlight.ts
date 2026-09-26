export type TokenKind = 'kw' | 'type' | 'str' | 'num' | 'com' | 'ann' | 'fn' | 'const' | 'punct' | 'plain' | 'head'

export interface Token {
  kind: TokenKind
  text: string
}

const JAVA_KEYWORDS = new Set(
  'abstract assert boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try var void volatile while record yield'.split(' '),
)

const JAVA_CONSTANTS = new Set(['true', 'false', 'null'])

const JAVA_PATTERN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?[dDfFlL]?\b)|([A-Za-z_$][\w$]*)|([^\sA-Za-z_$\d"'@/]+|\/)|([\s\S])/g

function javaIdentifier(word: string, source: string, end: number): TokenKind {
  if (JAVA_KEYWORDS.has(word)) return 'kw'
  if (JAVA_CONSTANTS.has(word)) return 'const'
  if (/^[A-Z][A-Z0-9_]+$/.test(word)) return 'const'
  if (/^[A-Z]/.test(word)) return 'type'
  if (/^\s*\(/.test(source.slice(end, end + 8))) return 'fn'
  return 'plain'
}

function tokenizeJava(source: string): Token[] {
  const tokens: Token[] = []
  for (const match of source.matchAll(JAVA_PATTERN)) {
    const [text, comment, string, annotation, number, word, punct] = match
    const end = (match.index ?? 0) + text.length
    if (comment) tokens.push({ kind: 'com', text })
    else if (string) tokens.push({ kind: 'str', text })
    else if (annotation) tokens.push({ kind: 'ann', text })
    else if (number) tokens.push({ kind: 'num', text })
    else if (word) tokens.push({ kind: javaIdentifier(word, source, end), text })
    else if (punct) tokens.push({ kind: 'punct', text })
    else tokens.push({ kind: 'plain', text })
  }
  return tokens
}

function tokenizeMarkdown(source: string): Token[] {
  return source.split(/(\n)/).flatMap((line): Token[] => {
    if (/^#{1,6}\s/.test(line)) return [{ kind: 'head', text: line }]
    if (/^```/.test(line)) return [{ kind: 'com', text: line }]
    return line.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part): Token => {
      if (part.startsWith('`')) return { kind: 'str', text: part }
      if (part.startsWith('**')) return { kind: 'type', text: part }
      return { kind: 'plain', text: part }
    })
  })
}

const XML_PATTERN = /(<!--[\s\S]*?-->)|(<\/?[\w.:-]+|\/?>|<\?|\?>)|("[^"]*")|([\w.:-]+(?==))|([\s\S])/g

function tokenizeXml(source: string): Token[] {
  const tokens: Token[] = []
  for (const [text, comment, tag, string, attr] of source.matchAll(XML_PATTERN)) {
    if (comment) tokens.push({ kind: 'com', text })
    else if (tag) tokens.push({ kind: 'kw', text })
    else if (string) tokens.push({ kind: 'str', text })
    else if (attr) tokens.push({ kind: 'type', text })
    else tokens.push({ kind: 'plain', text })
  }
  return tokens
}

const SHELL_PATTERN = /((?:^|(?<=\n))\s*(?:#|::|REM\b)[^\n]*)|("[^"\n]*"|'[^'\n]*')|(%[\w~]+%?|\$\{?\w+\}?)|\b(echo|cd|if|then|fi|for|do|done|else|exit|set|call|javac|java|mvn|mkdir|goto|not|exist|in)\b|([\s\S])/gi

function tokenizeShell(source: string): Token[] {
  const tokens: Token[] = []
  for (const [text, comment, string, variable, keyword] of source.matchAll(SHELL_PATTERN)) {
    if (comment) tokens.push({ kind: 'com', text })
    else if (string) tokens.push({ kind: 'str', text })
    else if (variable) tokens.push({ kind: 'ann', text })
    else if (keyword) tokens.push({ kind: 'kw', text })
    else tokens.push({ kind: 'plain', text })
  }
  return tokens
}

const TOKENIZERS: Record<string, (source: string) => Token[]> = {
  java: tokenizeJava,
  md: tokenizeMarkdown,
  xml: tokenizeXml,
  sh: tokenizeShell,
  bat: tokenizeShell,
}

export function tokenize(source: string, extension: string): Token[] {
  const tokenizer = TOKENIZERS[extension]
  return tokenizer ? tokenizer(source) : [{ kind: 'plain', text: source }]
}

export function splitLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]]
  for (const token of tokens) {
    const pieces = token.text.split('\n')
    pieces.forEach((piece, index) => {
      if (index > 0) lines.push([])
      if (piece) lines[lines.length - 1].push({ kind: token.kind, text: piece })
    })
  }
  return lines
}
