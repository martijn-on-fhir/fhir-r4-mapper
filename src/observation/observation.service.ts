import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Observation } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class ObservationService implements FhirResourceService<any> {
  async init(data: RawEntity): Promise<Observation> {
    return new Observation();
  }
}
