import { IsOptional, Length, Min } from 'class-validator'

export class CreateTagDto {
  @Length(1, 30)
  name: string

  @IsOptional()
  @Min(0)
  sort_order?: number
}