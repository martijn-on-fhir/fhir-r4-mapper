import { FhirResource } from './fhir-resource.interface';
import { RawEntity } from './raw-entity.interface';

export interface FhirResourceService<T extends FhirResource> {
  init(data: RawEntity): Promise<T>;
  appendProfile(data: RawEntity): void;
  validate(): boolean | Promise<boolean>;
}
