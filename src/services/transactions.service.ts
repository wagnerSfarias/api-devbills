import { StatusCodes } from 'http-status-codes'

import { TransactionRepository } from '../database/repositories/transactions.repository'
import {
  CreateTransactionDTO,
  IndexTransactionsDTO,
} from '../dtos/transactions.dto'
import { AppError } from '../errors/app.error'
import { CategoriesRepository } from './../database/repositories/categories.repository'
import { Transaction } from './../entities/transactions.entity'

export class TransactionsService {
  constructor(
    private transactionsRepository: TransactionRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async create({
    title,
    type,
    date,
    categoryId,
    amount,
  }: CreateTransactionDTO): Promise<Transaction> {
    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      throw new AppError('Category does not exists.', StatusCodes.NOT_FOUND)
    }

    const transaction = new Transaction({
      title,
      type,
      date,
      category,
      amount,
    })

    const createdTransaction =
      await this.transactionsRepository.create(transaction)

    return createdTransaction
  }

  async index(filters: IndexTransactionsDTO): Promise<Transaction[]> {
    const transaction = await this.transactionsRepository.index(filters)

    return transaction
  }
}
