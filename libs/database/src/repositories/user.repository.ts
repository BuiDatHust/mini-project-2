import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { InjectDataSource } from '@nestjs/typeorm'
import { MINI_PROJECT_CONNECTION } from '../constant'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { sleep } from '@app/common/utils/utils'
import { CreateUserRequestDto } from '../dto/create-user.dto'
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from '../dto/update-user.dto'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectDataSource(MINI_PROJECT_CONNECTION)
    protected readonly dataSource: DataSource,
    @InjectPinoLogger(UserRepository.name)
    private readonly logger: PinoLogger,
  ) {
    super(User, dataSource.createEntityManager())
  }

  getTableName(): string {
    return this.manager.connection.getMetadata(User).tableName
  }

  async getById(id: string): Promise<User | null> {
    return this.findOne({
      where: { id },
    })
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
    })
  }

  async updateUserById(
    id: string,
    updateUser: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto | null> {
    await this.createQueryBuilder()
      .update()
      .where({
        id,
      })
      .set(updateUser)
      .execute()

    return this.findOne({ where: { id } })
  }

  async createUser(
    createUser: CreateUserRequestDto,
    failedCounts = 0,
  ): Promise<boolean> {
    try {
      const userEntity = this.create(createUser)
      console.log(userEntity)
      await this.insert(userEntity)
      return true
    } catch (error) {
      if (error?.code === 'ER_DUP_ENTRY') {
        return true
      }
      if (++failedCounts >= 3) {
        this.logger.error(error)
        return false
      }
      await sleep(failedCounts * 1000)
      return this.createUser(createUser, failedCounts)
    }
  }
}
