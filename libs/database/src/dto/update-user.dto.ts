import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateUserResponseDto } from './create-user.dto'

export class UpdateUserRequestDto {
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
  birthday: string
}

export class UpdateUserResponseDto extends CreateUserResponseDto {}
