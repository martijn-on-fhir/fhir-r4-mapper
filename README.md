# FHIR R4 Mapper

Maps raw ZIB (Zorginformatiebouwstenen) entities to FHIR R4 resources.

## Supported FHIR Resources

| FHIR Resource    | Status                 | Notities |
| ---------------- | ---------------------- | -------- |
| Observation      | Zie onderstaande tabel |          |
| Patient          | Basic                  |          |
| Encounter        | Basic                  |          |
| Consent          | Basic                  |          |
| Practitioner     | Basic                  |          |
| PractitionerRole | Basic                  |          |
| CarePlan         | Basic                  |          |
| Coverage         | Basic                  |          |
| Flag             | Basic                  |          |
| Goal             | Basic                  |          |
| Location         | Basic                  |          |
| NutritionOrder   | Basic                  |          |
| Organization     | Basic                  |          |
| Procedure        | Basic                  |          |
| RelatedPerson    | Basic                  |          |
| RiskAssessment   | Basic                  |          |
| Task             | Basic                  |          |

## Observation Mappings

| ZIB Source Type          | Categorie      | Status      | Notities |
| ------------------------ | -------------- |-------------| -------- |
| AlcoholUse               | Social History | Implemented |          |
| BloodPressure            | Vital Signs    | Implemented |          |
| BodyHeight               | Vital Signs    | Implemented |          |
| BodyTemperature          | Vital Signs    | Implemented |          |
| BodyWeight               | Vital Signs    | Implemented |          |
| DrugsUse                 | Social History | Implemented |          |
| FamilySituation          | Social History | In progress |          |
| FunctionalOrMentalStatus | -              | Registered  |          |
| GeneralMeasurement       | -              | Registered  |          |
| HeartRate                | Vital Signs    | Registered  |          |
| LivingSituation          | -              | Registered  |          |
| O2Saturatie              | Vital Signs    | Registered  |          |
| ParticipationInSociety   | -              | Registered  |          |
| TobaccoUse               | -              | Registered  |          |

**Status legend:**
- **Implemented** - Volledige mapping logica met componenten, codering en validatie
- **Registered** - Geregistreerd in resource-aliases, mapping nog niet geimplementeerd
- **Basic** - Service scaffold aanwezig, minimale ZIB-specifieke mapping
- **In progress** - Wordt aangewerkt
