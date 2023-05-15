import { IsNotEmpty, IsString } from 'class-validator'

export class GrpcCreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  birthday?: string

  @IsString()
  @IsNotEmpty()
  email: string
}

export class GrpcCreateUserResponseDto {
  status: boolean
}
