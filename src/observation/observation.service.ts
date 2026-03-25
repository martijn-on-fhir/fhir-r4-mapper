import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Observation } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class ObservationService implements FhirResourceService<any> {
  
  private observation: Observation;
  
  async init(data: RawEntity): Promise<Observation> {
    this.observation = new Observation();

    return this.observation;
  }
}