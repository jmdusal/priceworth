import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImageCaptchaDto } from '../dto';
import { ImageCaptcha } from './login.class';
import { LoginService } from './login.service';

@ApiTags('Login Module')
@Controller()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @ApiOperation({
    summary: 'Get login image verification code',
  })
  @ApiOkResponse({ type: ImageCaptcha })
  @Get('captcha/img')
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return await this.loginService.createImageCaptcha(dto);
  }
}
