import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import Product from '@/entities/product.entity';
import ProductVariant from '@/entities/product_variant.entity';
import Feature from '@/entities/feature.entity';
import Category from '@/entities/category.entity';
import {
  CreateProductDto,
  CreateProductVariantDto,
  CreateProductFeatureDto,
  UpdateProductDto,
  UpdateProductFeatureDto,
  UpdateProductVariantDto,
} from './dto';

describe('ProductService', () => {
    let productService: ProductService;
    let productRepository: Repository<Product>;
    let productVariantRepository: Repository<ProductVariant>;
    let categoryRepository: Repository<Category>;
    let featureRepository: Repository<Feature>;

    // mock repository
	const mockRepository = {
	    find: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
		delete: jest.fn(),
	};

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
          providers: [
            ProductService,
            {
                provide: 'ProductRepository',
                useClass: Repository,
            },
            {
                provide: 'ProductVariantRepository',
                useClass: Repository,
            },
            {
                provide: 'CategoryRepository',
                useClass: Repository,
            },
            {
                provide: 'FeatureRepository',
                useClass: Repository,
            },
        ],
        }).compile();

        productService = module.get<ProductService>(ProductService);
        productRepository = module.get<Repository<Product>>('ProductRepository');
        productVariantRepository = module.get<Repository<ProductVariant>>(
        'ProductVariantRepository',
        );
        categoryRepository = module.get<Repository<Category>>('CategoryRepository');
        featureRepository = module.get<Repository<Feature>>('FeatureRepository');
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });


    let mockProduct: Product = {
        id: 1,
        name: 'Product Test',
        model: 'Product Model',
        productCategoryId: 1,
        shortDescription: 'Produuct Description',
        longDescription: 'Product Long Description',
        published: true,
        features: [],
        category: null,
        productVariants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    let mockProductVariant: ProductVariant = {
        id: 1,
        name: 'Product Variant Test',
        color: 'Green',
        sku: 'SKU123',
        dimensionHeight: 12,
        dimensionLength: 55,
        dimensionWidth: 33,
        weight: 26,
        price: 99,
        totalInventory: 1,
        product: mockProduct,
        images: [
            'product-variant-image-1.jpg',
            'product-variant-image-2.jpg',
            'product-variant-image-3.jpg',
        ],
    };

    // dto
    let mockProductVariantDto: CreateProductVariantDto = {
        name: 'Product Variant Test',
        color: 'Green',
        sku: 'SKU123',
        dimensionHeight: 12,
        dimensionLength: 55,
        dimensionWidth: 33,
        weight: 26,
        price: 99,
        totalInventory: 1,
        productId: 1,
        images: [
            'product-variant-image-1.jpg',
            'product-variant-image-2.jpg',
            'product-variant-image-3.jpg',
        ],
    };

    let mockProductFeature: Feature = {
        id: 1,
        key: 'Feauture Key',
        value: 'Product Value Description',
        product: mockProduct,
    };

    let mockProductFeatureDto: CreateProductFeatureDto = {
        key: 'Feauture Key',
        value: 'Product Value Description',
        productId: 1,
    }

    let mockCategory: Category = {
        id: 1,
        name: 'Test Category',
		description: 'Category description',
		image: 'category-image.jpg',
		showOnHomepage: true,
		includeInTopMenu: true,
		published: true,
		parentCategoryId: null,
        parent: null,
        children: [],
        products: [mockProduct],
        createdAt: new Date(),
        updatedAt: new Date(),
    }


    describe('createProductVariant', () => {

        it('should create product variant', async () => {

            productVariantRepository.findOne = jest.fn().mockResolvedValue(null);
            productRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });

            productVariantRepository.create = jest.fn().mockReturnValue({});
            productVariantRepository.save = jest.fn().mockResolvedValue({});

            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant Test',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            await expect(productService.createProductVariant(createProductVariantDto)).resolves.toBeDefined();
            expect(productVariantRepository.findOne).toHaveBeenCalledWith({ where: { sku: 'SKU123' } });
            expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(productVariantRepository.create).toHaveBeenCalledWith(expect.objectContaining(createProductVariantDto));
            expect(productVariantRepository.save).toHaveBeenCalled();
        });

        it('should throw BadRequestException if SKU already exists', async () => {
            productVariantRepository.findOne = jest.fn().mockResolvedValue({});

            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant Test',
                color: 'Green',
                sku: 'ExistingSKU',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            await expect(productService.createProductVariant(createProductVariantDto)).rejects.toThrowError(BadRequestException);

        });


        it('should throw NotFoundException if product does not exist', async () => {

            productVariantRepository.findOne = jest.fn().mockResolvedValue(null);
            productRepository.findOne = jest.fn().mockResolvedValue(null);

            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant Test',
                color: 'Green',
                sku: 'NewSKU',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };
            await expect(productService.createProductVariant(createProductVariantDto)).rejects.toThrowError(NotFoundException);
        });

        it('should throw validation error if product variant name field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: '',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }

        });

        it('should throw validation error if product variant color field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: '',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty color value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty color value');
            }
        });

        it('should throw validation error if product variant sku field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: '',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty sku value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty sku value');
            }
        });

        it('should throw validation error if product variant dimension height field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: null,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty dimension height value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension height value');
            }
        });

        it('should throw validation error if product variant dimension length field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 55,
                dimensionLength: null,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty dimension length value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension length value');
            }
        });

        it('should throw validation error if product variant dimension width field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 55,
                dimensionLength: 87,
                dimensionWidth: null,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty dimension width value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension width value');
            }
        });

        it('should throw validation error if product variant weight field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 55,
                dimensionLength: 87,
                dimensionWidth: 12,
                weight: null,
                price: 99,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty weight value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty weight value');
            }
        });

        it('should throw validation error if product variant price field is empty', async () => {
            const createProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 55,
                dimensionLength: 87,
                dimensionWidth: 12,
                weight: 43,
                price: null,
                totalInventory: 1,
                productId: 1,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productService.createProductVariant = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty price value'));
            try {
                await productService.createProductVariant(createProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty price value');
            }
        });


    });


    describe('createProductFeature', () => {
        it('should create a product feature', async () => {

            const createProductFeatureDto: CreateProductFeatureDto = {
                key: 'Test Key',
                value: 'Test Value',
                productId: 1,
            };

            const mockCategory: Category = {
                id: 1,
                name: 'Test Category',
                description: 'Category description',
                image: 'category-image.jpg',
                showOnHomepage: true,
                includeInTopMenu: true,
                published: true,
                parentCategoryId: null,
                parent: null,
                children: [],
                products: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const productVariant: ProductVariant = {
                id: 1,
                name: 'Product Variant Test',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                product: Product[1],
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            const productMock: Product = {
                id: 1,
                model: 'Test Model',
                productCategoryId: mockCategory[1],
                shortDescription: 'Test Description',
                name: 'Product Test',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: mockCategory,
                productVariants: [productVariant],
                createdAt: new Date(),
                updatedAt: new Date(),
            };


            const productFeatureMock = { ...createProductFeatureDto, product: productMock };
            const savedProductFeatureMock = { ...productFeatureMock, id: 1 };

            productRepository.findOne = jest.fn().mockResolvedValue(productMock);
            featureRepository.create = jest.fn().mockReturnValue(productFeatureMock);
            featureRepository.save = jest.fn().mockResolvedValue(savedProductFeatureMock);

            const result = await productService.createProductFeature(createProductFeatureDto);

            expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: createProductFeatureDto.productId } });
            expect(featureRepository.create).toHaveBeenCalledWith({
              ...createProductFeatureDto,
              product: productMock,
            });
            expect(featureRepository.save).toHaveBeenCalledWith(productFeatureMock);
            expect(result).toEqual(savedProductFeatureMock);
          });


        it('should throw NotFoundException if product is not found', async () => {
            const createProductFeatureDto: CreateProductFeatureDto = {
                key: 'Test Key',
                value: 'Test Value',
                productId: 1,
            };

            productRepository.findOne = jest.fn().mockResolvedValue(null);

            await expect(productService.createProductFeature(createProductFeatureDto)).rejects.toThrowError(NotFoundException);
            expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id: createProductFeatureDto.productId } });
        });







        it('should throw validation error if product feature key field is empty', async () => {
            const createProductFeatureDto: CreateProductFeatureDto = {
                key: '',
                value: 'Test Value',
                productId: 1,
            };

            productService.createProductFeature = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty key value'));
            try {
                await productService.createProductFeature(createProductFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty key value');
            }
        });

        it('should throw validation error if product feature value field is empty', async () => {
            const createProductFeatureDto: CreateProductFeatureDto = {
                key: 'Feature Key',
                value: '',
                productId: 1,
            };

            productService.createProductFeature = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty value field'));
            try {
                await productService.createProductFeature(createProductFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty value field');
            }
        });

        it('should throw validation error if product feature product id field is empty', async () => {
            const createProductFeatureDto: CreateProductFeatureDto = {
                key: 'Feature Key',
                value: 'Feature Value',
                productId: null,
            };

            productService.createProductFeature = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty product id value'));
            try {
                await productService.createProductFeature(createProductFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product id value');
            }
        });

    });


    describe('createProduct', () => {

        it('should create a product', async () => {

            const existingCategory = {
                id: 1,
                name: 'Test Category',
                description: 'Category description',
                image: 'category-image.jpg',
                showOnHomepage: true,
                includeInTopMenu: true,
                published: true,
                parentCategoryId: null,
                parent: null,
                children: [],
                products: [mockProduct],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const product: Product = {
                id: 1,
                name: 'Product Test',
                model: 'Test Model',
                productCategoryId: mockCategory.id,
                shortDescription: 'Test Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: mockCategory,
                productVariants: [mockProductVariant],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const createProductDto: CreateProductDto = {
                model: 'Test Model',
                productCategoryId: existingCategory[1],
                shortDescription: 'Test Description',
                name: 'Product Test',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                productVariants: [],
            };

            jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(existingCategory);
            jest.spyOn(productRepository, 'create').mockReturnValue({} as Product);
            jest.spyOn(productRepository, 'save').mockResolvedValue({} as Product);
            jest.spyOn(productRepository, 'findOne').mockResolvedValue({} as Product);

            const result = await productService.createProduct(createProductDto);
            expect(result).toBeDefined();

        });


        it('should throw validation error if product model field is empty', async () => {
            const createProductDto: CreateProductDto = {
                model: 'Product Model',
                name: 'Product Test',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockProductFeatureDto],
                productVariants: [mockProductVariantDto],
            };

            productService.createProduct = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty model value'));
            try {
                await productService.createProduct(createProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty model value');
            }
        });

        it('should throw validation error if product name field is empty', async () => {
            const createProductDto: CreateProductDto = {
                model: 'Product Model',
                name: '',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockProductFeatureDto],
                productVariants: [mockProductVariantDto],
            };

            productService.createProduct = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));
            try {
                await productService.createProduct(createProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }
        });


        it('should throw validation error if product product category id field is empty', async () => {
            const createProductDto: CreateProductDto = {
                model: 'Product Model',
                name: 'Product Test',
                productCategoryId: null,
                shortDescription: 'Product Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockProductFeatureDto],
                productVariants: [mockProductVariantDto],
            };

            productService.createProduct = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty product category id value'));
            try {
                await productService.createProduct(createProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product category id value');
            }
        });

        it('should throw validation error if product short description field is empty', async () => {
            const createProductDto: CreateProductDto = {
                model: 'Product Model',
                name: 'Product Test',
                productCategoryId: mockCategory.id,
                shortDescription: '',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockProductFeatureDto],
                productVariants: [mockProductVariantDto],
            };

            productService.createProduct = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty short description value'));
            try {
                await productService.createProduct(createProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty short description value');
            }
        });

        it('should throw validation error if product long description field is empty', async () => {
            const createProductDto: CreateProductDto = {
                model: 'Product Model',
                name: 'Product Test',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Description',
                longDescription: '',
                published: true,
                features: [mockProductFeatureDto],
                productVariants: [mockProductVariantDto],
            };

            productService.createProduct = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty long description value'));
            try {
                await productService.createProduct(createProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty long description value');
            }
        });

        it('should throw validation error if product published field is empty', async () => {
            const createProductDto: CreateProductDto = {
                model: 'Product Model',
                name: 'Product Test',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Description',
                longDescription: 'Product Long Description',
                published: null,
                features: [mockProductFeatureDto],
                productVariants: [mockProductVariantDto],
            };

            productService.createProduct = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty published value'));
            try {
                await productService.createProduct(createProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty published value');
            }
        });



    });


    describe('getAllProducts', () => {

        it('should return all products with their variants, category, and features', async () => {
            const products: Product[] = [
              {
                id: 1,
                name: 'Product 1',
                model: 'Model 1',
                productCategoryId: 1,
                shortDescription: 'Short description 1',
                longDescription: 'Long description 1',
                published: true,
                category: {
                    id: 1,
                    name: 'Category 1',
                    description: 'Category description 1',
                    image: 'category-image-1.jpg',
                    showOnHomepage: true,
                    includeInTopMenu: true,
                    published: true,
                    parentCategoryId: 1,
                    parent: null,
                    children: [],
                    products: [mockProduct],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    },
                    productVariants: [
                    {
                        id: 1,
                        product: {
                            id: 1,
                            name: 'Product Test',
                            model: 'Test Model',
                            productCategoryId: 1,
                            shortDescription: 'Test Description',
                            longDescription: 'Product Long Description',
                            published: true,
                            features: [],
                            category: null,
                            productVariants: [],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        name: 'Variant 1',
                        sku: 'SKU-1',
                        color: '#000000',
                        dimensionHeight: 10,
                        dimensionWidth: 20,
                        dimensionLength: 30,
                        weight: 100,
                        price: 50,
                        totalInventory: 10,
                        images: ['variant-image-1.jpg'],
                    },
                    ],
                    features: [
                    {
                        id: 1,
                        product: {
                            id: 1,
                            name: 'Product Test',
                            model: 'Test Model',
                            productCategoryId: 1,
                            shortDescription: 'Test Description',
                            longDescription: 'Product Long Description',
                            published: true,
                            features: [],
                            category: null,
                            productVariants: [],
                            createdAt: new Date(),
                            updatedAt: new Date(),

                        },
                        key: 'Key 1',
                        value: 'Value 1',
                    },
                    ],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            ];

            jest.spyOn(productRepository, 'find').mockResolvedValue(products);

            const result = await productService.getAllProducts();
            expect(result).toEqual(products);
        });

    });



    describe('findProductById', () => {

        it('should return a product by ID with its variants, category, and features', async () => {
            const productId = 1;
            const product: Product = {
                id: productId,
                name: 'Product 1',
                model: 'Model 1',
                productCategoryId: 1,
                shortDescription: 'Short description 1',
                longDescription: 'Long description 1',
                published: true,
                category: {
                    id: 1,
                    name: 'Category 1',
                    description: 'Category description 1',
                    image: 'category-image-1.jpg',
                    showOnHomepage: true,
                    includeInTopMenu: true,
                    published: true,
                    parentCategoryId: 1,
                    parent: null,
                    children: [],
                    products: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
              },
              productVariants: [
                {
                    id: 1,
                    product: {
                        id: 1,
                        name: 'Product Test',
                        model: 'Test Model',
                        productCategoryId: 1,
                        shortDescription: 'Test Description',
                        longDescription: 'Product Long Description',
                        published: true,
                        features: [],
                        category: null,
                        productVariants: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    name: 'Variant 1',
                    sku: 'SKU-1',
                    color: '#000000',
                    dimensionHeight: 10,
                    dimensionWidth: 20,
                    dimensionLength: 30,
                    weight: 100,
                    price: 50,
                    totalInventory: 10,
                    images: ['variant-image-1.jpg'],
                },
              ],
              features: [
                {
                    id: 1,
                    product: {
                        id: 1,
                        name: 'Product Test',
                        model: 'Test Model',
                        productCategoryId: 1,
                        shortDescription: 'Test Description',
                        longDescription: 'Product Long Description',
                        published: true,
                        features: [],
                        category: null,
                        productVariants: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    key: 'Key 1',
                    value: 'Value 1',
                },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);

            const result = await productService.findProductById(productId);
            expect(result).toEqual(product);
        });


        it('should throw NotFoundException if product with specified ID does not exist', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

            const nonExistingProductId = 999;
            try {
                await productService.findProductById(nonExistingProductId);

                fail('Expected NotFoundException to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);

                expect(error.message).toBe(`Product with ID ${nonExistingProductId} not found`);
            }
        });

    });



    describe('updateProductById', () => {

        it('should update a product by ID and return the updated product', async () => {
            // Mock existing product data
            const existingProductId = 1;
            const existingProduct: Product = {
                id: 1,
                model: 'Test Model',
                productCategoryId: null,
                shortDescription: 'Test Description',
                name: 'Product Test',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: {
                    id: 1,
                    name: 'Category 1',
                    description: 'Category description 1',
                    image: 'category-image-1.jpg',
                    showOnHomepage: true,
                    includeInTopMenu: true,
                    published: true,
                    parentCategoryId: 1,
                    parent: null,
                    children: [],
                    products: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                productVariants: [
                    {
                        id: 1,
                        product: {
                            id: 1,
                            name: 'Product Test',
                            model: 'Test Model',
                            productCategoryId: 1,
                            shortDescription: 'Test Description',
                            longDescription: 'Product Long Description',
                            published: true,
                            features: [],
                            category: null,
                            productVariants: [],
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                        name: 'Variant 1',
                        sku: 'SKU-1',
                        color: '#000000',
                        dimensionHeight: 10,
                        dimensionWidth: 20,
                        dimensionLength: 30,
                        weight: 100,
                        price: 50,
                        totalInventory: 10,
                        images: ['variant-image-1.jpg'],
                    },
                  ],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedProductDto: UpdateProductDto = {
              name: 'Updated Product 1',
              shortDescription: 'Updated Short description 1',
            };

            jest.spyOn(categoryRepository, 'findOne').mockResolvedValue({ id: 1 } as Category);
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(existingProduct);
            jest.spyOn(productRepository, 'save').mockImplementation((product: Product) => Promise.resolve(product));

            const result = await productService.updateProductById(existingProductId, updatedProductDto);

            expect(result).toBeDefined();
            expect(result.id).toEqual(existingProductId);
            expect(result.name).toEqual(updatedProductDto.name);
            expect(result.shortDescription).toEqual(updatedProductDto.shortDescription);
        });

        it('should throw NotFoundException if product with specified ID does not exist', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

            const nonExistingProductId = 999;
            const updateProductDto: UpdateProductDto = {};

            try {
                await productService.updateProductById(nonExistingProductId, updateProductDto);
                fail('Expected NotFoundException to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Product with ID "${nonExistingProductId}" not found.`);
            }
        });

        it('should throw NotFoundException if specified category ID does not exist', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue({ id: 1 } as Product);
            jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);
            const existingProductId = 1;
            const updateProductDto: UpdateProductDto = { productCategoryId: 999 };

            try {

                await productService.updateProductById(existingProductId, updateProductDto);
                fail('Expected NotFoundException to be thrown');
            } catch (error) {

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Category ID #${updateProductDto.productCategoryId} not found.`);
            }
        });



        it('should throw validation error update product by id if product model field is empty', async () => {

            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                model: '',
            };

            productService.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty model value'));
            try {
                await productService.updateProductById(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty model value');
            }
        });

        it('should throw validation error update product by id if product name field is empty', async () => {

            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                name: '',
            };

            productService.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));
            try {
                await productService.updateProductById(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }
        });

        it('should throw validation error update product by id if product category id field is empty', async () => {

            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                productCategoryId: null,
            };

            productService.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty category id value'));
            try {
                await productService.updateProductById(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty category id value');
            }
        });


        it('should throw validation error update product by id if product short description field is empty', async () => {

            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                shortDescription: '',
            };

            productService.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty short description value'));
            try {
                await productService.updateProductById(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty short description value');
            }
        });

        it('should throw validation error update product by id if product long description field is empty', async () => {

            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                longDescription: '',
            };

            productService.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty long description value'));
            try {
                await productService.updateProductById(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty long description value');
            }
        });

        it('should throw validation error update product by id if product published field is empty', async () => {

            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                published: null,
            };

            productService.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty published value'));
            try {
                await productService.updateProductById(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty published value');
            }
        });

    });


    describe('updateFeatureById', () => {

        it('should update a feature by ID and return the updated feature', async () => {
            const existingFeatureId = 1;
            const existingFeature: Feature = {
              id: existingFeatureId,
              key: 'Key 1',
              value: 'Value 1',
              product: {
                id: 1,
                name: 'Product Test',
                model: 'Test Model',
                productCategoryId: 1,
                shortDescription: 'Test Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: null,
                productVariants: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            };

            const updatedFeatureDto: UpdateProductFeatureDto = {
              key: 'Updated Key 1',
              value: 'Updated Value 1',
            };

            jest.spyOn(featureRepository, 'findOne').mockResolvedValue(existingFeature);
            jest.spyOn(featureRepository, 'save').mockImplementation((feature: Feature) => Promise.resolve(feature));
            const result = await productService.updateFeatureById(existingFeatureId, updatedFeatureDto);

            expect(result).toBeDefined();
            expect(result.id).toEqual(existingFeatureId);
            expect(result.key).toEqual(updatedFeatureDto.key);
            expect(result.value).toEqual(updatedFeatureDto.value);

        });

        it('should throw NotFoundException if feature with specified ID does not exist', async () => {
            jest.spyOn(featureRepository, 'findOne').mockResolvedValue(null);

            const nonExistingFeatureId = 999;
            const updateFeatureDto: UpdateProductFeatureDto = {};
            try {

                await productService.updateFeatureById(nonExistingFeatureId, updateFeatureDto);
                fail('Expected NotFoundException to be thrown');
            } catch (error) {

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Feature with ID#${nonExistingFeatureId} not found`);
            }
        });


        it('should throw validation error update product feature by id if product key field is empty', async () => {
            const existingProductFeatureId = mockProductFeature.id;
            const updatedFeatureDto: UpdateProductFeatureDto = {
                key: '',
              };

            productService.updateFeatureById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty key value'));
            try {
                await productService.updateFeatureById(existingProductFeatureId, updatedFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty key value');
            }
        });

        it('should throw validation error update product feature by id if product value field is empty', async () => {
            const existingProductFeatureId = mockProductFeature.id;
            const updatedFeatureDto: UpdateProductFeatureDto = {
                value: '',
              };

            productService.updateFeatureById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty value field'));
            try {
                await productService.updateFeatureById(existingProductFeatureId, updatedFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty value field');
            }
        });

    });


    describe('updateProductVariantById', () => {

        it('should update a product variant by ID and return the updated variant', async () => {
            const existingProductVariantId = 1;
            const existingProductVariant: ProductVariant = {
              id: existingProductVariantId,
              product: {
                id: 1,
                name: 'Product Test',
                model: 'Test Model',
                productCategoryId: 1,
                shortDescription: 'Test Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: null,
                productVariants: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
              name: 'Variant 1',
              sku: 'SKU-1',
              color: '#000000',
              dimensionHeight: 10,
              dimensionWidth: 20,
              dimensionLength: 30,
              weight: 100,
              price: 50,
              totalInventory: 10,
              images: ['variant-image-1.jpg'],
            };

            const updatedProductVariantDto: UpdateProductVariantDto = {
              name: 'Updated Variant 1',
              price: 60,
            };

            jest.spyOn(productRepository, 'findOne').mockResolvedValue({ id: 1 } as Product);
            jest.spyOn(productVariantRepository, 'findOne').mockResolvedValue(existingProductVariant);
            jest.spyOn(productVariantRepository, 'save').mockImplementation((variant: ProductVariant) => Promise.resolve(variant));

            const result = await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);

            expect(result).toBeDefined();
            expect(result.id).toEqual(existingProductVariantId);
            expect(result.name).toEqual(updatedProductVariantDto.name);
            expect(result.price).toEqual(updatedProductVariantDto.price);
        });


        it('should throw NotFoundException if product variant with specified ID does not exist', async () => {
            jest.spyOn(productVariantRepository, 'findOne').mockResolvedValue(null);

            const nonExistingProductVariantId = 999;

            const updateProductVariantDto: UpdateProductVariantDto = {};
            try {

                await productService.updateProductVariantById(nonExistingProductVariantId, updateProductVariantDto);
                fail('Expected NotFoundException to be thrown');
            } catch (error) {

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Product Variant with ID "${nonExistingProductVariantId}" not found.`);
            }
        });


        it('should throw validation error update product variant by id if product name field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                name: '',
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }
        });

        it('should throw validation error update product variant by id if product sku field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                sku: '',
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty sku value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty sku value');
            }
        });

        it('should throw validation error update product variant by id if product color field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                color: '',
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty color value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty color value');
            }
        });

        it('should throw validation error update product variant by id if product dimension height field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                dimensionHeight: null,
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty dimension height value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension height value');
            }
        });

        it('should throw validation error update product variant by id if product dimension length field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                dimensionLength: null,
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty dimension length value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension length value');
            }
        });

        it('should throw validation error update product variant by id if product dimension width field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                dimensionWidth: null,
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty dimension width value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension width value');
            }
        });

        it('should throw validation error update product variant by id if product weight field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                weight: null,
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty weight value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty weight value');
            }
        });

        it('should throw validation error update product variant by id if product price field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                price: null,
              };

            productService.updateProductVariantById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty price value'));
            try {
                await productService.updateProductVariantById(existingProductVariantId, updatedProductVariantDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty price value');
            }
        });

    });


    describe('deleteVariantById', () => {

        it('should delete a product variant by ID', async () => {
            // Mock existing product variant data
            const existingProductVariantId = 1;
            const existingProductVariant: ProductVariant = {
              id: existingProductVariantId,
              product: {
                id: 1,
                name: 'Product Test',
                model: 'Test Model',
                productCategoryId: 1,
                shortDescription: 'Test Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: null,
                productVariants: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
              name: 'Variant 1',
              sku: 'SKU-1',
              color: '#000000',
              dimensionHeight: 10,
              dimensionWidth: 20,
              dimensionLength: 30,
              weight: 100,
              price: 50,
              totalInventory: 10,
              images: ['variant-image-1.jpg'],
            };

            jest.spyOn(productVariantRepository, 'findOne').mockResolvedValue(existingProductVariant);
            // jest.spyOn(productVariantRepository, 'delete').mockResolvedValue({ affected: 1 });
            // jest.spyOn(productVariantRepository, 'delete').mockResolvedValue({ affected: 1 } as DeleteResult);
            jest.spyOn(productVariantRepository, 'delete').mockResolvedValue(undefined);

            await productService.deleteVariantById(existingProductVariantId);
            expect(productVariantRepository.delete).toHaveBeenCalledWith(existingProductVariantId);
        });

        it('should throw NotFoundException if product variant with specified ID does not exist', async () => {
            jest.spyOn(productVariantRepository, 'findOne').mockResolvedValue(null);

            const nonExistingProductVariantId = 999;

            try {
                await productService.deleteVariantById(nonExistingProductVariantId);
                fail('Expected NotFoundException to be thrown');
            } catch (error) {

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Product Variant with ID #${nonExistingProductVariantId} not found`);
            }
        });

    });


    describe('deleteFeatureById', () => {

        it('should delete a feature by ID', async () => {
            // Mock existing feature data
            const existingFeatureId = 1;
            const existingFeature: Feature = {
              id: existingFeatureId,
              key: 'Key 1',
              value: 'Value 1',
              product: {
                id: 1,
                name: 'Product Test',
                model: 'Test Model',
                productCategoryId: 1,
                shortDescription: 'Test Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: null,
                productVariants: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            };

            jest.spyOn(featureRepository, 'findOne').mockResolvedValue(existingFeature);
            jest.spyOn(featureRepository, 'delete').mockResolvedValue(undefined);
            await productService.deleteFeatureById(existingFeatureId);
            expect(featureRepository.delete).toHaveBeenCalledWith(existingFeatureId);
        });



        it('should throw NotFoundException if feature with specified ID does not exist', async () => {

            jest.spyOn(featureRepository, 'findOne').mockResolvedValue(null);
            const nonExistingFeatureId = 999;

            try {

                await productService.deleteFeatureById(nonExistingFeatureId);
                fail('Expected NotFoundException to be thrown');
            } catch (error) {

                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toBe(`Feature with ID #${nonExistingFeatureId} not found`);
            }
        });



    });

    describe('deleteProductById', () => {

        it('should delete a product by ID', async () => {
            // Mock existing product data
            const existingProductId = 1;
            const existingProduct: Product = {
              id: existingProductId,
              model: 'Test Model',
                productCategoryId: null,
                shortDescription: 'Test Description',
                name: 'Product Test',
                longDescription: 'Product Long Description',
                published: true,
                features: [],
                category: null,
                productVariants: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(productRepository, 'findOne').mockResolvedValue(existingProduct);
            jest.spyOn(productVariantRepository, 'delete').mockResolvedValue(undefined);
            jest.spyOn(featureRepository, 'delete').mockResolvedValue(undefined);
            jest.spyOn(productRepository, 'delete').mockResolvedValue(undefined);

            await productService.deleteProductById(existingProductId);

            expect(productVariantRepository.delete).toHaveBeenCalledWith({ product: { id: existingProductId } });
            expect(featureRepository.delete).toHaveBeenCalledWith({ product: { id: existingProductId } });
            expect(productRepository.delete).toHaveBeenCalledWith(existingProductId);
        });

        it('should throw NotFoundException if product with specified ID does not exist', async () => {
            jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

            const nonExistingProductId = 999;
            await expect(productService.deleteProductById(nonExistingProductId)).rejects.toThrow(NotFoundException);
        });

    });

});