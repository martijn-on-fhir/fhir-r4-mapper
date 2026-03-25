import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  providers: [{ provide: 'TaskService', useClass: TaskService }],
  exports: ['TaskService'],
})
export class TaskModule {}
