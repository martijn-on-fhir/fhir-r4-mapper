import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { RelatedPerson } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class RelatedPersonService implements FhirResourceService<any> {
  private relatedPerson: RelatedPerson;

  async init(data: RawEntity): Promise<RelatedPerson> {
    this.relatedPerson = new RelatedPerson();

    return this.relatedPerson;
  }
}
