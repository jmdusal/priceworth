import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import Category from '@/entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { isEqual, isNull } from 'lodash';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    //check if parent category id exsits
    if (!isNull(createCategoryDto.parentCategoryId)) {
      const parentCategoryExsiting = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentCategoryId },
      });
      if (!parentCategoryExsiting) {
        throw new NotFoundException(
          `parent category id #${createCategoryDto.parentCategoryId} is not exsited`,
        );
      }
    }
    //check if category name duplicate
    const CategoryNameDuplicate = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (CategoryNameDuplicate) {
      throw new BadRequestException(
        `category name "${createCategoryDto.name} have already exsited"`,
      );
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async list(): Promise<Category[]> {
    // 1. Load all categories from the database
    const allCategories = await this.categoryRepository.find({
      relations: ['parent', 'products'],
    });
    // 2. Build a map for quick access to categories by their ID
    const categoriesMap = new Map(
      allCategories.map((category) => [
        category.id,
        {
          ...category,
          children: [],
        },
      ]),
    );
    // 3. Build the tree structure in memory
    allCategories.forEach((category) => {
      if (category.parentCategoryId) {
        const parent = categoriesMap.get(category.parentCategoryId);
        parent.children.push(categoriesMap.get(category.id));
      }
    });
    // 4. Filter out top-level categories (those without a parent)
    const topLevelCategories = Array.from(categoriesMap.values()).filter(
      (category) => !category.parentCategoryId,
    );
    return topLevelCategories;
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children')
      .leftJoinAndSelect('category.products', 'product')
      .leftJoinAndSelect('product.productVariants', 'productVariant')
      .where('category.id = :id', { id: id })
      .getOne();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async listSubCategories(): Promise<Category[]> {
    const subCategories = await this.categoryRepository.find({
      where: { parentCategoryId: Not(IsNull()) },
    });
    return subCategories;
  }

  async updateById(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (isEqual(updateCategoryDto.parentCategoryId, id)) {
      throw new BadRequestException(
        `Category ID cannot be equal with its parent category id, id ${id}`,
      );
    }
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.entries(updateCategoryDto).forEach(([key, value]) => {
      category[key] = value;
    });

    await this.categoryRepository.save(category);
    // return await this.categoryRepository.findOne({
    //   where: { id: id },
    // });
    return {
      ...category,
      ...(await this.categoryRepository.findOne({ where: { id: id } }))
    };
  }

  async deleteById(id: number): Promise<void> {
    const categoryExsiting = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!categoryExsiting) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.delete(id);
  }
}
