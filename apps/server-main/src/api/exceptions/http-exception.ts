const httpExceptionSymbol = Symbol.for('__http_exception__v1')

export class HttpException<DetailsT = unknown> extends Error {
  [httpExceptionSymbol] = true

  constructor(
    public readonly status: number,
    message?: string,
    public details?: DetailsT
  ) {
    super(message)
  }
}

export const isHttpException = (val: unknown): val is HttpException =>
  val instanceof Error && httpExceptionSymbol in val
