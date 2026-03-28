import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Task } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';
import { Profiles } from '../lib/profiles';

@Injectable()
export class TaskService implements FhirResourceService<any> {
  private task: Task;

  async init(data: RawEntity): Promise<Task> {
    this.task = new Task({
      id: data.id,
    });

    this.appendProfile(data);

    if (this.validate()) return this.task;
  }

  /**
   * Appends the FHIR profile URL to the observation meta based on the ZIB source type.
   * @param data - The raw entity containing ZIB source data.
   */
  appendProfile(data: RawEntity) {
    const profile = Profiles.get(data.source);

    if (profile) {
      this.task.meta.addProfile(profile);
    }
  }

  validate(): boolean {
    return true;
  }
}
