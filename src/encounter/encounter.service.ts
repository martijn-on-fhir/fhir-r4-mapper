import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { CodeableConcept, Coding, Encounter } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class EncounterService implements FhirResourceService<any> {
  private encounter: Encounter;

  async init(data: RawEntity): Promise<Encounter> {
    this.encounter = new Encounter({
      id: data.id,
    });

    this.appendProfile(data);
    this.setClass(data);

    if (this.validate()) return this.encounter;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.encounter.meta.addProfile(profile);
    }
  }

  setClass(data: any): void {
    if (data.main?.ContactType) {
      const ct = data.main.ContactType;

      this.encounter.class = new CodeableConcept({
        coding: [
          new Coding({
            system: ct.codestelstelOID,
            code: ct.conceptCode,
            display: ct.omschrijving,
          }),
        ],
      });
    } else {
      this.encounter.class = new CodeableConcept({
        coding: [
          new Coding({
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'OTH',
            display: 'other',
          }),
        ],
      });
    }
  }

  validate(): boolean {
    return true;
  }
}