import { Module } from '@nestjs/common';
import { LocationService } from './location.service';

@Module({
  providers: [{ provide: 'LocationService', useClass: LocationService }],
  exports: ['LocationService'],
})
export class LocationModule {}