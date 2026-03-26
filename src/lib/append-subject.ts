import { Reference } from 'fhir-models-r4';
import { formatId } from './format-id';

export const appendSubject = (data: any): Reference => {

  return new Reference({
    reference: `Patient/${formatId(data.zibSubjectResourceTechID)}`,
  });
}