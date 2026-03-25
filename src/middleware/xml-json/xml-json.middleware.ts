import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class XmlJsonMiddleware implements NestMiddleware {
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  use(req: Request, _res: Response, next: NextFunction) {
    const contentYype = (req.headers['content-type'] || req.headers['Content-Type']) as string;

    if (req.method === 'OPTIONS') {
      next();
    }

    if (contentYype.toLowerCase() !== 'application/xml') {
      throw new HttpException('Only application/xml headers are allowed', HttpStatus.NOT_ACCEPTABLE);
    }

    if (Buffer.isBuffer(req.body)) {
      req.body = this.parser.parse(req.body.toString('utf-8'));
    } else if (typeof req.body === 'string') {
      req.body = this.parser.parse(req.body);
    } else {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }

    next();
  }
}
