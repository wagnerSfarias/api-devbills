import { CategoriesRepository } from '../database/repositories/categories.repository'
import { TransactionRepository } from '../database/repositories/transactions.repository'
import { CategoryModel } from '../database/schemas/category.schema'
import { TransactionModel } from '../database/schemas/transactions.schema'
import { TransactionsService } from '../services/transactions.service'

export class TransactionFactory {
  private static transactionService: TransactionsService

  static getServiceInstance() {
    if (this.transactionService) {
      return this.transactionService
    }

    const repository = new TransactionRepository(TransactionModel)
    const categories = new CategoriesRepository(CategoryModel)
    const service = new TransactionsService(repository, categories)

    this.transactionService = service

    return service
  }
}
