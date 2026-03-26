import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { PatientModule } from './patient/patient.module';
import { ObservationModule } from './observation/observation.module';
import { ConsentModule } from './consent/consent.module';
import { PractitionerModule } from './practitioner/practitioner.module';
import { PractitionerRoleModule } from './practitioner-role/practitioner-role.module';
import { CarePlanModule } from './care-plan/care-plan.module';
import { EncounterModule } from './encounter/encounter.module';
import { FlagModule } from './flag/flag.module';
import { GoalModule } from './goal/goal.module';
import { LocationModule } from './location/location.module';
import { NutritionOrderModule } from './nutrition-order/nutrition-order.module';
import { OrganizationModule } from './organization/organization.module';
import { ProcedureModule } from './procedure/procedure.module';
import { RelatedPersonModule } from './related-person/related-person.module';
import { RiskAssessmentModule } from './risk-assessment/risk-assessment.module';
import { TaskModule } from './task/task.module';
import { CoverageModule } from './coverage/coverage.module';
import { RegisterService } from './services/register/register.service';
import { XmlJsonMiddleware } from './middleware/xml-json/xml-json.middleware';
import { FhirResourceMiddleware } from './middleware/fhir-resource/fhir-resource.middleware';

@Module({
  imports: [
    PatientModule,
    ObservationModule,
    ConsentModule,
    PractitionerModule,
    PractitionerRoleModule,
    CarePlanModule,
    EncounterModule,
    FlagModule,
    GoalModule,
    LocationModule,
    NutritionOrderModule,
    OrganizationModule,
    ProcedureModule,
    RelatedPersonModule,
    RiskAssessmentModule,
    TaskModule,
    CoverageModule,
  ],
  controllers: [AppController],
  providers: [RegisterService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XmlJsonMiddleware, FhirResourceMiddleware).forRoutes('(.*)');
  }
}
