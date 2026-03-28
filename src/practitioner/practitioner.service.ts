import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Practitioner } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class PractitionerService implements FhirResourceService<any> {
  private practitioner: Practitioner;

  async init(data: RawEntity): Promise<Practitioner> {
    this.practitioner = new Practitioner({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.practitioner;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.practitioner.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}