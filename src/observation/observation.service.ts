import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Annotation, CodeableConcept, Coding, Observation, ObservationComponent, Quantity } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { appendSubject } from '../lib/append-subject';
import * as _ from 'lodash';
import { isVitalSign } from '../lib/is-vital-sign';

@Injectable()
export class ObservationService implements FhirResourceService<any> {
  private observation: Observation;

  async init(data: RawEntity): Promise<Observation> {
    this.observation = new Observation({
      id: data.id,
    });

    this.setStatus(data);
    this.setSubject(data);
    this.setCategory(data);
    this.setValueQuantity(data);
    this.setCode(data);
    this.setEffectiveDateTime(data);
    this.setBodySite(data);
    this.setComponents(data);
    this.setComment(data);

    if (this.validate()) return this.observation;
  }

  setStatus(data: RawEntity) {
    const status = _.get(data.main.ObservationStatus, 'conceptCode', 'final');

    this.observation.status = status;
  }

  setEffectiveDateTime(data): void {

    let dt

    if(Array.isArray(data.main.zibObject)) {
      dt = _.find(data.main.zibObject, (a: any) => {
        return a.UitslagDatumTijd;
      });
    } else {
      dt = data.main.zibObject
    }

    if (dt && dt.UitslagDatumTijd) {
      this.observation.effectiveDateTime = dt.UitslagDatumTijd;
    }
  }

  setValueQuantity(data: RawEntity) {
    if (data.source === 'BodyHeight') {

      let entity;

      if (Array.isArray(data.main.zibObject)) {

        entity =_.find(data.main.zibObject, (a: any) => {
          return a.zibObjectDef === 'LengteWaarde';
        });

      } else if (data.main.zibObject?.zibObjectDef === 'LengteWaarde'){
        entity = data.main.zibObject;
      }

      if(entity){

        this.observation.valueQuantity = new Quantity({
          value: entity.UitslagWaarde,
          unit: 'cm',
          system: 'http://unitsofmeasure.org',
          code: 'cm',
        });
      }
    }
  }

  setCode(data: RawEntity) {
    if (data.source === 'BodyHeight') {
      this.observation.code = new CodeableConcept({
        coding: [
          new Coding({
            system: 'http://loinc.org',
            code: '8302-2',
            display: 'Body height',
          }),
          new Coding({
            system: 'http://loinc.org',
            code: '8308-9',
            display: 'Body height --standing',
          }),
        ],
      });
    }
  }

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
  }

  setSubject(data: RawEntity): void {
    this.observation.subject = appendSubject(data.subject);
  }

  setComment(data: RawEntity): void {
    if (data.main.Toelichting) {
      this.observation.note = [
        new Annotation({
          text: data.main.Toelichting,
        }),
      ];
    }
  }

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

  setComponents(data: RawEntity): void {
    switch (data.source) {
      case 'BloodPressure': {
        this.addBloodPressureMeasurements(data);
        break;
      }
    }
  }

  addBloodPressureMeasurements(data: RawEntity): void {
    const measurements = _.filter(data.main.zibObject, (a: any) => {
      return (
        a.zibObjectDef === 'SystolischeBloeddruk' || a.zibObjectDef === 'DiastolischeBloeddruk' || a.zibObjectDef === 'GemiddeldeBloeddruk'
      );
    });

    if (Array.isArray(measurements)) {
      measurements.forEach((measurement: any): void => {
        let entity = {
          code: '',
          display: '',
        };

        switch (measurement.zibObjectDef) {
          case 'SystolischeBloeddruk': {
            entity = {
              code: '8480-6',
              display: 'Systolic blood pressure',
            };
            break;
          }

          case 'DiastolischeBloeddruk': {
            entity = {
              code: '8462-4',
              display: 'Diastolic blood pressure',
            };
            break;
          }

          case 'GemiddeldeBloeddruk': {
            entity = {
              code: 'nog te doen',
              display: 'nog te doen',
            };
            break;
          }
        }

        this.observation.addComponent(
          new ObservationComponent({
            code: new CodeableConcept({
              coding: [
                new Coding({
                  system: 'http://loinc.org',
                  code: entity.code,
                  display: entity.display,
                }),
              ],
            }),
            valueQuantity: new Quantity({
              value: +measurement.UitslagWaarde,
              unit: 'mmHg',
              system: 'http://unitsofmeasure.org',
              code: 'mm[Hg]',
            }),
          }),
        );
      });
    }
  }

  validate(): boolean {
    return true;
  }
}
