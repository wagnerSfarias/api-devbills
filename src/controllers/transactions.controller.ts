import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { CreateTransactionDTO } from '../dtos/transactions.dto'
import { TransactionsService } from '../services/transactions.service'

export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  create = async (
    req: Request<unknown, unknown, CreateTransactionDTO>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { title, date, amount, type, categoryId } = req.body

      const result = await this.transactionsService.create({
        title,
        date,
        amount,
        type,
        categoryId,
      })

      return res.status(StatusCodes.CREATED).json(result)
    } catch (err) {
      next(err)
    }
  }
}
