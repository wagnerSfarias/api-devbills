import { Router } from 'express'

import { TransactionsController } from '../controllers/transactions.controller'
import {
  createTransactionSchema,
  indexTransactionSchema,
  getDashboardSchema,
  getFinancialEvolutionSchema,
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

transactionsRoutes.get(
  '/dashboard',
  validator({
    schema: getDashboardSchema,
    type: ParamsType.QUERY,
  }),
  controller.getDashboard,
)

transactionsRoutes.get(
  '/financial-evolution',
  validator({
    schema: getFinancialEvolutionSchema,
    type: ParamsType.QUERY,
  }),
  controller.getFinancialEvolution,
)
