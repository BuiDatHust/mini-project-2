import { CreateUserResponseDto } from '@app/database/dto/create-user.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class GrpcGetUserRequestDto {
  @IsString()
  @IsNotEmpty()
  id: string
}

export class GrpcGetUserResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  birthday?: string
}
