import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Coverage } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class CoverageService implements FhirResourceService<any> {
  private coverage: Coverage;

  async init(data: RawEntity): Promise<Coverage> {
    this.coverage = new Coverage({
      id: data.id,
    });

    if(this.validate())  return this.coverage;
  }

  validate(): boolean {
    return true;
  }
}
