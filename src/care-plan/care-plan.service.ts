import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { CarePlan, Identifier } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { isValid } from '../lib/is-valid';
import { Profiles } from '../lib/profiles';
import * as _ from 'lodash';

@Injectable()
export class CarePlanService implements FhirResourceService<any> {
  private carePlan: CarePlan;

  async init(data: RawEntity): Promise<CarePlan> {
    this.carePlan = new CarePlan({
      id: data.id,
    });

    this.appendProfile(data);
    this.appendIdentifier();

    if (await isValid(this.carePlan)) return this.carePlan;
  }

  /**
   * Appends an identifier to the model if it does not already exist.
   * @returns {void}
   */
  appendIdentifier() {
    const entity = _.find(this.carePlan.identifier, { system: 'http://www.adapcare.nl/pluriform/ak' });

    if (entity) return;

    const identifier = new Identifier({
      system: 'http://www.adapcare.nl/pluriform/ak',
      value: this.carePlan.id,
    });

    this.carePlan.addIdentifier(identifier);
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.carePlan.meta.addProfile(profile);
    }
  }

  async validate(): Promise<boolean> {
    if (await isValid<CarePlan>(this.carePlan)) return true;
  }
}