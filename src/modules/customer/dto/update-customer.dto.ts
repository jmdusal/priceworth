import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    required: true,
    example: 'Fname',
    description: 'First name',
  })
  @IsString()
  readonly firstName: string = 'Fname';

  @ApiProperty({
    required: true,
    example: 'Lname',
    description: 'Last name',
  })
  @IsString()
  readonly lastName: string = 'Lname';

  @ApiProperty({
    required: true,
    example: 'male',
    description: 'Gender',
  })
  @IsString()
  readonly gender: string = 'male';

  @ApiProperty({
    required: true,
    example: 'ABC pty ltd',
    description: 'Company',
  })
  @IsString()
  readonly company: string = 'ABC pty ltd';

  @ApiProperty({
    required: true,
    example: 'ABC street',
    description: 'Street address',
  })
  @IsString()
  readonly streetAddress: string = 'ABC street';

  @ApiProperty({
    required: true,
    example: 'Smithfield',
    description: 'Suburb',
  })
  @IsString()
  readonly suburb: string = 'Smithfield';

  @ApiProperty({
    required: true,
    example: 'Sydney',
    description: 'City',
  })
  @IsString()
  readonly city: string = 'Sydney';

  @ApiProperty({
    required: true,
    example: 'Australia',
    description: 'Country',
  })
  @IsString()
  readonly country: string = 'Australia';

  @ApiProperty({
    required: true,
    example: 'NSW',
    description: 'State',
  })
  @IsString()
  readonly state: string = 'NSW';

  @ApiProperty({
    required: true,
    example: '2164',
    description: 'Postcode',
  })
  @IsString()
  readonly postcode: string = '2164';

  @ApiProperty({
    required: true,
    example: '1234567890',
    description: 'Phone number',
  })
  @IsString()
  readonly phone: string = '1234567890';

  @ApiProperty({
    example: '01-01-2000',
    description: 'Date of Birth',
  })
  @IsOptional()
  @IsString()
  readonly dateOfBirth: string = '01-01-2000';
}
