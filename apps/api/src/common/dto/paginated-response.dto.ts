import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() total: number;
  @ApiProperty() totalPages: number;
}

export class PaginatedResponseDto<T> {
  data: T[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;

  static of<T>(data: T[], total: number, page: number, limit: number): PaginatedResponseDto<T> {
    const response = new PaginatedResponseDto<T>();
    response.data = data;
    response.meta = { page, limit, total, totalPages: Math.ceil(total / limit) };
    return response;
  }
}
