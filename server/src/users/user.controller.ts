import {
  Controller,
  Get,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  /**
   * GET /api/user/me
   * Fetches the profile of the currently authenticated user.
   */

  @Get('me')
  async getMe(@Req() req): Promise<UserDocument | null> {
    const userId = req.user.userId;
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('Authenticated user not found.');
    }

    const { password, ...userObject } = user?.toObject();
    return userObject as UserDocument;
  }
}
