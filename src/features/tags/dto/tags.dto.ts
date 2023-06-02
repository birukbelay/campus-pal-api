import { OmitType, PartialType } from '@nestjs/swagger';
import { PaginationInput, RoleType } from '../tags.dependencies';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Tag } from '../entities/tags.entity';
import { Prop } from '@nestjs/mongoose';

export class CreateTagInput {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  coverImage?: string;

  @IsOptional()
  restricted?: boolean;
}

export class UpdateArticlesDto extends OmitType(Tag, [
  'restricted',
  '_id',
] as const) {}

export class UpdateArticleDto extends PartialType(CreateTagInput) {}

export class PagUserRes {
  count: number;

  data: Tag[];
}

export class TagQuery {
  @IsOptional()
  type?: string;
  @IsOptional()
  restricted?: boolean = false;
  @IsOptional()
  limit?: number;
  @IsOptional()
  page?: number;
  @IsOptional()
  sort?: string = 'count';
}
