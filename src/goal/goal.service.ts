import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Goal } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class GoalService implements FhirResourceService<any> {
  private goal: Goal;

  async init(data: RawEntity): Promise<Goal> {
    this.goal = new Goal({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.goal;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.goal.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}