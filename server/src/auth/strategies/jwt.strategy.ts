import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * The payload is the decoded JWT.
   * Whatever this returns will be attached to 'req.user'.
   */

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId, // Match the key used in AuthService login payload
      email: payload.email,
      sub: payload.sub,
    };
  }
}
