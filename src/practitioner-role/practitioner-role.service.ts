import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { PractitionerRole } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class PractitionerRoleService implements FhirResourceService<any> {
  private practitionerRole: PractitionerRole;

  async init(data: RawEntity): Promise<PractitionerRole> {
    this.practitionerRole = new PractitionerRole({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.practitionerRole;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.practitionerRole.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}