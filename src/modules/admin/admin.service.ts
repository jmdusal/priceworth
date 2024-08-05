import { Injectable } from '@nestjs/common';
import { Admin } from './admin.interface';
import { RedisService } from '@/shares/services/redis.service';

@Injectable()
export class AdminService {
  constructor(private redisService: RedisService) {}

  private readonly admins = [
    {
      id: 1,
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    },
  ];

  async findAdminByUserName(username: string): Promise<Admin> {
    return this.admins.find((admin) => admin.username === username);
  }

  /**
   * delete admin session
   */
  async forbidden(uid: number): Promise<void> {
    await this.redisService.getRedis().del(`admin:token:${uid}`);
  }
}
