import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header (Bearer token)
      ignoreExpiration: false, // JWT expiration should be enforced
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // The payload is the decoded JWT
  async validate(payload: any) {
    return {
      userId: payload.userId, // The MongoDB ObjectId we stored
      email: payload.email,
    };
    // This object is attached to 'req.user'
  }
}
