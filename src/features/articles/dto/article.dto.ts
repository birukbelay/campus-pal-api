import { OmitType, PartialType } from '@nestjs/swagger';
import { PaginationInput, RoleType } from '../dependencies.article';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Article } from '../entities/article.entity';

export class CreateArticleInput {
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: string

  @IsOptional()
  coverImage?: string;

  @IsOptional()
  active?: boolean;

  @IsNotEmpty()
  tags: string[];

  @IsOptional()
  refs: string[];
}

export class UpdateArticlesDto extends OmitType(Article, [
  'ownerId',
  '_id',
] as const) {}

export class UpdateArticleDto extends PartialType(CreateArticleInput) {}

export class PagUserRes {
  count: number;

  users: Article[];
}

export class ArticleQuery {
  @IsOptional()
  tag?: string;
  @IsOptional()
  ownerId?: string;
  @IsOptional()
  limit?: number;
  @IsOptional()
  page?: number;
  @IsOptional()
  sort?: string = 'importance';
}

export class ArticleResp{
  count: number

  data: Article[]

}