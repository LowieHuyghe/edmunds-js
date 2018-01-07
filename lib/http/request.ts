import { Request as ExpressRequest } from 'express'
import { Edmunds } from '../edmunds'

export interface Request extends ExpressRequest {
  edmunds: Edmunds
}
