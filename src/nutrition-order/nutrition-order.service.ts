import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { NutritionOrder } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class NutritionOrderService implements FhirResourceService<any> {
  private nutritionOrder: NutritionOrder;

  async init(data: RawEntity): Promise<NutritionOrder> {
    this.nutritionOrder = new NutritionOrder({
      id: data.id,
    });

    if(this.validate())  return this.nutritionOrder;
  }

  validate(): boolean {
    return true;
  }
}
