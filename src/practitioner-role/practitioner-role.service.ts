import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { PractitionerRole } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class PractitionerRoleService implements FhirResourceService<any> {
  private practitionerRole: PractitionerRole;

  async init(data: RawEntity): Promise<PractitionerRole> {
    this.practitionerRole = new PractitionerRole({
      id: data.id,
    });

    if(this.validate())  return this.practitionerRole;
  }

  validate(): boolean {
    return true;
  }
}