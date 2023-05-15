import { UpdateUserResponseDto } from '@app/database/dto/update-user.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class GrpcUpdateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  birthday: string
}

export class GrpcUpdateUserResponseDto {
  status: boolean
}
