import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string

  @Expose()
  @IsString()
  birthday?: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string
}

export class CreateUserResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  id: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string

  @Expose()
  @IsString()
  birthday?: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string
}
