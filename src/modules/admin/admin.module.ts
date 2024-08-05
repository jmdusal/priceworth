import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginService } from './login/login.service';
import { AdminsController } from './admin.controller';
import { LoginController } from './login/login.controller';

@Module({
  controllers: [AdminsController, LoginController],
  providers: [AdminService, LoginService],
  exports: [AdminService, LoginService],
})
export class AdminModule {}
