import { Injectable } from '@nestjs/common';
import { FhirResourceService } from '../interfaces/fhir-resource-service.interface';
import { Task } from 'fhir-models-r4';
import { RawEntity } from '../interfaces/raw-entity.interface';

@Injectable()
export class TaskService implements FhirResourceService<any> {
  private task: Task;

  async init(data: RawEntity): Promise<Task> {
    this.task = new Task();

    return this.task;
  }
}
