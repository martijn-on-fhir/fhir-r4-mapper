import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './services/register/register.service';
import { RawEntity } from './interfaces/raw-entity.interface';
import { FhirResource } from './interfaces/fhir-resource.interface';

@Controller()
export class AppController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async convert(@Body() body: RawEntity): Promise<FhirResource> {
    const service = this.registerService.resolve(body.resourceType);
    const x = await service.init(body);

    return x;
  }
}
