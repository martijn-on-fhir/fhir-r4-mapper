import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Identifier, Location } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';
import _ from 'lodash';

@Injectable()
export class LocationService implements FhirResourceService<any> {
  private location: Location;

  async init(data: RawEntity): Promise<Location> {
    this.location = new Location({
      id: data.id,
    });

    this.appendProfile(data);
    this.appendIdentifier();

    if (this.validate()) return this.location;
  }

  /**
   * Appends an identifier to the model if it does not already exist.
   * @returns {void}
   */
  appendIdentifier() {
    const entity = _.find(this.location.identifier, { system: 'http://www.adapcare.nl/pluriform/ak' });

    if (entity) return;

    const identifier = new Identifier({
      system: 'http://www.adapcare.nl/pluriform/ak',
      value: this.location.id,
    });

    this.location.addIdentifier(identifier);
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.location.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}