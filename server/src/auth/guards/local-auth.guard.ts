import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'local' is the strategy name defined in LocalStrategy
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
