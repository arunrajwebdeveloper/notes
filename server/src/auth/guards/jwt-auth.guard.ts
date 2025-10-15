import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt' is the strategy name defined in JwtStrategy
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
