import { Router } from 'express'

import { TransactionsController } from '../controllers/transactions.controller'
import {
  createTransactionSchema,
  indexTransactionSchema,
} from '../dtos/transactions.dto'
import { TransactionFactory } from '../factories/transactions.factory'
import { ParamsType, validator } from '../middleware/validator.middleware'

export const transactionsRoutes = Router()

const controller = new TransactionsController(
  TransactionFactory.getServiceInstance(),
)

transactionsRoutes.get(
  '/',
  validator({
    schema: indexTransactionSchema,
    type: ParamsType.QUERY,
  }),

  controller.index,
)

transactionsRoutes.post(
  '/',
  validator({ schema: createTransactionSchema, type: ParamsType.BODY }),
  controller.create,
)
