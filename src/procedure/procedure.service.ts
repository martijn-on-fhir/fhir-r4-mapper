import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Procedure } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class ProcedureService implements FhirResourceService<any> {
  private procedure: Procedure;

  async init(data: RawEntity): Promise<Procedure> {
    this.procedure = new Procedure({
      id: data.id,
    });

    if(this.validate())  return this.procedure;
  }

  validate(): boolean {
    return true;
  }
}
