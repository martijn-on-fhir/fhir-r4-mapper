import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { RegisterService } from './services/register/register.service';
import { RawEntity } from './interfaces/raw-entity.interface';
import { OAuthGuard } from './guards/oauth.guard';

@Controller()
@UseGuards(OAuthGuard)
export class AppController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async convert(@Body() body: RawEntity) {
    const service = this.registerService.resolve(body.resourceType);

    const entity = await service.init(body);

    if (entity) return instanceToPlain(entity, { exposeUnsetFields: false });
  }
}
