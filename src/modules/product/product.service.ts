import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Product from '@/entities/product.entity';
import ProductVariant from '@/entities/product_variant.entity';
import Feature from '@/entities/feature.entity';
import {
  CreateProductDto,
  CreateProductVariantDto,
  UpdateProductDto,
  UpdateProductFeatureDto,
  UpdateProductVariantDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Category from '@/entities/category.entity';
import { CreateProductFeatureDto } from './dto/create-product_feature.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  async createProductVariant(
    createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    const existingSKU = await this.productVariantRepository.findOne({
      where: { sku: createProductVariantDto.sku },
    });
    if (existingSKU) {
      throw new BadRequestException(
        `SKU ${createProductVariantDto.sku} is exsited`,
      );
    }
    const product = await this.productRepository.findOne({
      where: { id: createProductVariantDto.productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${createProductVariantDto.productId}" not found.`,
      );
    }
    const newProductVariant = this.productVariantRepository.create({
      ...createProductVariantDto,
      product: product,
    });
    await this.productVariantRepository.save(newProductVariant);
    return newProductVariant;
  }

  async createProductFeature(
    createProductFeatureDto: CreateProductFeatureDto,
  ): Promise<Feature> {
    const product = await this.productRepository.findOne({
      where: { id: createProductFeatureDto.productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with ID#${createProductFeatureDto.productId} not found`,
      );
    }
    const productFeature = this.featureRepository.create({
      ...createProductFeatureDto,
      product: product,
    });
    return await this.featureRepository.save(productFeature);
  }

  async updateFeatureById(
    id: number,
    updateProductFeatureDto: UpdateProductFeatureDto,
  ): Promise<Feature> {
    const feature = await this.featureRepository.findOne({
      where: { id },
    });
    if (!feature) {
      throw new NotFoundException(`Feature with ID#${id} not found`);
    }
    Object.entries(updateProductFeatureDto).forEach(([key, value]) => {
      feature[key] = value;
    });
    await this.featureRepository.save(feature);
    return this.featureRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const categoryExsiting = this.categoryRepository.findOne({
      where: { id: createProductDto.productCategoryId },
    });
    if (!categoryExsiting) {
      throw new NotFoundException(
        `category id #${createProductDto.productCategoryId} is not found`,
      );
    }
    const newProduct = this.productRepository.create({
      ...createProductDto,
      productVariants: undefined,
      features: undefined,
    });
    const product = await this.productRepository.save(newProduct);
    if (
      createProductDto.productVariants &&
      createProductDto.productVariants.length > 0
    ) {
      for (const variantDto of createProductDto.productVariants) {
        const { productId, ...variantDetails } = variantDto;
        const productVariantDto = {
          ...variantDetails,
          productId: product.id,
        };
        await this.createProductVariant(productVariantDto);
      }
    }
    if (createProductDto.features && createProductDto.features.length > 0) {
      for (const featureDto of createProductDto.features) {
        const { productId, ...featureDetails } = featureDto;
        const productFeatureDto = {
          ...featureDetails,
          productId: product.id,
        };
        await this.createProductFeature(productFeatureDto);
      }
    }
    const productResult = await this.productRepository.findOne({
      where: { id: product.id },
      relations: ['productVariants', 'features', 'category'],
    });

    return productResult;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['productVariants', 'category', 'features'],
    });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productVariants', 'category', 'features'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProductVariantById(
    id: number,
    updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    // load exsiting instant
    const productVariant = await this.productVariantRepository.findOne({
      where: { id },
    });
    if (!productVariant) {
      throw new NotFoundException(`Product Variant with ID "${id}" not found.`);
    }
    if (updateProductVariantDto.productId !== undefined) {
      const productExsiting = await this.productRepository.findOne({
        where: { id: updateProductVariantDto.productId },
      });
      if (!productExsiting) {
        throw new NotFoundException(
          `Product ID #${updateProductVariantDto.productId} not found.`,
        );
      }
    }
    // update only those fields that are passed in
    Object.entries(updateProductVariantDto).forEach(([key, value]) => {
      productVariant[key] = value;
    });
    // save updated instance
    await this.productVariantRepository.save(productVariant);
    return await this.productVariantRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
  }

  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // load exsiting instant
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    if (updateProductDto.productCategoryId !== undefined) {
      const categoryExsiting = await this.categoryRepository.findOne({
        where: { id: updateProductDto.productCategoryId },
      });
      if (!categoryExsiting) {
        throw new NotFoundException(
          `Category ID #${updateProductDto.productCategoryId} not found.`,
        );
      }
    }
    // update only those fields that are passed in
    Object.entries(updateProductDto).forEach(([key, value]) => {
      product[key] = value;
    });
    // save updated instance
    await this.productRepository.save(product);
    return await this.productRepository.findOne({
      where: { id: id },
      relations: ['productVariants', 'category', 'features'],
    });
  }

  async deleteVariantById(id: number): Promise<void> {
    const productVariantExsiting = await this.productVariantRepository.findOne({
      where: { id: id },
    });
    if (!productVariantExsiting) {
      throw new NotFoundException(`Product Variant with ID #${id} not found`);
    }
    await this.productVariantRepository.delete(id);
  }

  async deleteFeatureById(id: number): Promise<void> {
    const featureExsiting = await this.featureRepository.findOne({
      where: { id: id },
    });
    if (!featureExsiting) {
      throw new NotFoundException(`Feature with ID #${id} not found`);
    }
    await this.featureRepository.delete(id);
  }

  async deleteProductById(id: number): Promise<void> {
    const productExsiting = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!productExsiting) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productVariantRepository.delete({ product: { id: id } });
    await this.featureRepository.delete({ product: { id: id } });
    await this.productRepository.delete(id);
  }
}
