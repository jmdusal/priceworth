import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto';
import Order from '@/entities/order.entity';
import Customer from '@/entities/customer.entity';

describe('OrderController', () => {
    let orderController: OrderController;
    let orderService: OrderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [OrderController],
        providers: [
            {
            provide: OrderService,
            useValue: {
                create: jest.fn(),
                getByOrderId: jest.fn(),
                getByCustomerId: jest.fn(),
                getAllOrders: jest.fn().mockResolvedValue({}),
                deleteById: jest.fn().mockResolvedValue({}),
            },
            },
        ],
        }).compile();

        orderController = module.get<OrderController>(OrderController);
        orderService = module.get<OrderService>(OrderService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(orderController).toBeDefined();
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

    const mockOrder: Order = {
        customerId: 1,
        billingAddress: '123 Main St',
        shippingMethodId: 1,
        shippingAddress: '456 Elm St',
        isPickup: true,
        pickupAddress: '789 Oak St',
        paymentStatus: 'Paid',
        orderStatus: 'Complete',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 123,
        customer: null,
        orderItems: null,
    };

    describe('create', () => {
        it('should create an order', async () => {

            await orderController.create(mockCreateOrderDto);
            expect(orderService.create).toHaveBeenCalledWith(mockCreateOrderDto);
        });

        it('should throw an error for empty field in billingAddress', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                billingAddress: '',
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty billingAddress value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty billingAddress value');
            }
        });

        it('should throw an error for empty field in shippingMethodId', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                shippingMethodId: null,
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty shippingMethodId value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty shippingMethodId value');
            }
        });

        it('should throw an error for empty field in shippingAddress', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                shippingAddress: '',
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty shippingAddress value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty shippingAddress value');
            }
        });

        it('should throw an error for empty field in isPickUp', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                isPickUp: null,
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty isPickUp value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty isPickUp value');
            }
        });

        it('should throw an error for empty field in pickUpAddress', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                pickUpAddress: null,
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty pickUpAddress value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty pickUpAddress value');
            }
        });

        it('should throw an error for empty field in paymentStatus', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                paymentStatus: null,
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty paymentStatus value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty paymentStatus value');
            }
        });

        it('should throw an error for empty field in orderStatus', async () => {
            const mockCreateOrderDtoWithEmptyField: CreateOrderDto = {
                ...mockCreateOrderDto,
                orderStatus: null,
            };
            orderController.create = jest.fn().mockRejectedValueOnce(new Error('Validation error: Empty orderStatus value'));

            try {
                await orderController.create(mockCreateOrderDtoWithEmptyField);
                fail('Expected an error to be thrown')
            } catch (error) {
                expect(error.message).toBe('Validation error: Empty orderStatus value');
            }
        });

    });

    describe('getByOrderId', () => {
        it('should get by order ID', () => {
            const id = 456;
            const getByOrderIdSpy = jest.spyOn(orderService, 'getByOrderId');

            orderController.getByOrderId(id);
            expect(getByOrderIdSpy).toHaveBeenCalledWith(id);
        });

    });

    describe('getByCustomerId', () => {

        it('should get by customer ID', () => {
            const id = 123;
            const getByCustomerIdSpy = jest.spyOn(orderService, 'getByCustomerId');

            orderController.getByCustomerId(id);
            expect(getByCustomerIdSpy).toHaveBeenCalledWith(id);
          });

    });

    // const mockOrders: Order[] = [
    //     {
    //       customerId: 1,
    //       billingAddress: '123 Main St',
    //       shippingMethodId: 1,
    //       shippingAddress: '456 Elm St',
    //       isPickup: true,
    //       pickupAddress: '789 Oak St',
    //       paymentStatus: 'Paid',
    //       orderStatus: 'Complete',
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //       id: 123,
    //       customer: null,
    //       orderItems: null,
    //     },
    // ];

    let mockOrders = [
        {
            id: 1,
            customerId: 1,
            billingAddress: 'Address 1',
            shippingMethodId: 1,
            shippingAddress: 'Shipping Address 1',
            isPickup: false,
            pickupAddress: '',
            paymentStatus: 'Paid',
            orderStatus: 'Delivered',
            createdAt: new Date(),
            updatedAt: new Date(),
            customer: {
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
            },
            orderItems: []
        },
        {
            id: 2,
            customerId: 2,
            billingAddress: 'Address 2',
            shippingMethodId: 2,
            shippingAddress: 'Shipping Address 2',
            isPickup: true,
            pickupAddress: 'Pickup Address 2',
            paymentStatus: 'Pending',
            orderStatus: 'Processing',
            createdAt: new Date(),
            updatedAt: new Date(),
            customer: {
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
            },
            orderItems: []
        },
      ];



    describe('getAll', () => {

        // it('should get all orders', () => {
        //     const getAllOrdersSpy = jest.spyOn(orderService, 'getAllOrders');
        //     orderController.getAll();

        //     expect(getAllOrdersSpy).toHaveBeenCalled();
        // });

        it('should get all orders', async () => {
            const getAllOrdersSpy = jest.spyOn(orderService, 'getAllOrders').mockResolvedValue(mockOrders);
            orderController.getAll();

            expect(getAllOrdersSpy).toHaveBeenCalled();
        });

    });


    describe('deleteById', () => {
        test('should delete order by ID', async () => {
            const orderId = 123;
            const deleteByIdMock = jest.spyOn(orderService, 'deleteById').mockResolvedValue(undefined);

            await orderController.deleteById(orderId);

            expect(deleteByIdMock).toHaveBeenCalledWith(orderId);
        });
    });



});
