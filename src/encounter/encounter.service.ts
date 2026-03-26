import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { CodeableConcept, Coding, Encounter } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class EncounterService implements FhirResourceService<any> {
  private encounter: Encounter;

  async init(data: RawEntity): Promise<Encounter> {
    this.encounter = new Encounter({
      id: data.id,
    });

    this.setClass(data);

    if(this.validate())  return this.encounter;
  }

  setClass(data: any): void {

    if(data.main?.ContactType){
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