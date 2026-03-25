import { Module } from '@nestjs/common';
import { RelatedPersonService } from './related-person.service';

@Module({
  providers: [{ provide: 'RelatedPersonService', useClass: RelatedPersonService }],
  exports: ['RelatedPersonService'],
})
export class RelatedPersonModule {}
