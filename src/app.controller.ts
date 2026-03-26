import { Body, Controller, Post } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { RegisterService } from './services/register/register.service';
import { RawEntity } from './interfaces/raw-entity.interface';

@Controller()
export class AppController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async convert(@Body() body: RawEntity) {
    const service = this.registerService.resolve(body.resourceType);

    const entity = await service.init(body);

    if (entity) return instanceToPlain(entity, { exposeUnsetFields: false });
  }
}
