import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Consent } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class ConsentService implements FhirResourceService<any> {
  private consent: Consent;

  async init(data: RawEntity): Promise<Consent> {
    this.consent = new Consent();

    return this.consent;
  }
}