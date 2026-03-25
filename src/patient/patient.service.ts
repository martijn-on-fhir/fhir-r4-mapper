import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Patient } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class PatientService implements FhirResourceService<any> {

  async init(data: RawEntity): Promise<Patient> {
    return new Patient();
  }
}
