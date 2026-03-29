import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Goal, Identifier } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';
import _ from 'lodash';

@Injectable()
export class GoalService implements FhirResourceService<any> {
  private goal: Goal;

  async init(data: RawEntity): Promise<Goal> {
    this.goal = new Goal({
      id: data.id,
    });

    this.appendProfile(data);
    this.appendIdentifier();

    if (this.validate()) return this.goal;
  }

  /**
   * Appends an identifier to the model if it does not already exist.
   * @returns {void}
   */
  appendIdentifier() {
    const entity = _.find(this.goal.identifier, { system: 'http://www.adapcare.nl/pluriform/ak' });

    if (entity) return;

    const identifier = new Identifier({
      system: 'http://www.adapcare.nl/pluriform/ak',
      value: this.goal.id,
    });

    this.goal.addIdentifier(identifier);
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