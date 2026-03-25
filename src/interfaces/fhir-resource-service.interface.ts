import { FhirResource } from './fhir-resource.interface';
import { RawEntity } from './raw-entity.interface';

export interface FhirResourceService<T extends FhirResource> {
  init(data: RawEntity): Promise<T>;
}
