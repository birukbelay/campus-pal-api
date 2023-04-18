import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
import { RegisterUserInput, UpdateMeDto } from './dto/user.mut.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}
  //FIXME this function is to be removed
  @Post()
  createUser(@Body() createUserDto: RegisterUserInput) {
    return this.usersService.createOne(createUserDto);
  }

  @Get()
  async findMany() {
    return this.usersService.findMany({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateMeDto) {
    return this.usersService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteById(id);
  }
}
