export class InputMismatchException extends Error {
  constructor(readonly token: string) {
    super('java.util.InputMismatchException')
  }
}

export class ProcessKilled extends Error {}

const INT_PATTERN = /^[+-]?\d+$/
const DOUBLE_PATTERN = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)([eE][+-]?\d+)?$/
const INT_LIMIT = 2 ** 31

interface Pending {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

export interface ScannerHooks {
  onWaiting: (waiting: boolean) => void
}

export class Scanner {
  private tokens: string[] = []
  private pending: Pending | null = null
  private closed = false

  constructor(private readonly hooks: ScannerHooks) {}

  feed(line: string): void {
    this.tokens.push(...line.trim().split(/\s+/).filter(Boolean))
    this.flush()
  }

  async nextInt(): Promise<number> {
    const token = await this.next()
    const value = Number(token)
    if (!INT_PATTERN.test(token) || value < -INT_LIMIT || value >= INT_LIMIT) {
      throw new InputMismatchException(token)
    }
    return value
  }

  async nextDouble(): Promise<number> {
    const token = await this.next()
    if (!DOUBLE_PATTERN.test(token)) throw new InputMismatchException(token)
    return Number(token.replace(',', '.'))
  }

  close(): void {
    this.closed = true
    this.pending?.reject(new ProcessKilled())
    this.pending = null
  }

  private next(): Promise<string> {
    if (this.closed) return Promise.reject(new ProcessKilled())
    return new Promise((resolve, reject) => {
      this.pending = { resolve, reject }
      this.hooks.onWaiting(true)
      this.flush()
    })
  }

  private flush(): void {
    if (!this.pending || this.tokens.length === 0) return
    const token = this.tokens.shift() as string
    const pending = this.pending
    this.pending = null
    this.hooks.onWaiting(false)
    pending.resolve(token)
  }
}

export interface PrintStream {
  print: (text: string) => void
  println: (text?: string) => void
}
