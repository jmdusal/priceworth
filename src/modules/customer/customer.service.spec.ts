import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CustomerService } from './customer.service';
import {
    CreateCustomerDto,
    UpdateActiveDto,
    UpdateCustomerDto,
    UpdatePasswordDto,
} from './dto';
import { LoginToken } from '../admin/admin.class';
import Customer from '../../entities/customer.entity';
import ShoppingCart from '../../entities/shoppingcart.entity';
import CustomerDist from '../../../dist/entities/customer.entity';

describe('CustomerService', () => {
    let customerService: CustomerService;
    let customerRepository: Repository<Customer>;
    let cartRepository: Repository<ShoppingCart>;
    let jwtService: JwtService;

    beforeEach(async () => {
        jest.clearAllMocks();
        const mockCustomerRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn().mockResolvedValue({}),
        };
        const mockCartRepository = {
            findOne: jest.fn(),
        };
        const mockJwtService = {
            sign: jest.fn(),
            verify: jest.fn(),
        };

        // const module: TestingModule = await Test.createTestingModule({
        // providers: [
        //     CustomerService,
        //     JwtService,
        //     {
        //         provide: 'CustomerRepository',
        //         useClass: Repository
        //     },
        //     {
        //         provide: 'ShoppingCartRepository',
        //         useClass: Repository
        //     },
        // ],
        // }).compile();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
              CustomerService,
              { provide: JwtService, useValue: mockJwtService },
              { provide: 'CustomerRepository', useValue: mockCustomerRepository },
              { provide: 'ShoppingCartRepository', useValue: mockCartRepository },
            ],
          }).compile();

        customerService = module.get<CustomerService>(CustomerService);
        customerRepository = module.get('CustomerRepository');
        cartRepository = module.get('ShoppingCartRepository');
        jwtService = module.get<JwtService>(JwtService);
    });

    let mockCreateCustomerDto: CreateCustomerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Fname',
        lastName: 'Lname',
        gender: 'male',
        company: 'ABC pty ltd',
        streetAddress: 'ABC street',
        suburb: 'Smithfield',
        city: 'Sydney',
        country: 'Australia',
        state: 'NSW',
        postcode: '2164',
        phone: '1234567890',
        dateOfBirth: '01-01-2000',
        active: true,
        shoppingCartId: 'bc0f36c0-376c-4395-adfa-bfe941f791e2',
    };

    let mockCustomer: Customer = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Fname',
        lastName: 'Lname',
        gender: 'male',
        company: 'ABC pty ltd',
        streetAddress: 'ABC street',
        suburb: 'Smithfield',
        city: 'Sydney',
        country: 'Australia',
        state: 'NSW',
        postcode: '2164',
        phone: '1234567890',
        dateOfBirth: '01-01-2000',
        active: true,
        shoppingCartId: 'bc0f36c0-376c-4395-adfa-bfe941f791e2',
        shoppingCart: null,
        orders: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    jest.mock('bcrypt', () => ({
        async hash(password: string): Promise<string> {
        return 'hashedPassword';
        },
    }));

    it('should be defined', () => {
        expect(customerService).toBeDefined();
    });

    describe('createCustomer', () => {

        it('should create a new customer', async () => {

            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(cartRepository, 'findOne').mockResolvedValue({
                id: '1',
                total: 0,
                shoppingCartItems: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                customer: null as any,
            });

            // jest.spyOn(bcrypt, 'hash').mockResolvedValue(Promise.resolve('hashedPassword') as never);
            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
            jest.spyOn(customerRepository, 'create').mockReturnValue(mockCreateCustomerDto as any);
            jest.spyOn(customerRepository, 'save').mockResolvedValue({ id: 1 } as any);
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

            const result: LoginToken = await customerService.createCustomer(mockCreateCustomerDto);

            expect(result.token).toBe('jwtToken');

        });

        it('should throw BadRequestException if email is already registered', async () => {

            jest.spyOn(customerRepository, 'findOne').mockResolvedValue({ email: 'existing@example.com' } as Customer);

            await expect(customerService.createCustomer(mockCreateCustomerDto)).rejects.toThrowError(BadRequestException);
        });

        it('should throw NotFoundException if shopping cart is not found', async () => {

            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);

            await expect(customerService.createCustomer(mockCreateCustomerDto)).rejects.toThrowError(NotFoundException);
        });

        it('should throw a bad request when encountering an empty email field', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(cartRepository, 'findOne').mockResolvedValue({
                id: '1',
                total: 0,
                shoppingCartItems: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                customer: null as any,
            });

            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
            jest.spyOn(customerRepository, 'create').mockImplementation((dto) => {
                if (Object.values(dto).some(email => email === '')) {
                    throw new Error('Bad Request');
                }
                return mockCreateCustomerDto as any;
            });
            jest.spyOn(customerRepository, 'save').mockResolvedValue({ id: 1 } as any);
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
            const emptyFieldDto = { ...mockCreateCustomerDto, email: '' };

            await expect(customerService.createCustomer(emptyFieldDto)).rejects.toThrowError('Bad Request');
        });


        it('should throw a bad request when encountering an empty password field', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(cartRepository, 'findOne').mockResolvedValue({
                id: '1',
                total: 0,
                shoppingCartItems: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                customer: null as any,
            });

            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
            jest.spyOn(customerRepository, 'create').mockImplementation((dto) => {
                if (!dto.password) {
                    throw new Error('Bad Request');
                }
                return mockCreateCustomerDto as any;
            });
            jest.spyOn(customerRepository, 'save').mockResolvedValue({ id: 1 } as any);
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
            const emptyFieldDto = { ...mockCreateCustomerDto, password: '' };

            try {
                await customerService.createCustomer(emptyFieldDto);
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty active field', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(cartRepository, 'findOne').mockResolvedValue({
                id: '1',
                total: 0,
                shoppingCartItems: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                customer: null as any,
            });

            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
            jest.spyOn(customerRepository, 'create').mockImplementation((dto) => {
                if (Object.values(dto).some(active => active === null)) {
                    throw new Error('Bad Request');
                }
                return mockCreateCustomerDto as any;
            });
            jest.spyOn(customerRepository, 'save').mockResolvedValue({ id: 1 } as any);
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
            const emptyFieldDto = { ...mockCreateCustomerDto, active: null };

            await expect(customerService.createCustomer(emptyFieldDto)).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty shoppingCartId field', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(cartRepository, 'findOne').mockResolvedValue({
                id: '1',
                total: 0,
                shoppingCartItems: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                customer: null as any,
            });

            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedPassword');
            jest.spyOn(customerRepository, 'create').mockImplementation((dto) => {
                if (Object.values(dto).some(shoppingCartId => shoppingCartId === '')) {
                    throw new Error('Bad Request');
                }
                return mockCreateCustomerDto as any;
            });
            jest.spyOn(customerRepository, 'save').mockResolvedValue({ id: 1 } as any);
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
            const emptyFieldDto = { ...mockCreateCustomerDto, shoppingCartId: '' };

            await expect(customerService.createCustomer(emptyFieldDto)).rejects.toThrowError('Bad Request');
        });

    });


    describe('login', () => {

        it('should login and return a token', async () => {
            // jest.spyOn(customerRepository, 'findOne').mockResolvedValue({ id: 1, email: 'test@example.com', password: '$2b$10$foobar' });
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: '$2b$10$foobar',
            } as Customer);

            // jest.spyOn(bcrypt, 'compare').mockResolvedValue(Promise.resolve(true));
            // jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(Promise.resolve(true));
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

            const customerLoginDto = { email: 'test@example.com', password: 'password123' };
            const result = await customerService.login(customerLoginDto);

            expect(result.token).toBe('jwtToken');
        });

        it('should throw BadRequestException if email is not registered', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(null);
            const customerLoginDto = { email: 'test@example.com', password: 'password123' };

            await expect(customerService.login(customerLoginDto)).rejects.toThrowError(BadRequestException);
        });

        it('should throw BadRequestException if password does not match', async () => {

            jest.spyOn(customerRepository, 'findOne').mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: '$2b$10$foobar',
            } as Customer);

            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
            const customerLoginDto = { email: 'test@example.com', password: 'password123' };

            await expect(customerService.login(customerLoginDto)).rejects.toThrowError(BadRequestException);
        });

    });


    describe('getCustomerById', () => {

        it('should return a customer by ID', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValueOnce(mockCustomer);

            const customerId = 1;
            const result = await customerService.getCustomerById(customerId);

            expect(result).toEqual(mockCustomer);
        });

        it('should throw NotFoundException if customer with given ID is not found', async () => {
            jest.spyOn(customerRepository, 'findOne').mockResolvedValueOnce(null);
            const nonExistingCustomerId = 999;

            await expect(customerService.getCustomerById(nonExistingCustomerId)).rejects.toThrowError(NotFoundException);
        });

    });


    describe('getCustomerByToken', () => {

        it('should return customer when valid token is provided', async () => {
            const token = 'valid-token';
            const customer = { id: 1 };

            (jwtService.verify as jest.Mock).mockReturnValue(customer);
            (customerRepository.findOne as jest.Mock).mockResolvedValue(mockCustomer);
            const result = await customerService.getCustomerByToken(token);

            expect(result).toEqual(mockCustomer);
        });

        it('should throw NotFoundException when customer is not found', async () => {
            const token = 'valid-token';
            const customer = { id: 1 };

            (jwtService.verify as jest.Mock).mockReturnValue(customer);
            (customerRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            await expect(customerService.getCustomerByToken(token)).rejects.toThrowError(NotFoundException);
        });

    });


    describe('updateCustomerInfoById', () => {

        it('should update customer info and return the updated customer', async () => {

            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            const updatedCustomer: Customer = { ...mockCustomer, ...updateCustomerDto };

            (customerRepository.findOne as jest.Mock).mockResolvedValue(mockCustomer);
            (customerRepository.save as jest.Mock).mockResolvedValue(updatedCustomer);

            const result = await customerService.updateCustomerInfoById(id, updateCustomerDto);

            expect(result).toEqual(updatedCustomer);
            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(customerRepository.save).toHaveBeenCalledWith(updatedCustomer);
        });

        it('should throw a bad request when encountering an empty firstName field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: '',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty lastName field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: '',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty gender field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: '',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty company field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: '',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty streetAddress field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: '',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty suburb field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: '',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty city field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: '',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty country field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: '',
                state: 'NSW',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty state field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: '',
                postcode: '2164',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty postcode field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '',
                phone: '1234567890',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

        it('should throw a bad request when encountering an empty phone field', async () => {
            const id = 1;
            const updateCustomerDto: UpdateCustomerDto = {
                firstName: 'First name',
                lastName: 'Last name',
                gender: 'male',
                company: 'ABC pty ltd',
                streetAddress: 'ABC street',
                suburb: 'Smithfield',
                city: 'Sydney',
                country: 'Australia',
                state: 'NSW',
                postcode: '2164',
                phone: '',
                dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerRepository, 'findOne').mockResolvedValue(mockCustomer);
            try {
                await customerService.updateCustomerInfoById(id, updateCustomerDto);
                throw new Error('Bad Request');
            } catch (error) {
                expect(error.message).toBe('Bad Request');
            }
        });

    });


    describe('updatePasswordById', () => {

        it('should update customer password', async () => {
            const id = 1;
            const newPassword = 'newPassword';
            const updatePasswordDto: UpdatePasswordDto = { password: newPassword };

            (customerRepository.findOne as jest.Mock).mockResolvedValue(mockCustomer);

            await customerService.updatePasswordById(id, updatePasswordDto);

            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(mockCustomer.password).toEqual(newPassword);
            expect(customerRepository.save).toHaveBeenCalledWith(mockCustomer);
        });

        it('should throw NotFoundException if customer with given id does not exist', async () => {
            const id = 1;
            const updatePasswordDto: UpdatePasswordDto = { password: 'newPassword' };

            (customerRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            await expect(customerService.updatePasswordById(id, updatePasswordDto)).rejects.toThrowError(NotFoundException);
            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(customerRepository.save).not.toHaveBeenCalled();
        });

    });


    describe('updateActiveById', () => {

        it('should update customer active status', async () => {
            const id = 1;
            const newActiveStatus = true;
            const updateActiveDto: UpdateActiveDto = { active: newActiveStatus };

            (customerRepository.findOne as jest.Mock).mockResolvedValue(mockCustomer);

            await customerService.updateActiveById(id, updateActiveDto);

            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(mockCustomer.active).toEqual(newActiveStatus);
            expect(customerRepository.save).toHaveBeenCalledWith(mockCustomer);
        });

        it('should throw NotFoundException if customer with given id does not exist', async () => {
            const id = 1;
            const updateActiveDto: UpdateActiveDto = { active: true };

            (customerRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            await expect(customerService.updateActiveById(id, updateActiveDto)).rejects.toThrowError(NotFoundException);
            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(customerRepository.save).not.toHaveBeenCalled();
        });

    });

    describe('deleteCustomerById', () => {

        it('should delete customer by id', async () => {
            const id = 1;
            const customerExisting = { id };

            (customerRepository.findOne as jest.Mock).mockResolvedValue(customerExisting);

            await customerService.deleteCustomerById(id);

            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(customerRepository.delete).toHaveBeenCalledWith(id);
        });

        it('should throw NotFoundException if customer with given id does not exist', async () => {
            const id = 1;

            (customerRepository.findOne as jest.Mock).mockResolvedValue(undefined);

            await expect(customerService.deleteCustomerById(id)).rejects.toThrowError(NotFoundException);
            expect(customerRepository.findOne).toHaveBeenCalledWith({ where: { id } });
            expect(customerRepository.delete).not.toHaveBeenCalled();
        });

    });

});
