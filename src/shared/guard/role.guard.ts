import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../modules/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) return false;

    const userRoles = `[ '${user.role}' ]`;

    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return false;
    }

    return this.validateRoles(roles, userRoles);
  }
  validateRoles(roles: string[], userRoles: string) {
    return roles.some((role) => userRoles.includes(role));
  }
}
