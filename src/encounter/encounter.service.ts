import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Encounter } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class EncounterService implements FhirResourceService<any> {
  private encounter: Encounter;

  async init(data: RawEntity): Promise<Encounter> {
    this.encounter = new Encounter();

    return this.encounter;
  }
}