import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductVariantDto } from './dto/create-product_variant.dto';
import { CreateProductFeatureDto } from './dto/create-product_feature.dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { UpdateProductVariantDto } from './dto/update-product_variant.dto';
import { UpdateProductFeatureDto } from './dto/update-product_feature.dto';
import Product from '@/entities/product.entity';
import ProductVariant from '@/entities/product_variant.entity';
import Feature from '@/entities/feature.entity';
import Category from '@/entities/category.entity';
import { ADMIN_PREFIX, ADMIN_USER } from '@/constants/admin';
import { UnauthorizedException,HttpStatus, INestApplication } from '@nestjs/common';


describe('ProductController', () => {
    let productcontroller: ProductController;
    let productservice: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [JwtModule],
        controllers: [ProductController],
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
                provide: 'FeatureRepository',
                useClass: Repository,
            },
            {
                provide: 'CategoryRepository',
                useClass: Repository,
            },
        ],
        }).compile();

        productcontroller = module.get<ProductController>(ProductController);
        productservice = module.get<ProductService>(ProductService);
    });


    it('should be defined', () => {
        expect(productcontroller).toBeDefined();
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

    let mockcreateProductVariantDto: CreateProductVariantDto = {
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

    let mockcreateProductFeatureDto: CreateProductFeatureDto = {
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

    let mockcreateProductDto: CreateProductDto = {
        model: 'Test Model',
        productCategoryId: mockCategory[1],
        shortDescription: 'Test Description',
        name: 'Product Test',
        longDescription: 'Product Long Description',
        published: true,
        features: [],
        productVariants: [],
    };

    describe('createProductVariant', () => {

        it('should create product variant with admin permission', async () => {

            jest.spyOn(productservice, 'createProductVariant').mockResolvedValue(mockProductVariant);
            const result = await productcontroller.createProductVariant(mockcreateProductVariantDto);

            expect(result).toEqual(mockProductVariant);
            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockcreateProductVariantDto);
        });

        it('should throw validation error create product variant if name field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: '',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty name value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });


        it('should throw validation error create product variant if color field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: 'Product Name',
                color: '',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty color value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty color value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

        it('should throw validation error create product variant if sku field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: 'Product Variant 1',
                color: 'Green',
                sku: '',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty sku value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty sku value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

        it('should throw validation error create product variant if dimension height field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: 'Product Name',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: null,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty dimension height value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension height value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

        it('should throw validation error create product variant if dimension length field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: 'Product Name',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: null,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty dimension length value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension length value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

        it('should throw validation error create product variant if dimension width field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: 'Product Name',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: null,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty dimension width value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty dimension width value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

        it('should throw validation error create product variant if weight field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: '',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: null,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty weight value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty weight value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

        it('should throw validation error create product variant if price field is empty', async () => {
            const mockCreateProductVariantDto: CreateProductVariantDto = {
                name: 'Product Name',
                color: 'Green',
                sku: 'SKU123',
                dimensionHeight: 12,
                dimensionLength: 55,
                dimensionWidth: 33,
                weight: 26,
                price: 99,
                totalInventory: 1,
                productId: mockProduct.id,
                images: [
                    'product-variant-image-1.jpg',
                    'product-variant-image-2.jpg',
                    'product-variant-image-3.jpg',
                ],
            };

            productservice.createProductVariant = jest.fn().mockRejectedValue(new Error('Validation error: Empty price value'));
            try {
                await productcontroller.createProductVariant(mockCreateProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty price value');
            }

            expect(productservice.createProductVariant).toHaveBeenCalledWith(mockCreateProductVariantDto);
        });

    });

    describe('createProductFeature', () => {

        it('should create product feature with admin permission', async () => {
            jest.spyOn(productservice, 'createProductFeature').mockResolvedValue(mockProductFeature);

            const result = await productcontroller.createProductFeature(mockcreateProductFeatureDto);
            expect(result).toEqual(mockProductFeature);
            expect(productservice.createProductFeature).toHaveBeenCalledWith(mockcreateProductFeatureDto);
        });


        it('should throw validation error create product feature if key field is empty', async () => {
            const mockcreateProductFeatureDto: CreateProductFeatureDto = {
                key: '',
                value: 'Product Value Description',
                productId: mockProduct.id,
            }

            productservice.createProductFeature = jest.fn().mockRejectedValue(new Error('Validation error: Empty key value'));
            try {
                await productcontroller.createProductFeature(mockcreateProductFeatureDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty key value');
            }

            expect(productservice.createProductFeature).toHaveBeenCalledWith(mockcreateProductFeatureDto);
        });

        it('should throw validation error create product feature if value field is empty', async () => {
            const mockcreateProductFeatureDto: CreateProductFeatureDto = {
                key: 'Feature Key',
                value: '',
                productId: mockProduct.id,
            }

            productservice.createProductFeature = jest.fn().mockRejectedValue(new Error('Validation error: Empty value field'));
            try {
                await productcontroller.createProductFeature(mockcreateProductFeatureDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty value field');
            }

            expect(productservice.createProductFeature).toHaveBeenCalledWith(mockcreateProductFeatureDto);
        });

        it('should throw validation error create product feature if product id field is empty', async () => {
            const mockcreateProductFeatureDto: CreateProductFeatureDto = {
                key: 'Feature Key',
                value: 'Product Value Description',
                productId: null,
            }

            productservice.createProductFeature = jest.fn().mockRejectedValue(new Error('Validation error: Empty product id value'));
            try {
                await productcontroller.createProductFeature(mockcreateProductFeatureDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product id value');
            }

            expect(productservice.createProductFeature).toHaveBeenCalledWith(mockcreateProductFeatureDto);
        });

    });


    describe('create', () => {
        it('should create product with admin permission', async () => {
            jest.spyOn(productservice, 'createProduct').mockResolvedValue(mockProduct);

            const result = await productcontroller.create(mockcreateProductDto);
            expect(result).toEqual(mockProduct);
            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });


        it('should throw validation error create product if model field is empty', async () => {
            const mockcreateProductDto: CreateProductDto = {
                model: '',
                name: 'Product Name',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Short Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockcreateProductFeatureDto],
                productVariants: [mockcreateProductVariantDto],
            };

            productservice.createProduct = jest.fn().mockRejectedValue(new Error('Validation error: Empty model value'));
            try {
                await productcontroller.create(mockcreateProductDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty model value');
            }

            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });

        it('should throw validation error create product if name field is empty', async () => {
            const mockcreateProductDto: CreateProductDto = {
                model: 'YTIQUW',
                name: '',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Short Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockcreateProductFeatureDto],
                productVariants: [mockcreateProductVariantDto],
            };

            productservice.createProduct = jest.fn().mockRejectedValue(new Error('Validation error: Empty name value'));
            try {
                await productcontroller.create(mockcreateProductDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }

            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });

        it('should throw validation error create product if product category id field is empty', async () => {
            const mockcreateProductDto: CreateProductDto = {
                model: 'YTIQUW',
                name: 'Product Name',
                productCategoryId: null,
                shortDescription: 'Product Short Description',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockcreateProductFeatureDto],
                productVariants: [mockcreateProductVariantDto],
            };

            productservice.createProduct = jest.fn().mockRejectedValue(new Error('Validation error: Empty product category id value'));
            try {
                await productcontroller.create(mockcreateProductDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product category id value');
            }

            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });

        it('should throw validation error create product if short description field is empty', async () => {
            const mockcreateProductDto: CreateProductDto = {
                model: 'YTIQUW',
                name: 'Product Name',
                productCategoryId: mockCategory.id,
                shortDescription: '',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockcreateProductFeatureDto],
                productVariants: [mockcreateProductVariantDto],
            };

            productservice.createProduct = jest.fn().mockRejectedValue(new Error('Validation error: Empty short description value'));
            try {
                await productcontroller.create(mockcreateProductDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty short description value');
            }

            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });

        it('should throw validation error create product if long description field is empty', async () => {
            const mockcreateProductDto: CreateProductDto = {
                model: 'YTIQUW',
                name: 'Product Name',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Short Description',
                longDescription: '',
                published: true,
                features: [mockcreateProductFeatureDto],
                productVariants: [mockcreateProductVariantDto],
            };

            productservice.createProduct = jest.fn().mockRejectedValue(new Error('Validation error: Empty long description value'));
            try {
                await productcontroller.create(mockcreateProductDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty long description value');
            }

            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });


        it('should throw validation error create product if published field is empty', async () => {
            const mockcreateProductDto: CreateProductDto = {
                model: 'YTIQUW',
                name: 'Product Name',
                productCategoryId: mockCategory.id,
                shortDescription: 'Product Short Description',
                longDescription: 'Product Long Description',
                published: null,
                features: [mockcreateProductFeatureDto],
                productVariants: [mockcreateProductVariantDto],
            };

            productservice.createProduct = jest.fn().mockRejectedValue(new Error('Validation error: Empty published value'));
            try {
                await productcontroller.create(mockcreateProductDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty published value');
            }

            expect(productservice.createProduct).toHaveBeenCalledWith(mockcreateProductDto);
        });

    });


    describe('findAll', () => {

        it('should return all products', async () => {

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
                      products: [],
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      },
                      productVariants: [mockProductVariant],
                      features: [mockProductFeature],
                  createdAt: new Date(),
                  updatedAt: new Date(),
              },
            ];

            jest.spyOn(productservice, 'getAllProducts').mockResolvedValue(products);

            const result = await productcontroller.findAll();
            expect(result).toEqual(products);
            expect(productservice.getAllProducts).toHaveBeenCalled();
          });

    });


    describe('findOne', () => {
        it('should return a product by id', async () => {
            const mockProductId = 1;

            jest.spyOn(productservice, 'findProductById').mockResolvedValue(mockProduct);

            const result = await productcontroller.findOne(mockProductId);
            expect(result).toEqual(mockProduct);
            expect(productservice.findProductById).toHaveBeenCalledWith(mockProductId);
        });
    });


    describe('updateOneVariant', () => {

        it('should update a product variant by id', async () => {
            const mockVariantId = 1;
            const mockUpdateProductVariantDto: UpdateProductVariantDto = {
                name: 'Updated Variant 1',
                price: 60,
            };

            const mockUpdatedVariant: ProductVariant = {
                id: mockVariantId,
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

            jest.spyOn(productservice, 'updateProductVariantById').mockResolvedValue(mockUpdatedVariant);
            const result = await productcontroller.updateOneVariant(mockVariantId, mockUpdateProductVariantDto);

            expect(result).toEqual(mockUpdatedVariant);
            expect(productservice.updateProductVariantById).toHaveBeenCalledWith(mockVariantId, mockUpdateProductVariantDto);
        });


        it('should throw validation error update product one variant if name field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                name: '',
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant name value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant name value');
            }
        });

        it('should throw validation error update product one variant if sku field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                sku: '',
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant sku value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant sku value');
            }
        });

        it('should throw validation error update product one variant if color field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                color: '',
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant color value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant color value');
            }
        });

        it('should throw validation error update product one variant if dimension height field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                dimensionHeight: null,
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant dimension height value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant dimension height value');
            }
        });

        it('should throw validation error update product one variant if dimension length field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                dimensionLength: null,
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant dimension length value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant dimension length value');
            }
        });

        it('should throw validation error update product one variant if dimension width field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                dimensionWidth: null,
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant dimension width value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant dimension width value');
            }
        });

        it('should throw validation error update product one variant if weight field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                weight: null,
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant weight value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant weight value');
            }
        });

        it('should throw validation error update product one variant if price field is empty', async () => {
            const existingProductVariantId = mockProductVariant.id;
            const updatedProductVariantDto: UpdateProductVariantDto = {
                price: null,
            };

            productservice.updateProductVariantById = jest.fn().mockRejectedValue(new Error('Validation error: Empty product variant price value'));
            try {
                await productcontroller.updateOneVariant(existingProductVariantId,updatedProductVariantDto);
                fail('Expected an error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product variant price value');
            }
        });

    });

    describe('updateOneFeature', () => {

        it('should update a product feature by id', async () => {
            const mockFeatureId = 1;
            const mockUpdateProductFeatureDto: UpdateProductFeatureDto = {
                key: 'Updated Key 1',
                value: 'Updated Value 1',
            };

            const mockUpdatedFeature: Feature = {
              id: mockFeatureId,
              key: 'Key 1',
              value: 'Value 1',
              product: mockProduct
            };

            jest.spyOn(productservice, 'updateFeatureById').mockResolvedValue(mockUpdatedFeature);

            const result = await productcontroller.updateOneFeature(mockFeatureId, mockUpdateProductFeatureDto);

            expect(result).toEqual(mockUpdatedFeature);
            expect(productservice.updateFeatureById).toHaveBeenCalledWith(mockFeatureId, mockUpdateProductFeatureDto);
        });

        it('should throw validation error update product one feature if product key field is empty', async () => {
            const existingProductFeatureId = mockProductFeature.id;
            const updatedFeatureDto: UpdateProductFeatureDto = {
                key: '',
            };

            productservice.updateFeatureById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty key value'));
            try {
                await productcontroller.updateOneFeature(existingProductFeatureId, updatedFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty key value');
            }
        });

        it('should throw validation error update product one feature if product value field is empty', async () => {
            const existingProductFeatureId = mockProductFeature.id;
            const updatedFeatureDto: UpdateProductFeatureDto = {
                value: '',
            };

            productservice.updateFeatureById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty product value field'));
            try {
                await productcontroller.updateOneFeature(existingProductFeatureId, updatedFeatureDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product value field');
            }
        });

    });


    describe('updateOne', () => {

        it('should update a product by id', async () => {
            const mockProductId = 1;
            const mockUpdateProductDto: UpdateProductDto = {
                name: 'Updated Product 1',
                shortDescription: 'Updated Short description 1',
            };

            const mockUpdatedProduct: Product = {
                id: mockProductId,
                model: 'Test Model',
                productCategoryId: null,
                shortDescription: 'Test Description',
                name: 'Product Test',
                longDescription: 'Product Long Description',
                published: true,
                features: [mockProductFeature],
                category: mockCategory,
                productVariants: [mockProductVariant],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(productservice, 'updateProductById').mockResolvedValue(mockUpdatedProduct);
            const result = await productcontroller.updateOne(mockProductId, mockUpdateProductDto);

            expect(result).toEqual(mockUpdatedProduct);
            expect(productservice.updateProductById).toHaveBeenCalledWith(mockProductId, mockUpdateProductDto);
        });

        it('should throw validation error update product by id if product model field is empty', async () => {
            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                model: '',
            };

            productservice.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty model value'));
            try {
                await productcontroller.updateOne(existingProductId, updatedProductDto);
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

            productservice.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));
            try {
                await productcontroller.updateOne(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty name value');
            }
        });

        it('should throw validation error update product by id if product product category id field is empty', async () => {
            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                productCategoryId: null,
            };

            productservice.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty product category id value'));
            try {
                await productcontroller.updateOne(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty product category id value');
            }
        });

        it('should throw validation error update product by id if product short description field is empty', async () => {
            const existingProductId = mockProduct.id;
            const updatedProductDto: UpdateProductDto = {
                shortDescription: '',
            };

            productservice.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty short description value'));
            try {
                await productcontroller.updateOne(existingProductId, updatedProductDto);
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

            productservice.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty long description value'));
            try {
                await productcontroller.updateOne(existingProductId, updatedProductDto);
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

            productservice.updateProductById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty published value'));
            try {
                await productcontroller.updateOne(existingProductId, updatedProductDto);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty published value');
            }
        });

    });


    describe('deleteOneFeature', () => {

        it('should delete a feature by id', async () => {
            const mockFeatureId = 1;
            jest.spyOn(productservice, 'deleteFeatureById').mockResolvedValue();

            await productcontroller.deleteOneFeature(mockFeatureId);
            expect(productservice.deleteFeatureById).toHaveBeenCalledWith(mockFeatureId);
        });

    });

    describe('deleteOneVariant', () => {

        it('should delete a variant by id', async () => {
            const mockVariantId = 1;
            jest.spyOn(productservice, 'deleteVariantById').mockResolvedValue();

            await productcontroller.deleteOneVariant(mockVariantId);
            expect(productservice.deleteVariantById).toHaveBeenCalledWith(mockVariantId);
        });

    });


    describe('deleteOne', () => {
        it('should delete a product by id', async () => {
            const mockProductId = 1;
            jest.spyOn(productservice, 'deleteProductById').mockResolvedValue();

            await productcontroller.deleteOne(mockProductId);
            expect(productservice.deleteProductById).toHaveBeenCalledWith(mockProductId);
        });
    });

});
