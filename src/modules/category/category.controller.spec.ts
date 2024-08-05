import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import Category from '@/entities/category.entity';
import { JwtService } from '@nestjs/jwt';

describe('CategoryController', () => {
  let categorycontroller: CategoryController;
  let categoryservice: CategoryService;

  beforeEach(async () => {
		const mockRepository = {
			create: jest.fn().mockResolvedValue({}),
			save: jest.fn().mockResolvedValue({}),
			find: jest.fn().mockResolvedValue([]),
			findOne: jest.fn().mockResolvedValue({}),
			update: jest.fn().mockResolvedValue({}),
			delete: jest.fn().mockResolvedValue({}),
            listSubCategories: jest.fn().mockResolvedValue({}),
		};

	const jwtServiceMock = {
	  // Mock JwtService
	};

	const module: TestingModule = await Test.createTestingModule({
		controllers: [CategoryController],
		providers: [
			CategoryService,
			{ provide: 'CategoryRepository', useValue: mockRepository },
			{ provide: JwtService, useValue: jwtServiceMock }, // Provide JwtService mock
		],
		}).compile();

		categorycontroller = module.get<CategoryController>(CategoryController);
		categoryservice = module.get<CategoryService>(CategoryService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(categorycontroller).toBeDefined();
	});

	describe('list', () => {
		it('should list all categories', async () => {
		const mockCategories: Category[] = [
			{
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
		];

		jest.spyOn(categoryservice, 'list').mockResolvedValue(mockCategories);
		const result = await categorycontroller.list();

		expect(result).toBe(mockCategories);
		});
    });

    describe('listSubCategories', () => {

        it('should return an array of subcategories', async () => {
            const subcategories = [
                {
                    id: 1,
                    name: 'Subcategory 1',
                    description: 'Category description 1',
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
                },
                {
                    id: 2,
                    name: 'Subcategory 2',
                    description: 'Category description 2',
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
                },
                {
                    id: 3,
                    name: 'Subcategory 3',
                    description: 'Category description 3',
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
                },
            ];
            jest.spyOn(categoryservice, 'listSubCategories').mockResolvedValue(subcategories);
            expect(await categorycontroller.listSubCategories()).toEqual(subcategories);
        });

    });


	describe('create', () => {
		it('should create a category', async () => {
			const createDto: CreateCategoryDto = {
				name: 'Test Category',
				description: 'Category description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null
			};
			const createdCategory: Category = {
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
			};

			jest.spyOn(categoryservice, 'createCategory').mockResolvedValue(createdCategory);
			const result = await categorycontroller.create(createDto);

			expect(result).toBe(createdCategory);
		});
	});


    describe('findOne', () => {
        it('should return a category by id', async () => {

            const mockCategory: Category = {
                id: 1,
                name: 'TestCategory',
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
            };
            jest.spyOn(categoryservice, 'getById').mockResolvedValueOnce(mockCategory);

            const result = await categorycontroller.findOne(1);
            expect(result).toEqual(mockCategory);
            expect(categoryservice.getById).toHaveBeenCalledWith(1);
        });
    });

    describe('updateOne', () => {
        it('should update a category by id', async () => {

            const categoryId = 1;
            const updateCategoryDto: UpdateCategoryDto = {
                name: 'New Category Name',
                description: 'Category description',
                image: 'category-image.jpg',
                showOnHomepage: true,
                includeInTopMenu: true,
                published: true,
                parentCategoryId: null,
            };
            const updatedCategory = {
                id: categoryId,
                name: 'New Category Name',
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
            };

            jest.spyOn(categoryservice, 'updateById').mockResolvedValue(updatedCategory);

            const result = await categorycontroller.updateOne(categoryId, updateCategoryDto);
            expect(result).toEqual(updatedCategory);
            expect(categoryservice.updateById).toHaveBeenCalledWith(categoryId, updateCategoryDto);
        });
    });

    describe('deleteOne', () => {

        it('should delete a category by id', async () => {
            const categoryId = 1;
            const deleteByIdSpy = jest.spyOn(categoryservice, 'deleteById').mockResolvedValue();

            await categorycontroller.deleteOne(categoryId);
            expect(deleteByIdSpy).toHaveBeenCalledWith(categoryId);
        });
    });


});
