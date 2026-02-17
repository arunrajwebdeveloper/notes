import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

// Create a custom type that includes partitioned
interface CustomCookieOptions extends CookieOptions {
  partitioned?: boolean;
  httpOnly: boolean;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Centralized method to set cookies
  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';

    const commonOptions: CustomCookieOptions = {
      httpOnly: true,
      // On Render, this MUST be true because Render uses HTTPS
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      /* Note: partitioned: true is part of a new standard (CHIPS) that allows 
      "third-party" cookies to work in a restricted "partition" 
      so they aren't blocked by privacy settings. */
      partitioned: true,
    };

    res.cookie('access_token', accessToken, {
      ...commonOptions,
      maxAge: 15 * 60 * 1000, // 15m
    });

    res.cookie('refresh_token', refreshToken, {
      ...commonOptions,
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
  }

  /**
   * Validates user credentials for login (used by LocalStrategy)
   */

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = user.toObject();
    return result;
  }

  /**
   * Generates JWT tokens
   */

  getTokens(payload: { email: string; userId: string; sub: string }) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') as any,
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION_TIME',
      ) as any,
    });
    return { accessToken, refreshToken };
  }

  /**
   * Generates a JWT upon successful login
   */

  async login(user: any, res: Response) {
    const payload = {
      email: user.email,
      userId: user._id,
      sub: user._id,
    };

    const { accessToken, refreshToken } = this.getTokens(payload);
    this.setCookies(res, accessToken, refreshToken);
    return { message: 'Logged in successfully' };
  }

  /**
   * Refresh token logic
   */

  async refresh(cookies: any, res: Response) {
    const token = cookies?.refresh_token;
    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') as any,
      });

      const newPayload = {
        sub: payload?.sub,
        userId: payload?.userId,
        email: payload?.email,
      };

      // Issue NEW tokens (Rotation)
      const { accessToken, refreshToken } = this.getTokens(newPayload);

      this.setCookies(res, accessToken, refreshToken);
      return { message: 'Tokens refreshed' };
    } catch (e) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }

  /**
   * Registers a new user
   */

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const existingUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);

    return this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
  }
}
