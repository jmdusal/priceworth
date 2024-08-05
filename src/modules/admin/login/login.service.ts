import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'lodash';
import * as svgCaptcha from 'svg-captcha';
import { UtilService } from '@/shares/services/util.service';
import { RedisService } from '@/shares/services/redis.service';
import { ImageCaptchaDto } from '../dto';
import { ImageCaptcha } from './login.class';
import { AdminService } from '../admin.service';
import { ADMIN_USER } from '@/constants/admin';

@Injectable()
export class LoginService {
  constructor(
    private redisService: RedisService,
    private util: UtilService,
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  /**
   * Create verification code and cache it into redis cache
   * @param captcha image length and width
   * @returns svg & id obj
   */
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: this.util.generateUUID(),
    };
    // 5 minutes expiration time
    await this.redisService
      .getRedis()
      .set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
    return result;
  }

  /**
   * Verify verification code
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redisService
      .getRedis()
      .get(`admin:captcha:img:${id}`);
    if (isEmpty(result) || code.toLowerCase() !== result.toLowerCase()) {
      throw new BadRequestException('Invalid or expired captcha.');
    }
    // Remove the verification code after successful verification
    await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  /**
   * Get login JWT
   * If null is returned, the account password is incorrect and the user does not exist.
   */
  async getAdminLoginSign(username: string, password: string): Promise<string> {
    const admin = await this.adminService.findAdminByUserName(username);
    if (isEmpty(admin)) {
      throw new UnauthorizedException(
        'Admin account not found or password incorrect.',
      );
    }

    if (admin.password !== password) {
      throw new UnauthorizedException(
        'Admin account not found or password incorrect.',
      );
    }

    const jwtSign = this.jwtService.sign({
      uid: parseInt(admin.id.toString()),
      role: ADMIN_USER,
    });

    await this.redisService
      .getRedis()
      .set(`admin:token:${admin.id}`, jwtSign, 'EX', 60 * 60 * 24);
    return jwtSign;
  }

  /**
   * clear login status information
   */
  async clearLoginStatus(uid: number): Promise<void> {
    await this.adminService.forbidden(uid);
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:token:${id}`);
  }

  async getRedisPermsById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:perms:${id}`);
  }
}
