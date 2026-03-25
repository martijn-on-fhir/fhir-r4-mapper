import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Flag } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class FlagService implements FhirResourceService<any> {
  private flag: Flag;

  async init(data: RawEntity): Promise<Flag> {
    this.flag = new Flag();

    return this.flag;
  }
}
