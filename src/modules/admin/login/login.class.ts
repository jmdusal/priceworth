import { ApiProperty } from '@nestjs/swagger';

export class ImageCaptcha {
  @ApiProperty({
    description: 'svg image in base64 format',
  })
  img: string;

  @ApiProperty({
    description: 'The unique ID corresponding to the verification code',
  })
  id: string;
}
