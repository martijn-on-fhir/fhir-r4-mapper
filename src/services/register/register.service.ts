import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FhirResourceService } from '../../interfaces/fhir-resource-service.interface';
import { FhirResource } from '../../interfaces/fhir-resource.interface';
import { resourceAliases } from '../../lib/resource-aliases';

@Injectable()
export class RegisterService {
  constructor(private moduleRef: ModuleRef) {}

  resolve(resourceType: string): FhirResourceService<FhirResource> {
    if (!resourceType) throw new HttpException('Resource type is required', HttpStatus.BAD_REQUEST);

    const name = resourceAliases.get(resourceType) ?? resourceType;
    const token = `${name}Service`;

    try {
      return this.moduleRef.get(token, { strict: false });
    } catch {
      throw new NotFoundException(`Unknown resource type: ${resourceType}`);
    }
  }
}