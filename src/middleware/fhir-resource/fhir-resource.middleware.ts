import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FhirResourceMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
      const { zibDef, zibID, zibSubject, zibMainPart } = req.body.zibBundle.zib;

      req.body = {
        id: this.setId(zibID),
        resourceType: zibDef,
        subject: zibSubject,
        main: zibMainPart,
      };
    }

    next();
  }

  private setId(id: string) {
    return id.replaceAll(/(::)/g, '.');
  }
}
