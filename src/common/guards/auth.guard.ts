import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty, isEqual } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { ROLE_KEY_METADATA } from '../contants/decorator.contants';
// import { ADMIN_USER } from '@/constants/admin';
import { ADMIN_USER } from '../../constants/admin';
// import { CUSTOMER_USER } from '@/constants/customer';
import { CUSTOMER_USER } from '../../constants/customer';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLE_KEY_METADATA,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] as string;
    if (isEmpty(token)) {
      throw new UnauthorizedException('token is empty');
    }
    try {
      // Mount the object to the current request
      request.user = this.jwtService.verify(token);
    } catch (e) {
      // Unable to pass token verification
      throw new UnauthorizedException('token is unacceptable');
    }
    if (isEmpty(request.user)) {
      throw new UnauthorizedException('token is empty');
    }
    if (!requiredRoles.includes(request.user.role)) {
      throw new UnauthorizedException('no permission');
    }
    if (isEqual(request.user.role, ADMIN_USER)) {
      return true;
    }

    if (isEqual(request.user.role, CUSTOMER_USER)) {

      const userId = request.user.id; 
      const paramId = request.params.id; 

      if (!isEqual(userId.toString(), paramId)) {
        throw new UnauthorizedException('User ID does not match with the requested resource ID');
      }
    }
    return true;
  }
}
