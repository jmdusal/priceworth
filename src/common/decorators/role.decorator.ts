import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY_METADATA } from '../contants/decorator.contants';

export const Roles = (...roles: string[]) =>
  SetMetadata(ROLE_KEY_METADATA, roles);
