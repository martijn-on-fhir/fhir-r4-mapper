import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FhirResourceService } from '../../interfaces/fhir-resource-service.interface';
import { FhirResource } from '../../interfaces/fhir-resource.interface';

@Injectable()
export class RegisterService {
  constructor(private moduleRef: ModuleRef) {}

  resolve(resourceType: string): FhirResourceService<FhirResource> {
    try {
      return this.moduleRef.get(`${resourceType}Service`, { strict: false });
    } catch {
      throw new NotFoundException(`Unknown resource type: ${resourceType}`);
    }
  }
}