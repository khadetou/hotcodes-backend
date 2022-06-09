import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './roles/role.enum';
import { RolesGuard } from './roles/roles.guard';
export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(['jwt']), RolesGuard),
  );
}
