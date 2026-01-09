import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials for login (used by LocalStrategy)
   */
  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOneByEmail(email);

  //   if (user && (await bcrypt.compare(pass, user.password))) {
  //     // Destructure and return the user object without the password
  //     const { password, ...result } = user?.toObject();
  //     return result;
  //   }
  //   return null;
  // }

  async validateUser(email: string, pass: string): Promise<any> {
    // 2. Explicitly type the 'user' variable as UserDocument | null
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. 'user' is now recognized as a Mongoose Document type
    //    and the .toObject() method is available.
    const { password, ...result } = user.toObject();
    return result;
  }

  /**
   * Generates a JWT upon successful login
   */
  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user._id, // Store the MongoDB ObjectId as userId
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a new user
   */
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    // 1. Check if user already exists
    const existingUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);

    // 3. Create the user
    return this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
  }
}
