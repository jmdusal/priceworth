import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginToken } from './admin.class';
import { LoginService } from './login/login.service';
import { LoginDto } from './dto';
import { ADMIN_PREFIX } from '@/constants/admin';

@ApiTags('Admin Module')
@Controller(ADMIN_PREFIX)
export class AdminsController {
  constructor(private loginService: LoginService) {}

  @ApiOperation({
    summary: 'Admin login',
  })
  @ApiOkResponse({ type: LoginToken })
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<LoginToken> {
    await this.loginService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
    const token = await this.loginService.getAdminLoginSign(
      dto.username,
      dto.password,
    );
    return { token };
  }
}
