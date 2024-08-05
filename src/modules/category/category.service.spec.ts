import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import Category from '@/entities/category.entity';
import { Repository, Not, IsNull } from 'typeorm';

describe('CategoryService', () => {
	let categoryservice: CategoryService;

	const mockRepository = {
	    find: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
		delete: jest.fn(),
		createQueryBuilder: jest.fn(),
	};

	const mockCategoryRepository = {
		createQueryBuilder: jest.fn().mockReturnThis(),
		leftJoinAndSelect: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CategoryService,
				{ provide: getRepositoryToken(Category), useValue: mockRepository,  },
			],
		}).compile();

		categoryservice = module.get<CategoryService>(CategoryService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(categoryservice).toBeDefined();
	});


	describe('list', () => {

		it('should return a list of top-level categories', async () => {
			const mockCategories = [
				{ id: 1, name: 'Category 1', parentCategoryId: null, children: [] },
				{ id: 2, name: 'Category 2', parentCategoryId: null, children: [] },
			];

			mockRepository.find.mockResolvedValueOnce(mockCategories);
			const result = await categoryservice.list();

			expect(result).toEqual(mockCategories);
			expect(mockRepository.find).toHaveBeenCalled();
		});

		it('should organize categories into a tree structure', async () => {

			const mockCategories = [
				{ id: 1, name: 'Category 1', parentCategoryId: null },
				{ id: 2, name: 'Category 2', parentCategoryId: 1 },
				{ id: 3, name: 'Category 3', parentCategoryId: 1 },
			];

			mockRepository.find.mockResolvedValueOnce(mockCategories);
			const result = await categoryservice.list();

			expect(result).toHaveLength(1);
			expect(result[0].id).toEqual(1);
			expect(result[0].children).toHaveLength(2);
			expect(mockRepository.find).toHaveBeenCalled();
		});
	});


	describe('createCategory', () => {

		it('should create a new category', async () => {
			// Mock the repository methods
			mockRepository.findOne.mockResolvedValueOnce(null);
			mockRepository.create.mockReturnValueOnce({ id: 1 });
			mockRepository.save.mockResolvedValueOnce({ id: 1 });

			const createCategoryDto: CreateCategoryDto = { 
				name: 'Test Category',
				description: 'Category description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null
			};
			const result = await categoryservice.createCategory(createCategoryDto);

			expect(result).toEqual({ id: 1 });
			expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { name: 'Test Category' } });
			expect(mockRepository.create).toHaveBeenCalledWith(createCategoryDto);
			mockRepository.save.mockImplementation((category) => Promise.resolve({ id: 1, ...category }));
		});


		it('should throw BadRequestException if category name already exists', async () => {

			mockRepository.findOne.mockResolvedValueOnce({ id: 1 });

			const createCategoryDto: CreateCategoryDto = {
				name: 'Test Category',
				description: 'Category description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null
			};
			await expect(categoryservice.createCategory(createCategoryDto)).rejects.toThrow(BadRequestException);
		});

		it('should throw a validation error in a create when the name field is empty', async () => {
			const createCategoryDto: CreateCategoryDto = {
				name: '',
				description: 'Category description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null,
			};

			categoryservice.createCategory = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));

			try {
				await categoryservice.createCategory(createCategoryDto as CreateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty name value');
			}
		});

		it('should throw a validation error in a create when the description field is empty', async () => {
			const createCategoryDto: CreateCategoryDto = {
				name: 'Test Category',
				description: '',
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null,
			}

			categoryservice.createCategory = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty description value'));

			try {
				await categoryservice.createCategory(createCategoryDto as CreateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty description value');
			}
		});


		it('should throw a validation error in a create when the image field is empty', async () => {
			const createCategoryDto: CreateCategoryDto = {
				name: 'Test Category', 
				description: 'Category Description', 
				image: '',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null,
			}

			categoryservice.createCategory = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty image value'));

			try {
				await categoryservice.createCategory(createCategoryDto as CreateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty image value');
			}
		});

		it('should throw a validation error in a create when the show on homepage field is empty', async () => {
			const createCategoryDto: CreateCategoryDto = {
				name: 'Test Category', 
				description: 'Category Description', 
				image: 'category-image.jpg',
				showOnHomepage: null,
				IncludeInTopMenu: true,
				published: true,
				parentCategoryId: null,
			}

			categoryservice.createCategory = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty show on homepage value'));

			try {
				await categoryservice.createCategory(createCategoryDto as CreateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty show on homepage value');
			}
		});


		it('should throw a validation error in a create when the include in top menu field is empty', async () => {
			const createCategoryDto: CreateCategoryDto = {
				name: 'Test Category', 
				description: 'Category Description', 
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: null,
				published: true,
				parentCategoryId: null,
			}

			categoryservice.createCategory = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty include in top menu value'));

			try {
				await categoryservice.createCategory(createCategoryDto as CreateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty include in top menu value');
			}
		});

		it('should throw a validation error in a create when the published field is empty', async () => {
			const createCategoryDto: CreateCategoryDto = {
				name: 'Test Category',
				description: 'Category Description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				IncludeInTopMenu: true,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.createCategory = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty published value'));

			try {
				await categoryservice.createCategory(createCategoryDto as CreateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty published value');
			}
		});

	});


	describe('getById', () => {
		it('should return category when it exists', async () => {
			const categoryData = { id: 1, name: 'Test Category' };

			mockRepository.createQueryBuilder.mockReturnValueOnce({
			  leftJoinAndSelect: jest.fn().mockReturnThis(),
			  where: jest.fn().mockReturnThis(),
			  getOne: jest.fn().mockResolvedValueOnce(categoryData),
			});

			const result = await categoryservice.getById(1);
			expect(result).toEqual(categoryData);
		});

		it('should throw NotFoundException when category does not exist', async () => {

			mockRepository.createQueryBuilder.mockReturnValueOnce({
			  leftJoinAndSelect: jest.fn().mockReturnThis(),
			  where: jest.fn().mockReturnThis(),
			  getOne: jest.fn().mockResolvedValueOnce(null),
			});

			await expect(categoryservice.getById(1)).rejects.toThrow(NotFoundException);
		});
	});



	describe('listSubCategories', () => {

		it('should return a list of sub-categories', async () => {

			const mockSubCategories = [
				{ id: 1, name: 'SubCategory 1', parentCategoryId: 1 },
				{ id: 2, name: 'SubCategory 2', parentCategoryId: 1 },
			];

			mockRepository.find.mockResolvedValueOnce(mockSubCategories);
			const result = await categoryservice.listSubCategories();

			expect(result).toEqual(mockSubCategories);
			expect(mockRepository.find).toHaveBeenCalledWith({ where: { parentCategoryId: Not(IsNull()) } });
		});

	});


	describe('updateById', () => {

		it('should update the category with the given ID', async () => {

				const categoryId = 1;
				const updateCategoryDto = {
					name: 'Updated Category Name',
					description: 'Updated Category Description',
					image: 'updated-image.jpg',
					showOnHomepage: true,
					includeInTopMenu: true,
					published: true,
					parentCategoryId: null
				};
				const mockUpdatedCategory = { id: categoryId, ...updateCategoryDto };

				mockRepository.findOne.mockResolvedValueOnce({ id: categoryId });
				mockRepository.save.mockResolvedValueOnce(mockUpdatedCategory);
				const result = await categoryservice.updateById(categoryId, updateCategoryDto);

				expect(result).toEqual(mockUpdatedCategory);

				expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
				expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ id: categoryId, ...updateCategoryDto }));
		});


		it('should throw BadRequestException when parentCategoryId is equal to category ID', async () => {
			const categoryId = 1;
			const updateCategoryDto = {
				name: 'Updated Category Name',
				description: 'Updated Category Description',
				image: 'updated-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: true,
				parentCategoryId: categoryId, // Setting parentCategoryId equal to category ID
			};

			try {
				await categoryservice.updateById(categoryId, updateCategoryDto);

				fail('Expected BadRequestException was not thrown');
			} catch (error) {

				expect(error).toBeInstanceOf(BadRequestException);
				expect(error.message).toBe(`Category ID cannot be equal with its parent category id, id ${categoryId}`);
			}
		});

		it('should throw NotFoundException when category with given ID is not found', async () => {
			const categoryId = 1;
			const updateCategoryDto = {
				name: 'Updated Category Name',
				description: 'Updated Category Description',
				image: 'updated-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: true,
				parentCategoryId: null
			};

			categoryservice['findOne'] = jest.fn().mockResolvedValue(null);

			try {
				await categoryservice.updateById(categoryId, updateCategoryDto);

				fail('Expected NotFoundException was not thrown');

			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);

				expect(error.message).toBe(`Category with ID ${categoryId} not found`);
			}
		});

		it('should throw NotFoundException if category with given ID does not exist', async () => {

			mockRepository.findOne.mockResolvedValueOnce(undefined);

			const categoryId = 1;
			const updateCategoryDto = { 
				name: 'Updated Category Name',
				description: 'Updated Category Description',
				image: 'updated-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: true,
				parentCategoryId: null
			};
			await expect(categoryservice.updateById(categoryId, updateCategoryDto)).rejects.toThrow(NotFoundException);
		});


		it('should throw a validation error in an update when the name field is empty', async () => {
			const categoryId = 1;
			const updateCategoryDto: UpdateCategoryDto = {
				name: '', 
				description: 'Category Description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.updateById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty name value'));

			try {
				await categoryservice.updateById(categoryId,updateCategoryDto as UpdateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty name value');
			}
		});

		it('should throw a validation error in an update when the description field is empty', async () => {
			const categoryId = 1;
			const updateCategoryDto: UpdateCategoryDto = {
				name: 'Test Category', 
				description: '', 
				image: 'category-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.updateById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty description value'));

			try {
				await categoryservice.updateById(categoryId,updateCategoryDto as UpdateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty description value');
			}
		});


		it('should throw a validation error in an update when the image field is empty', async () => {
			const categoryId = 1;
			const updateCategoryDto: UpdateCategoryDto = {
				name: 'Test Category', 
				description: 'Category Description', 
				image: '',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.updateById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty image value'));

			try {
				await categoryservice.updateById(categoryId,updateCategoryDto as UpdateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty image value');
			}
		});

		it('should throw a validation error in an update when the show on homepage field is empty', async () => {
			const categoryId = 1;
			const updateCategoryDto: UpdateCategoryDto = {
				name: 'Test Category',
				description: 'Category Description',
				image: 'category-image.jpg',
				showOnHomepage: null,
				includeInTopMenu: true,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.updateById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty show on homepage value'));

			try {
				await categoryservice.updateById(categoryId,updateCategoryDto as UpdateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty show on homepage value');
			}
		});


		it('should throw a validation error in an update when the include in top menu field is empty', async () => {
			const categoryId = 1;
			const updateCategoryDto: UpdateCategoryDto = {
				name: 'Test Category',
				description: 'Category Description',
				image: 'category-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: null,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.updateById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty include in top menu value'));

			try {
				await categoryservice.updateById(categoryId,updateCategoryDto as UpdateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty include in top menu value');
			}
		});

		it('should throw a validation error in an update when the published field is empty', async () => {
			const categoryId = 1;
			const updateCategoryDto: UpdateCategoryDto = {
				name: 'Test Category', 
				description: 'Category Description', 
				image: 'category-image.jpg',
				showOnHomepage: true,
				includeInTopMenu: true,
				published: null,
				parentCategoryId: null,
			}

			categoryservice.updateById = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty published value'));

			try {
				await categoryservice.updateById(categoryId,updateCategoryDto as UpdateCategoryDto);
				fail('Expected an error to be thrown');
			} catch (error) {
				expect(error.message).toBe('Validation error: Empty published value');
			}
		});

	});


	describe('deleteById', () => {

		it('should delete a category when it exists', async () => {
			const category = { id: 1, name: 'Test Category' };
			mockRepository.findOne.mockResolvedValue(category);

			await categoryservice.deleteById(1);

			expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
			expect(mockRepository.delete).toHaveBeenCalledWith(1);
		});

		it('should throw NotFoundException when category does not exist', async () => {
			mockRepository.findOne.mockResolvedValue(null);
			await expect(categoryservice.deleteById(1)).rejects.toThrow(NotFoundException);
		});

	});

});

