import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { RiskAssessment } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class RiskAssessmentService implements FhirResourceService<any> {
  private riskAssessment: RiskAssessment;

  async init(data: RawEntity): Promise<RiskAssessment> {
    this.riskAssessment = new RiskAssessment({
      id: data.id,
    });

    if(this.validate())  return this.riskAssessment;
  }

  validate(): boolean {
    return true;
  }
}
