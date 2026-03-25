import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { PatientModule } from './patient/patient.module';
import { ObservationModule } from './observation/observation.module';
import { RegisterService } from './services/register/register.service';
import { XmlJsonMiddleware } from './middleware/xml-json/xml-json.middleware';
import { FhirResourceMiddleware } from './middleware/fhir-resource/fhir-resource.middleware';

@Module({
  imports: [PatientModule, ObservationModule],
  controllers: [AppController],
  providers: [RegisterService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XmlJsonMiddleware, FhirResourceMiddleware).forRoutes('(.*)');
  }
}
