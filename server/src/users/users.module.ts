import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
// The UsersController is generally used for profile management,
// but we omit it here since auth handles creation/login.

@Module({
  imports: [
    // Register the User schema with Mongoose
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  // CRITICAL: Export UsersService so AuthModule can inject it
  exports: [UsersService],
})
export class UsersModule {}
