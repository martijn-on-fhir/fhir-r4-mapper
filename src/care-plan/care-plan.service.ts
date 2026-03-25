import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { CarePlan } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class CarePlanService implements FhirResourceService<any> {
  private carePlan: CarePlan;

  async init(data: RawEntity): Promise<CarePlan> {
    this.carePlan = new CarePlan();

    return this.carePlan;
  }
}