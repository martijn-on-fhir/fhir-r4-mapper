import { validate } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export const isValid = async <T>(value: T): Promise<boolean> => {
  const v = await validate(value as object);

  if(v.length === 0) return true;

  throw new HttpException(v.toString(), HttpStatus.NOT_ACCEPTABLE);
};
