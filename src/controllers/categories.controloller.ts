import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { CategoriesRepository } from '../database/repositories/categories.repository'
import { CategoryModel } from '../database/schemas/category.schema'
import { CreateCategoryDTO } from '../dtos/categories.dto'
import { CategoriesServices } from '../services/categories.services'

export class CategoriesController {
  async create(
    req: Request<unknown, unknown, CreateCategoryDTO>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { title, color } = req.body

      const repository = new CategoriesRepository(CategoryModel)
      const service = new CategoriesServices(repository)

      const result = await service.create({ title, color })

      return res.status(StatusCodes.CREATED).json(result)
    } catch (err) {
      next(err)
    }
  }
}
