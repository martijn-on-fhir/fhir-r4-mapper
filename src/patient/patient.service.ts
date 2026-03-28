import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Patient } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class PatientService implements FhirResourceService<any> {
  private patient: Patient;

  async init(data: RawEntity): Promise<Patient> {
    this.patient = new Patient({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.patient;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.patient.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}
