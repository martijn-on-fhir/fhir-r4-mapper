import { Reference } from 'fhir-models-r4';

export const appendSubject = (data: any): Reference => {

  return new Reference({
    reference: `Patient/${data.zibSubjectResourceTechID}`,
  });
}