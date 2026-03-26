import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Practitioner } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class PractitionerService implements FhirResourceService<any> {
  private practitioner: Practitioner;

  async init(data: RawEntity): Promise<Practitioner> {
    this.practitioner = new Practitioner({
      id: data.id,
    });

    if(this.validate())  return this.practitioner;
  }

  validate(): boolean {
    return true;
  }
}