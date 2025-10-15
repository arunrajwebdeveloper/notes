import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Must be a valid email address.' })
  email: string;

  // Enforce password requirements for security
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  // Optional: Add a RegEx for complexity (e.g., requires uppercase, number, symbol)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is too weak. Must contain uppercase, lowercase, number, and symbol.',
  // })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;
}
