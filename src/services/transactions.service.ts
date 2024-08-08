import { StatusCodes } from 'http-status-codes'

import { TransactionRepository } from '../database/repositories/transactions.repository'
import {
  CreateTransactionDTO,
  IndexTransactionsDTO,
  GetDashboardDTO,
  GetFinancialEvolutionDTO,
} from '../dtos/transactions.dto'
import { Balance } from '../entities/balance.entity'
import { Expense } from '../entities/expense.entity'
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

  async getDashbord({
    beginDate,
    endDate,
  }: GetDashboardDTO): Promise<{ balance: Balance; expenses: Expense[] }> {
    let [balance, expenses] = await Promise.all([
      this.transactionsRepository.getBalance({
        beginDate,
        endDate,
      }),
      this.transactionsRepository.getExpenses({
        beginDate,
        endDate,
      }),
    ])

    if (!balance) {
      balance = new Balance({
        _id: null,
        incomes: 0,
        expenses: 0,
        balance: 0,
      })
    }
    return { balance, expenses }
  }

  async getFinancialEvolution({
    year,
  }: GetFinancialEvolutionDTO): Promise<Balance[]> {
    const financialEvolution =
      await this.transactionsRepository.getFinancialEvolution({ year })

    return financialEvolution
  }
}
