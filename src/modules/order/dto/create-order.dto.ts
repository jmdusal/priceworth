import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer Id',
  })
  @IsOptional()
  @IsNumber()
  customerId: number;

  @ApiProperty({
    required: true,
    example: 'ABC street',
    description: 'Billing Address',
  })
  @IsString()
  billingAddress: string;

  @ApiProperty({
    required: true,
    example: 1,
    description: 'Shipping Method Id',
  })
  shippingMethodId: number;

  @ApiProperty({
    example: 'ABC street',
    description: 'Shipping Address',
  })
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Is pick up or not',
  })
  @IsBoolean()
  isPickUp: boolean;

  @ApiProperty({
    required: true,
    example: false,
    description: 'Pick up address',
  })
  @IsString()
  pickUpAddress: string;

  @ApiProperty({
    required: true,
    example: 'pending',
    description: 'Payment status',
  })
  @IsString()
  paymentStatus: string;

  @ApiProperty({
    required: true,
    example: 'pending',
    description: 'Order status',
  })
  @IsString()
  orderStatus: string;
}
