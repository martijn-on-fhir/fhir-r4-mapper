import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { CarePlan } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { isValid } from '../lib/is-valid';

@Injectable()
export class CarePlanService implements FhirResourceService<any> {
  private carePlan: CarePlan;

  async init(data: RawEntity): Promise<CarePlan> {
    this.carePlan = new CarePlan({
      id: data.id,
    });

    if (await isValid(this.carePlan)) return this.carePlan;
  }

  async validate(): Promise<boolean>{
    if(await isValid<CarePlan>(this.carePlan)) return true
  }
}