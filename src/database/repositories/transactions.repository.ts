import {
  GetDashboardDTO,
  IndexTransactionsDTO,
} from '../../dtos/transactions.dto'
import { Balance } from '../../entities/balance.entity'
import { Transaction } from '../../entities/transactions.entity'
import { TransactionModel } from '../schemas/transactions.schema'

export class TransactionRepository {
  constructor(private model: typeof TransactionModel) {}

  async create({
    title,
    date,
    amount,
    type,
    category,
  }: Transaction): Promise<Transaction> {
    const createdTransaction = await this.model.create({
      title,
      date,
      amount,
      type,
      category,
    })
    return createdTransaction.toObject<Transaction>()
  }

  async index({
    title,
    categoryId,
    beginDate,
    endDate,
  }: IndexTransactionsDTO): Promise<Transaction[]> {
    const whereParams: Record<string, unknown> = {
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(categoryId && { 'category._id': categoryId }),
    }

    if (beginDate || endDate) {
      whereParams.date = {
        ...(beginDate && { $gte: beginDate }),
        ...(endDate && { $lte: endDate }),
      }
    }

    const transaction = await this.model.find(whereParams, undefined, {
      sort: {
        date: -1,
      },
    })

    const transactionMap = transaction.map((item) =>
      item.toObject<Transaction>(),
    )

    return transactionMap
  }

  async getBalance({ beginDate, endDate }: GetDashboardDTO): Promise<Balance> {
    const aggregate = this.model.aggregate<Balance>()

    if (beginDate || endDate) {
      aggregate.match({
        date: {
          ...(beginDate && { $gte: beginDate }),
          ...(endDate && { $lte: endDate }),
        },
      })
    }

    const [result] = await aggregate
      .project({
        _id: 0,
        income: {
          $cond: [
            {
              $eq: ['$type', 'income'],
            },
            '$amount',
            0,
          ],
        },
        expense: {
          $cond: [
            {
              $eq: ['$type', 'expense'],
            },
            '$amount',
            0,
          ],
        },
      })
      .group({
        _id: null,
        income: { $sum: '$income' },
        expense: { $sum: '$expense' },
      })
      .addFields({
        balane: {
          $subtract: ['$income', '$expense'],
        },
      })
    return result
  }
}
