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
import { ArticleService } from './article.service';
import {
  ArticleQuery,
  CreateArticleInput,
  UpdateArticleDto,
} from './dto/article.dto';
import { PaginationInputs } from '../../common/common.types';
import { RegisterUserInput } from '../users';
import { pick } from '../../common/util/util';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  createUser(@Body() createUserDto: CreateArticleInput) {
    return this.articleService.createOne(createUserDto);
  }

  @Get()
  async findMany(@Query() articleQuery: ArticleQuery) {
    const filter: PaginationInputs = { sort: 'importance', ...articleQuery };
    const query = pick(articleQuery, ['ownerId', 'tag']);
    // { ownerId: articleQuery.ownerId, tag: articleQuery.tag };
    return this.articleService.findMany(query, filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateArticleDto,
  ) {
    return this.articleService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articleService.deleteById(id);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.articleService.SearchArticles(q);
  }

  @Post(':articleId/up/:userId')
  async upVote(
    @Param('userId') userId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.articleService.UpVote(articleId, userId);
  }
  @Post(':articleId/down/:userId')
  async downVote(
    @Param('userId') userId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.articleService.DownVote(articleId, userId);
  }
}
