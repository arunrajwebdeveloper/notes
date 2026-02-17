import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register - Register a new user
   */
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.authService.register(registerUserDto);
    return { message: 'User successfully registered.' };
  }

  /**
   * POST /auth/login - Logs in a user. Uses LocalAuthGuard to execute the LocalStrategy.
   * The @Request() req object is populated with the user details from LocalStrategy validation.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req?.user, res);
  }

  /**
   * POST /auth/refresh - Refresh access token
   * Uses the refresh_token cookie to generate a new pair of tokens.
   * This allows the user to stay logged in without re-entering credentials.
   */

  @Post('refresh')
  async refresh(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req?.cookies, res);
  }

  /**
   * POST /auth/logout - Log out the user
   * Clears the access_token and refresh_token cookies from the browser.
   * This effectively ends the user session on the client side.
   */

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    return { message: 'Logged out' };
  }

  @Post('test')
  test() {
    console.log('Hello');
    return { m: 'Hellooo' };
  }

  /**
   * GET /auth/profile - Example of a protected route to get user profile.
   * Uses JwtAuthGuard to execute the JwtStrategy and validate the token.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
