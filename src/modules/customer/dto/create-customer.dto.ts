import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    required: true,
    example: 'null@null.com',
    description: 'Customer email / username',
  })
  @IsEmail()
  readonly email: string = 'null@null.com';

  @ApiProperty({
    required: true,
    example: 'Test123!',
    description: 'Customer password',
  })
  @IsStrongPassword()
  password: string = 'Test123!';

  @ApiProperty({
    required: false,
    example: 'Fname',
    description: 'First name',
  })
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    required: false,
    example: 'Lname',
    description: 'Last name',
  })
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    required: false,
    example: 'male',
    description: 'Gender',
  })
  @IsOptional()
  @IsString()
  readonly gender: string;

  @ApiProperty({
    required: false,
    example: 'ABC pty ltd',
    description: 'Company',
  })
  @IsOptional()
  @IsString()
  readonly company: string;

  @ApiProperty({
    required: false,
    example: 'ABC street',
    description: 'Street address',
  })
  @IsOptional()
  @IsString()
  readonly streetAddress: string;

  @ApiProperty({
    required: false,
    example: 'Smithfield',
    description: 'Suburb',
  })
  @IsOptional()
  @IsString()
  readonly suburb: string;

  @ApiProperty({
    required: false,
    example: 'Sydney',
    description: 'City',
  })
  @IsOptional()
  @IsString()
  readonly city: string;

  @ApiProperty({
    required: false,
    default: 'Australia',
    description: 'Country',
  })
  @IsOptional()
  @IsString()
  readonly country: string = 'Australia';

  @ApiProperty({
    required: false,
    example: 'NSW',
    description: 'State',
  })
  @IsOptional()
  @IsString()
  readonly state: string;

  @ApiProperty({
    required: false,
    example: '2164',
    description: 'Postcode',
  })
  @IsOptional()
  @IsString()
  readonly postcode: string;

  @ApiProperty({
    required: false,
    example: '1234567890',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  readonly phone: string = '1234567890';

  @ApiProperty({
    required: false,
    example: '01-01-2000',
    description: 'Date of Birth',
  })
  @IsOptional()
  @IsString()
  readonly dateOfBirth: string;

  @ApiProperty({
    required: true,
    default: true,
    description: 'Active',
  })
  @IsBoolean()
  readonly active: boolean = true;

  @ApiProperty({
    required: true,
    example: 'bc0f36c0-376c-4395-adfa-bfe941f791e2',
    description: 'Shopping Cart UUID',
  })
  @IsString()
  readonly shoppingCartId: string;
}
