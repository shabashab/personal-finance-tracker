import { HttpException } from './http-exception'

export class BadRequestException<
  DetailsT = unknown,
> extends HttpException<DetailsT> {
  constructor(details?: DetailsT) {
    super(400, 'Bad request', details)
  }
}
