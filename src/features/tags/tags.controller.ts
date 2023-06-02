import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagQuery, CreateTagInput, UpdateArticleDto, PagUserRes } from './dto/tags.dto';
import { PaginationInputs } from '../../common/common.types';

import { pick } from '../../common/util/util';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  createUser(@Body() createUserDto: CreateTagInput) {
    return this.tagsService.createOne(createUserDto);
  }

  @Get()
  async findMany(@Query() articleQuery: TagQuery): Promise<PagUserRes>  {
    const filter: PaginationInputs = { sort: 'count', ...articleQuery };
    const query = pick(articleQuery, ['type', 'restricted']);
    // { ownerId: articleQuery.ownerId, tag: articleQuery.tag };
    return this.tagsService.findMany(query, filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tagsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateArticleDto,
  ) {
    return this.tagsService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tagsService.deleteById(id);
  }

  @Get('search')
  async search(@Query('q') q: string): Promise<PagUserRes>  {
    return this.tagsService.SearchArticles(q);
  }
}
