import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Annotation, CodeableConcept, Coding, Observation, ObservationComponent, Period, Quantity } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { appendSubject } from '../lib/append-subject';
import * as _ from 'lodash';
import { isVitalSign } from '../lib/is-vital-sign';

/**
 * Service responsible for mapping raw ZIB (Zorginformatiebouwstenen) entities
 * to FHIR R4 Observation resources.
 */
@Injectable()
export class ObservationService implements FhirResourceService<any> {
  /** The FHIR Observation resource being constructed. */
  private observation: Observation;

  /**
   * Initializes and builds a FHIR Observation from raw ZIB data.
   * @param data - The raw entity containing ZIB source data.
   * @returns The fully mapped FHIR Observation resource.
   */
  async init(data: RawEntity): Promise<Observation> {
    this.observation = new Observation({
      id: data.id,
    });

    this.setStatus(data);
    this.setSubject(data);
    this.setCategory(data);
    this.setValueQuantity(data);
    this.setValueCodeableConcept(data);
    this.setCode(data);
    this.setEffectiveDateTime(data);
    this.setEffectivePeriod(data);
    this.setBodySite(data);
    this.setComponents(data);
    this.setComment(data);

    if (this.validate()) return this.observation;
  }

  /**
   * Sets the observation status from the ZIB ObservationStatus concept code.
   * Defaults to 'final' if no status is provided.
   * @param data - The raw entity containing ZIB source data.
   */
  setStatus(data: RawEntity) {
    const status = _.get(data.main.ObservationStatus, 'conceptCode', 'final');

    this.observation.status = status;
  }

  /**
   * Sets the effective period for AlcoholUse observations using the
   * WaarnemingGebruik start and end dates.
   * @param data - The raw entity containing ZIB source data.
   */
  setEffectivePeriod(data: RawEntity) {
    if (data.source === 'AlcoholUse' || data.source === 'DrugsUse') {
      const ob = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];
      const waarneming = _.find(ob, (a: any) => {
        return a.zibObjectDef === 'WaarnemingGebruik';
      });

      if (waarneming) {
        this.observation.effectivePeriod = new Period({
          start: `${waarneming.StartDatum || undefined}`,
          end: waarneming.EindDatum ? `${waarneming.EindDatum}` : undefined,
        });
      }
    }
  }

  /**
   * Sets the effective date/time from the first zibObject containing UitslagDatumTijd.
   * @param data - The raw entity containing ZIB source data.
   */
  setEffectiveDateTime(data): void {
    let dt;

    if (Array.isArray(data.main.zibObject)) {
      dt = _.find(data.main.zibObject, (a: any) => {
        return a.UitslagDatumTijd;
      });
    } else {
      dt = data.main.zibObject;
    }

    if (dt && dt.UitslagDatumTijd) {
      this.observation.effectiveDateTime = dt.UitslagDatumTijd;
    }
  }

  /** Mapping of ZIB source types to their corresponding zibObjectDef and UCUM unit definitions. */
  private static readonly valueQuantityMap: Record<string, { zibObjectDef: string; unit: string; code: string }> = {
    BodyHeight: { zibObjectDef: 'LengteWaarde', unit: 'cm', code: 'cm' },
    BodyTemperature: { zibObjectDef: 'TemperatuurGrC', unit: 'Cel', code: 'Cel' },
    BodyWeight: { zibObjectDef: 'GewichtWaarde', unit: 'kg', code: 'kg' },
  };

  async setValueCodeableConcept(data: RawEntity): Promise<void> {
    if (data.source === 'DrugsUse') {
      this.observation.valueCodeableConcept = new CodeableConcept({
        coding: [
          new Coding({
            system: 'http://snomed.info/sct',
            code: '228366006',
            display: 'bevinding betreffende drugsgebruik (bevinding)',
          }),
        ],
      });
    }
  }

  /**
   * Sets the value quantity based on the ZIB source type using {@link valueQuantityMap}.
   * Looks up the matching zibObject and maps it to a FHIR Quantity with UCUM units.
   * @param data - The raw entity containing ZIB source data.
   */
  setValueQuantity(data: RawEntity) {
    const config = ObservationService.valueQuantityMap[data.source];
    if (!config) return;

    const objects = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];
    const entity = objects.find((a: any) => a?.zibObjectDef === config.zibObjectDef);
    if (!entity) return;

    this.observation.valueQuantity = new Quantity({
      value: entity.UitslagWaarde,
      unit: config.unit,
      system: 'http://unitsofmeasure.org',
      code: config.code,
    });
  }

  /** Mapping of ZIB source types to their LOINC coding definitions. */
  private static readonly codeMap: Record<string, { code: string; display: string }[]> = {
    BodyHeight: [
      { code: '8302-2', display: 'Body height' },
      { code: '8308-9', display: 'Body height --standing' },
    ],
    BodyTemperature: [{ code: '8310-5', display: 'Body temperature' }],
    BodyWeight: [{ code: '29463-7', display: 'Body weight' }],
    AlcoholUse: [{ code: '228273003', display: 'Bevinding betreffende alcoholgebruike' }],
    DrugsUse: [{ code: '228366006', display: 'Bevinding betreffende drugsgebruik ' }],
    FamilySituation: [{ code: '365470003', display: 'Bevinding betreffende gegevens over gezin en gezinssamenstelling' }],
  };

  /**
   * Sets the observation code using LOINC codings from {@link codeMap}.
   * @param data - The raw entity containing ZIB source data.
   */
  setCode(data: RawEntity) {
    const codings = ObservationService.codeMap[data.source];
    if (!codings) return;

    this.observation.code = new CodeableConcept({
      coding: codings.map((c) => new Coding({ system: 'http://loinc.org', code: c.code, display: c.display })),
    });
  }

  /**
   * Sets the observation category to 'vital-signs' if the source is a vital sign type.
   * @param data - The raw entity containing ZIB source data.
   */
  setCategory(data: RawEntity): void {
    if (data.source && isVitalSign(data.source)) {
      this.observation.category = [
        new CodeableConcept({
          coding: [
            new Coding({
              system: 'http://hl7.org/fhir/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            }),
          ],
        }),
      ];
    }

    if (data.source === 'AlcoholUse' || data.source === 'DrugsUse' || data.source === 'FamilySituation') {
      this.observation.addCategory(
        new CodeableConcept({
          coding: [
            new Coding({
              system: 'http://hl7.org/fhir/observation-category',
              code: 'social-history',
              display: 'Social History',
            }),
          ],
        }),
      );
    }
  }

  /**
   * Sets the observation subject as a Patient reference.
   * @param data - The raw entity containing ZIB source data.
   */
  setSubject(data: RawEntity): void {
    this.observation.subject = appendSubject(data.subject);
  }

  /**
   * Sets the observation note from the ZIB Toelichting (comment) field.
   * @param data - The raw entity containing ZIB source data.
   */
  setComment(data: RawEntity): void {
    if (data.main.Toelichting || data.main.ToelichtingGezinssituatie) {
      this.observation.note = [
        new Annotation({
          text: data.main.Toelichting,
        }),
      ];
    }

    const entity = _.find(data.main.zibObject, (a: any) => {
      return a.zibObjectDef === 'Toelichting';
    });

    if (entity) {
      this.observation.addNote(
        new Annotation({
          text: entity.UitslagWaarde,
        }),
      );
    }
  }

  /**
   * Sets the body site for BloodPressure observations using SNOMED CT coding
   * from the MeetLocatie (measurement location) zibObject.
   * @param data - The raw entity containing ZIB source data.
   */
  setBodySite(data: RawEntity): void {
    if (data.source === 'BloodPressure' && isVitalSign(data.source)) {
      const location = _.find(data.main.zibObject, (a: any) => {
        return a.MetingNaam === 'MeetLocatie';
      });

      if (location && location.UitslagWaarde) {
        const entity = location.UitslagWaarde;

        this.observation.bodySite = new CodeableConcept({
          coding: [
            new Coding({
              system: 'http://snomed.info/sct',
              code: `${entity.conceptCode}`,
              display: `${entity.conceptNaam}`,
            }),
          ],
        });
      }
    }
  }

  /**
   * Delegates component mapping based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  setComponents(data: RawEntity): void {
    switch (data.source) {
      case 'BloodPressure': {
        this.addBloodPressureMeasurements(data);
        break;
      }

      case 'BodyWeight': {
        this.addBodyWeightMeasurements(data);
        break;
      }

      case 'AlcoholUse': {
        this.addAlcoholUseMeasurements(data);
        break;
      }

      case 'DrugsUse': {
        this.addDrugsUseMeasurements(data);
        break;
      }

      case 'FamilySituation': {
        this.addFamilySituationMeasurements(data);
      }
    }
  }

  addFamilySituationMeasurements(data: RawEntity): void {

    const ob = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];

    if(!ob) return;

    const dg = _.filter(ob, (a: any) => {
      return a.zibObjectDef === 'Kind' || a.zibObjectDef === 'Burgelijkestaat';
    });
    const kind = _.filter(ob, (a: any) => a.zibObjectDef === 'Kind');
    const status = _.filter(ob, (a: any) => a.zibObjectDef === 'Burgelijkestaat');

    for(const concept of kind){
      const dummy = null
    }

    const dummy = null
  };

  /**
   * Adds DrugsUse components (drug type, administration route, usage status)
   * as coded Observation components using their source code system.
   * @param data - The raw entity containing ZIB source data.
   */
  addDrugsUseMeasurements(data: RawEntity) {
    const ob = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];
    const dg = _.find(ob, (a: any) => a.zibObjectDef === 'DrugsGebruik');

    if (!dg) return;

    const { DrugsOfGeneesmiddelSoort, Toedieningsweg, DrugsGebruikStatus } = dg;

    for (const concept of [DrugsOfGeneesmiddelSoort, Toedieningsweg, DrugsGebruikStatus]) {
      if (!concept) continue;

      this.observation.addComponent(
        new ObservationComponent({
          code: new CodeableConcept({
            coding: [
              new Coding({
                system: concept.codestelstelOID,
                code: `${concept.conceptCode}`,
                display: concept.conceptNaam,
              }),
            ],
          }),
        }),
      );
    }

    if (dg.Toelichting) {
      this.observation.addNote(
        new Annotation({
          text: dg.Toelichting,
        }),
      );
    }
  }

  /**
   * Adds alcohol use components including usage status (SNOMED CT coded)
   * and consumption frequency as a valueQuantity.
   * @param data - The raw entity containing ZIB source data.
   */
  addAlcoholUseMeasurements(data: RawEntity): void {
    const ob = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];
    const status = _.find(ob, (a: any) => {
      return a.zibObjectDef === 'AlcoholGebruikStatus';
    });
    const waarneming = _.find(ob, (a: any) => {
      return a.zibObjectDef === 'WaarnemingGebruik';
    });
    let valueQuantity: Quantity;

    if (waarneming) {
      const getValueQuantity = (entity): any => {
        return {
          value: entity['AantalKeer'],
          unit: `${entity['Per']}`,
          codeValue: `${entity['AantalKeer']}/${entity['Per']}`,
        };
      };

      const frequentie = getValueQuantity(waarneming);

      if (frequentie) {
        valueQuantity = new Quantity({
          value: frequentie.value,
          unit: frequentie.unit,
          system: 'http://unitsofmeasure.org',
          code: frequentie.codeValue,
        });
      }
    }

    if (status && status.Toelichting) {
      this.observation.addNote(
        new Annotation({
          text: status.Toelichting,
        }),
      );
    }

    if (status) {
      const { conceptCode, conceptNaam } = status.AlcoholGebruikStatus;

      this.observation.addComponent(
        new ObservationComponent({
          code: new CodeableConcept({
            coding: [
              new Coding({
                system: 'http://snomed.info/sct',
                code: conceptCode,
                display: conceptNaam,
              }),
            ],
          }),
          valueQuantity,
        }),
      );
    }
  }

  /**
   * Adds clothing (Kleding) as an Observation component for BodyWeight measurements,
   * using the coded value from the zibObject.
   * @param data - The raw entity containing ZIB source data.
   */
  addBodyWeightMeasurements(data: RawEntity): void {
    const objects = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];
    const measurements = objects.filter((a: any) => a?.zibObjectDef === 'Kleding');

    for (const measurement of measurements) {
      this.observation.addComponent(
        new ObservationComponent({
          code: new CodeableConcept({
            coding: [
              new Coding({
                system: _.get(measurement.UitslagWaarde, 'codestelstelOID'),
                code: _.get(measurement.UitslagWaarde, 'conceptCode'),
                display: _.get(measurement.UitslagWaarde, 'conceptNaam'),
              }),
            ],
          }),
        }),
      );
    }
  }

  /**
   * Adds systolic, diastolic, and mean blood pressure as Observation components
   * with LOINC codings and mmHg quantities.
   * @param data - The raw entity containing ZIB source data.
   */
  private static readonly bloodPressureComponentMap: Record<string, { code: string; display: string }> = {
    SystolischeBloeddruk: { code: '8480-6', display: 'Systolic blood pressure' },
    DiastolischeBloeddruk: { code: '8462-4', display: 'Diastolic blood pressure' },
    GemiddeldeBloeddruk: { code: 'nog te doen', display: 'nog te doen' },
  };

  addBloodPressureMeasurements(data: RawEntity): void {
    const objects = Array.isArray(data.main.zibObject) ? data.main.zibObject : [data.main.zibObject];
    const measurements = objects.filter((a: any) => a?.zibObjectDef in ObservationService.bloodPressureComponentMap);

    for (const measurement of measurements) {
      const { code, display } = ObservationService.bloodPressureComponentMap[measurement.zibObjectDef];

      this.observation.addComponent(
        new ObservationComponent({
          code: new CodeableConcept({
            coding: [new Coding({ system: 'http://loinc.org', code, display })],
          }),
          valueQuantity: new Quantity({
            value: +measurement.UitslagWaarde,
            unit: 'mmHg',
            system: 'http://unitsofmeasure.org',
            code: 'mm[Hg]',
          }),
        }),
      );
    }
  }

  /**
   * Sets a dataAbsentReason of 'unknown' when no valueQuantity is present on the observation.
   */
  addAbsentReason(): void {
    if (!this.observation.valueQuantity) {
      this.observation.dataAbsentReason = new CodeableConcept({
        coding: [
          new Coding({
            system: 'http://hl7.org/fhir/data-absent-reason',
            code: 'unknown',
            display: 'Unknown',
          }),
        ],
      });
    }
  }

  /**
   * Validates the constructed Observation resource.
   * @returns `true` if the observation is valid.
   */
  validate(): boolean {
    return true;
  }
}
