import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register - Register a new user
   */
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.authService.register(registerUserDto);
    // You could return the token here, but returning a success message is cleaner.
    return { message: 'User successfully registered.' };
  }

  /**
   * POST /auth/login - Logs in a user. Uses LocalAuthGuard to execute the LocalStrategy.
   * The @Request() req object is populated with the user details from LocalStrategy validation.
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // req.user is populated by LocalStrategy's validate method
    return this.authService.login(req.user);
  }

  /**
   * GET /auth/profile - Example of a protected route to get user profile.
   * Uses JwtAuthGuard to execute the JwtStrategy and validate the token.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user is populated by JwtStrategy's validate method
    return req.user;
  }
}
