import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, CustomerLoginDto, UpdateCustomerDto, UpdatePasswordDto, UpdateActiveDto } from './dto';
import Customer from '@/entities/customer.entity';
import { LoginToken } from '../admin/admin.class';
import { AuthGuard } from '@/common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import ShoppingCart from '../../entities/shoppingcart.entity';

const mockAuthGuard = jest.fn(() => ({
  canActivate: jest.fn(() => true),
}));

describe('CustomerController', () => {
    let customerController: CustomerController;
    let customerService: CustomerService;
    let customerRepository: Repository<Customer>;
    let cartRepository: Repository<ShoppingCart>;

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

        const module: TestingModule = await Test.createTestingModule({
        controllers: [CustomerController],
        providers: [
            CustomerService,
            JwtService,
            { provide: AuthGuard, useFactory: mockAuthGuard },
            { provide: 'CustomerRepository', useValue: mockCustomerRepository },
            { provide: 'ShoppingCartRepository', useValue: mockCartRepository },
        ],
        }).compile();

        customerController = module.get<CustomerController>(CustomerController);
        customerService = module.get<CustomerService>(CustomerService);
        customerRepository = module.get('CustomerRepository');
        cartRepository = module.get('ShoppingCartRepository');
    });

    it('should be defined', () => {
        expect(customerController).toBeDefined();
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
    let mockId = 1;
    let mockToken = 'mockToken';
    let invalidId: number = -1;

    let mockLoginToken: LoginToken = {
        token: 'mockToken',
    };

    let mockCustomerLoginDto: CustomerLoginDto = {
        email: 'test@example.com',
        password: '$2b$10$foobar',
    };

    describe('createCustomer', () => {

        it('should return a LoginToken when a new customer is created', async () => {

            jest.spyOn(customerService, 'createCustomer').mockResolvedValue(mockLoginToken);
            const result: LoginToken = await customerController.createCustomer(mockCreateCustomerDto);
            expect(result).toEqual(mockLoginToken);
        });

        it('should throw a bad request when encountering an empty email field value', async () => {
            const emptyFieldDto: CreateCustomerDto = { ...mockCreateCustomerDto, email: '' };

            jest.spyOn(customerService, 'createCustomer').mockImplementation(() => {
                throw new Error('Bad Request');
            });
            const createCustomerPromise = customerController.createCustomer(emptyFieldDto);

            await expect(createCustomerPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty password field value', async () => {
            const emptyFieldDto: CreateCustomerDto = { ...mockCreateCustomerDto, password: '' };

            jest.spyOn(customerService, 'createCustomer').mockImplementation(() => {
                throw new Error('Bad Request');
            });
            const createCustomerPromise = customerController.createCustomer(emptyFieldDto);

            await expect(createCustomerPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty active field value', async () => {
            const emptyFieldDto: CreateCustomerDto = { ...mockCreateCustomerDto, active: null };

            jest.spyOn(customerService, 'createCustomer').mockImplementation(() => {
                throw new Error('Bad Request');
            });
            const createCustomerPromise = customerController.createCustomer(emptyFieldDto);

            await expect(createCustomerPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty shoppingCartId field value', async () => {
            const emptyFieldDto: CreateCustomerDto = { ...mockCreateCustomerDto, shoppingCartId: '' };

            jest.spyOn(customerService, 'createCustomer').mockImplementation(() => {
                throw new Error('Bad Request');
            });
            const createCustomerPromise = customerController.createCustomer(emptyFieldDto);

            await expect(createCustomerPromise).rejects.toThrowError('Bad Request');
        });

    });

    describe('login', () => {

        it('should return a LoginToken when a customer logs in', async () => {

            jest.spyOn(customerService, 'login').mockResolvedValue(mockLoginToken);
            const result: LoginToken = await customerController.login(mockCustomerLoginDto);

            expect(result).toEqual(mockLoginToken);
        });

        it('should handle errors when a customer logs in', async () => {
            const errorMessage = 'Login failed';

            jest.spyOn(customerService, 'login').mockRejectedValue(new Error(errorMessage));
            const loginPromise = customerController.login(mockCustomerLoginDto);

            await expect(loginPromise).rejects.toThrowError(errorMessage);
        });

    });


    describe('getById', () => {

        it('should return a customer by id', async () => {

            jest.spyOn(customerService, 'getCustomerById').mockResolvedValue(mockCustomer);
            const result: Customer = await customerController.getById(mockId);

            expect(result).toEqual(mockCustomer);
        });

        it('should throw an error for an invalid ID', async () => {
            const getByIdPromise = customerController.getById(invalidId);

            await expect(getByIdPromise).rejects.toThrow();
        });

        it('should handle errors when retrieving a customer by id', async () => {
            const errorMessage = 'Failed to retrieve customer';

            jest.spyOn(customerService, 'getCustomerById').mockRejectedValue(new Error(errorMessage));

            const getByIdPromise = customerController.getById(mockId);
            await expect(getByIdPromise).rejects.toThrowError(errorMessage);
        });

    });

    describe('getByToken', () => {

        it('should return a customer by token', async () => {

            jest.spyOn(customerService, 'getCustomerByToken').mockResolvedValue(mockCustomer);
            const result: Customer = await customerController.getByToken(mockToken);

            expect(result).toEqual(mockCustomer);
        });

        it('should handle errors when retrieving a customer by token', async () => {
            const errorMessage = 'Failed to retrieve customer by token';

            jest.spyOn(customerService, 'getCustomerByToken').mockRejectedValue(new Error(errorMessage));
            const getByTokenPromise = customerController.getByToken(mockToken);

            await expect(getByTokenPromise).rejects.toThrowError(errorMessage);
        });



    });


    describe('updateInfoById', () => {

        it('should update a customer information by ID', async () => {

            const mockDto: UpdateCustomerDto = {
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

            const mockUpdatedCustomer: Customer = {
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
            }
            jest.spyOn(customerService, 'updateCustomerInfoById').mockResolvedValue(mockUpdatedCustomer);
            const result: Customer = await customerController.updateInfoById(mockId, mockDto);

            expect(result).toEqual(mockUpdatedCustomer);
        });

        it('should throw an error for an invalid ID', async () => {
            const mockDto: UpdateCustomerDto = {
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
            const updateInfoByIdPromise = customerController.updateInfoById(invalidId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrow();
        });

        it('should throw a bad request when encountering an empty firstName field value', async () => {
            const mockDto: UpdateCustomerDto = {
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
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty lastName field value', async () => {
            const mockDto: UpdateCustomerDto = {
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
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty gender field value', async () => {
            const mockDto: UpdateCustomerDto = {
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
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty company field value', async () => {
            const mockDto: UpdateCustomerDto = {
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
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty streetAddress field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: '',
              suburb: 'Smithfield',
              city: 'Sydney',
              country: 'Australia',
              state: 'NSW',
              postcode: '2164',
              phone: '1234567890',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty suburb field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: '',
              city: 'Sydney',
              country: 'Australia',
              state: 'NSW',
              postcode: '2164',
              phone: '1234567890',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty city field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: 'test test',
              city: '',
              country: 'Australia',
              state: 'NSW',
              postcode: '2164',
              phone: '1234567890',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty country field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: 'test test',
              city: 'Test city',
              country: '',
              state: 'NSW',
              postcode: '2164',
              phone: '1234567890',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty state field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: 'test test',
              city: 'Test city',
              country: 'Country test',
              state: '',
              postcode: '2164',
              phone: '1234567890',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty postcode field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: 'test test',
              city: 'Test city',
              country: 'Country test',
              state: 'State test',
              postcode: '',
              phone: '1234567890',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty phone field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: 'test test',
              city: 'Test city',
              country: 'Country test',
              state: 'State test',
              postcode: '2164',
              phone: '',
              dateOfBirth: '01-01-2000',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

        it('should throw a bad request when encountering an empty dateOfBirth field value', async () => {
            const mockDto: UpdateCustomerDto = {
              firstName: 'First name',
              lastName: 'Last name',
              gender: 'male',
              company: 'Comapny test',
              streetAddress: 'street address',
              suburb: 'test test',
              city: 'Test city',
              country: 'Country test',
              state: 'State test',
              postcode: '2164',
              phone: '1234567890',
              dateOfBirth: '',
            };
            jest.spyOn(customerService, 'updateCustomerInfoById').mockImplementation(() => {
              throw new Error('Bad Request');
            });
            const updateInfoByIdPromise = customerController.updateInfoById(mockId, mockDto);

            await expect(updateInfoByIdPromise).rejects.toThrowError('Bad Request');
        });

    });


    describe('deleteById', () => {

        it('should delete a customer by ID', async () => {

            const deleteCustomerByIdSpy = jest.spyOn(customerService, 'deleteCustomerById').mockResolvedValue();
            await customerController.deleteById(mockId);

            expect(deleteCustomerByIdSpy).toHaveBeenCalledWith(mockId);
        });

        it('should throw an error for an invalid ID', async () => {
            const deleteByIdPromise = customerController.deleteById(invalidId);

            await expect(deleteByIdPromise).rejects.toThrow();
        });


    });


    describe('updatePasswordById', () => {
        it('should update a customer password by ID', async () => {
          const mockDto: UpdatePasswordDto = {
            password: 'Test123'
          };

          const updatePasswordByIdSpy = jest.spyOn(customerService, 'updatePasswordById').mockResolvedValue();
          await customerController.updatePasswordById(mockId, mockDto);

          expect(updatePasswordByIdSpy).toHaveBeenCalledWith(mockId, mockDto);
        });

        it('should throw an error for an invalid ID', async () => {
            const mockDto: UpdatePasswordDto = {
              password: 'Test123',
            };
            const updatePasswordByIdPromise = customerController.updatePasswordById(invalidId, mockDto);

            await expect(updatePasswordByIdPromise).rejects.toThrow();
        });

    });

    describe('updateActiveById', () => {
        it('should update a customer active status by ID', async () => {
          const mockDto: UpdateActiveDto = {
            active: true
          };
          const updateActiveByIdSpy = jest.spyOn(customerService, 'updateActiveById').mockResolvedValue();
          await customerController.updateActiveById(mockId, mockDto);

          expect(updateActiveByIdSpy).toHaveBeenCalledWith(mockId, mockDto);
        });

        it('should throw an error for an invalid ID', async () => {
            const mockDto: UpdateActiveDto = {
              active: true,
            };
            const updateActiveByIdPromise = customerController.updateActiveById(invalidId, mockDto);

            await expect(updateActiveByIdPromise).rejects.toThrow();
        });

    });


});
