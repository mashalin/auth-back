import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  readonly email: string;

  @IsString({ message: 'Should be a string' })
  @Length(4, 16, { message: 'Not less than 4, not more than 16' })
  readonly password: string;
}
