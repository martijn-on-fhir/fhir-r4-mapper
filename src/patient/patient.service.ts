import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Patient } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class PatientService implements FhirResourceService<any> {

  private patient: Patient;

  async init(data: RawEntity): Promise<Patient> {

    this.patient = new Patient({
      id: data.id,
    });

    if(this.validate())  return this.patient;
  }

  validate(): boolean {
    return true;
  }
}
