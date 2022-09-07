import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @MaxLength(100)
  email: string

  @MinLength(8)
  @MaxLength(100)
  password: string

  @MaxLength(30)
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
  @MaxLength(100)
  password?: string

  @IsOptional()
  @MaxLength(30)
  nickname?: string
}