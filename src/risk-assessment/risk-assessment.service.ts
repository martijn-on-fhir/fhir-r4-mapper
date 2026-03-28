import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { RiskAssessment } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class RiskAssessmentService implements FhirResourceService<any> {
  private riskAssessment: RiskAssessment;

  async init(data: RawEntity): Promise<RiskAssessment> {
    this.riskAssessment = new RiskAssessment({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.riskAssessment;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.riskAssessment.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}
