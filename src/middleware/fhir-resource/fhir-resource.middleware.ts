import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { formatId } from '../../lib/format-id';
import { resourceAliases } from '../../lib/resource-aliases';

@Injectable()
export class FhirResourceMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {

      const { zibDef, zibID, zibSubject, zibMainPart } = req.body.zibBundle.zib;
      const alias = resourceAliases.get(zibDef);

      req.body = {
        id: formatId(zibID),
        resourceType: alias?.type || zibDef,
        source: zibDef,
        subject: zibSubject,
        main: zibMainPart,
      };
    }

    next();
  }
}
