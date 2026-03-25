import { Module } from '@nestjs/common';
import { ConsentService } from './consent.service';

@Module({
  providers: [{ provide: 'ConsentService', useClass: ConsentService }],
  exports: ['ConsentService'],
})
export class ConsentModule {}