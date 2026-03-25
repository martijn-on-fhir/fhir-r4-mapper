import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Goal } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class GoalService implements FhirResourceService<any> {
  private goal: Goal;

  async init(data: RawEntity): Promise<Goal> {
    this.goal = new Goal();

    return this.goal;
  }
}