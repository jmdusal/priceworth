import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class ResponseDto<T> {
  readonly data: T;

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;

  constructor(statusCode: number, data?: any, message = 'success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  static success(data?: any) {
    return new ResponseDto(200, data);
  }
}

export class Pagination {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}

export class PaginatedResponseDto<T> {
  data: Array<T>;

  @ApiProperty()
  pagination: Pagination;

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string;
}

export const ApiOkResponseData = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(ResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
      },
    }),
  );

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
