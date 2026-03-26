import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Location } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class LocationService implements FhirResourceService<any> {
  private location: Location;

  async init(data: RawEntity): Promise<Location> {
    this.location = new Location({
      id: data.id,
    });

    if(this.validate())  return this.location;
  }

  validate(): boolean {
    return true;
  }
}