import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Consent } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class ConsentService implements FhirResourceService<any> {
  private consent: Consent;

  async init(data: RawEntity): Promise<Consent> {
    this.consent = new Consent({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.consent;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.consent.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}