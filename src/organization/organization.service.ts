import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Organization } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class OrganizationService implements FhirResourceService<any> {
  private organization: Organization;

  async init(data: RawEntity): Promise<Organization> {
    this.organization = new Organization();

    return this.organization;
  }
}
