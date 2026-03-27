import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import KeyvRedis from '@keyv/redis';
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
import { HealthModule } from './health/health.module';
import { TerminologyModule } from './services/terminology/terminology.module';
import { RegisterService } from './services/register/register.service';
import { XmlJsonMiddleware } from './middleware/xml-json/xml-json.middleware';
import { FhirResourceMiddleware } from './middleware/fhir-resource/fhir-resource.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      load: [() => require(`../config/${process.env.NODE_ENV || 'dev'}.json`)],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [new KeyvRedis(`redis://${config.get('redis.host')}:${config.get('redis.port')}`)],
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
        },
      }),
    }),
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
    HealthModule,
    TerminologyModule,
  ],
  controllers: [AppController],
  providers: [RegisterService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XmlJsonMiddleware, FhirResourceMiddleware).exclude('health').forRoutes('(.*)');
  }
}