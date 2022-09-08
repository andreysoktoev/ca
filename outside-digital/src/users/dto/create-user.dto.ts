import { IsEmail, IsOptional, Length, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @MaxLength(100)
  email: string

  @Length(8, 100)
  password: string

  @Length(1, 30)
  nickname: string
}

export class Credentials {
  email: string
  password: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string

  @IsOptional()
  @MinLength(8)
  @Length(8, 100)
  password?: string

  @IsOptional()
  @Length(1, 30)
  nickname?: string
}