import { ApiProperty } from '@nestjs/swagger';

export class LoginToken {
  @ApiProperty({ description: 'JWT identity Token' })
  token: string;
}
