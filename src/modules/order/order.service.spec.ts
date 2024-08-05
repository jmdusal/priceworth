import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import Order from '@/entities/order.entity';
import OrderItem from '@/entities/orderitem.entity';
import Customer from '@/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
    let orderService: OrderService;
    let orderRepository: MockRepository;
    let mockCustomerRepository: MockCustomerRepository;

    class MockRepository {
        find = jest.fn();
        findOne = jest.fn();
        create = jest.fn();
        save = jest.fn();
        delete = jest.fn();
        getAllOrders = jest.fn();
    }

    class MockCustomerRepository {
        findOne = jest.fn();
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            OrderService,
            {
                provide: getRepositoryToken(Order),
                useClass: MockRepository,
            },
            {
                provide: getRepositoryToken(OrderItem),
                useClass: Repository,
            },
            {
                provide: 'CustomerRepository',
                useClass: MockCustomerRepository,
            },
        ],
        }).compile();

        orderService = module.get<OrderService>(OrderService);
        orderRepository = module.get<MockRepository>(getRepositoryToken(Order));
        mockCustomerRepository = module.get<MockCustomerRepository>('CustomerRepository');
    });

    it('should be defined', () => {
        expect(orderService).toBeDefined();
    });

    let mockCreateOrderDto: CreateOrderDto = {
        customerId: 1,
        billingAddress: '123 Main St',
        shippingMethodId: 1,
        shippingAddress: '456 Elm St',
        isPickUp: false,
        pickUpAddress: '456 Elm St',
        paymentStatus: 'pending',
        orderStatus: 'pending'
    }

    let mockOrder = { id: 1, ...mockCreateOrderDto };

    let mockCustomer = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
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
        createdAt: new Date(),
        updatedAt: new Date(),
        shoppingCart: [],
        orders: [{ id: 1, ...mockCreateOrderDto }]
    };


    describe('create', () => {

        it('should create an order', async () => {
            orderRepository.create.mockReturnValue(mockOrder);
            orderRepository.save.mockResolvedValue(mockOrder);

            const result = await orderService.create(mockCreateOrderDto);

            expect(result).toEqual(mockOrder);
            expect(orderRepository.create).toHaveBeenCalledWith(mockCreateOrderDto);
            expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);

        });

        it('should throw an error when creating an order with an empty billingAddress field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                billingAddress: '',
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty billingAddress value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty billingAddress value');
            }
        });


        it('should throw an error when creating an order with an empty shippingMethodId field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                shippingMethodId: null,
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty shippingMethodId value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty shippingMethodId value');
            }
        });

        it('should throw an error when creating an order with an empty shippingAddress field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                shippingAddress: '',
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty shippingAddress value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty shippingAddress value');
            }
        });

        it('should throw an error when creating an order with an empty isPickUp field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                isPickUp: null,
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty isPickUp value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty isPickUp value');
            }
        });

        it('should throw an error when creating an order with an empty pickUpAddress field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                pickUpAddress: '',
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty pickUpAddress value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty pickUpAddress value');
            }
        });

        it('should throw an error when creating an order with an empty paymentStatus field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                paymentStatus: '',
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty paymentStatus value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty paymentStatus value');
            }
        });

        it('should throw an error when creating an order with an empty orderStatus field', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                orderStatus: '',
            };

            orderService.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty orderStatus value'));
            try {
                await orderService.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty orderStatus value');
            }
        });

    });


    describe('getByOrderId', () => {

        it('should return order if found', async () => {
            // const mockOrder: Order = { id: 1,  };

            jest.spyOn(orderRepository, 'findOne').mockResolvedValueOnce(mockOrder);

            const result = await orderService.getByOrderId(1);

            expect(result).toEqual(mockOrder);
            expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException if order is not found', async () => {
            jest.spyOn(orderRepository, 'findOne').mockResolvedValueOnce(undefined);

            await expect(orderService.getByOrderId(1)).rejects.toThrowError(NotFoundException);
            expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

    });


    describe('getByCustomerId', () => {

        it('should return orders if customer found', async () => {

            mockCustomerRepository.findOne.mockResolvedValueOnce(mockCustomer);
            const result = await orderService.getByCustomerId(1);

            expect(result).toEqual(mockCustomer.orders);
            expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['orders'] });

        });

        it('should throw NotFoundException if customer is not found', async () => {
            mockCustomerRepository.findOne.mockResolvedValueOnce(undefined);

            await expect(orderService.getByCustomerId(1)).rejects.toThrowError(NotFoundException);
            expect(mockCustomerRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['orders'] });
        });

    });


    describe('getAllOrders', () => {

        it('should return all orders', async () => {

            orderRepository.find.mockResolvedValueOnce(mockOrder);

            const result = await orderService.getAllOrders();

            expect(result).toEqual(mockOrder);
            expect(orderRepository.find).toHaveBeenCalled();
        });

    });


    describe('deleteById', () => {

        it('should delete order if found', async () => {

            jest.spyOn(orderRepository, 'findOne').mockResolvedValueOnce(mockOrder);
            jest.spyOn(orderRepository, 'delete').mockResolvedValueOnce(undefined);

            await orderService.deleteById(1);

            expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(orderRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if order is not found', async () => {
            jest.spyOn(orderRepository, 'findOne').mockResolvedValueOnce(undefined);

            await expect(orderService.deleteById(1)).rejects.toThrowError(NotFoundException);
            expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

    });


});
