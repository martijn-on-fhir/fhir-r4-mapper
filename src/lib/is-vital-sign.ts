export const isVitalSign = (alias: string ): boolean => {

  const entities = ['BloodPressure', 'HeartRate', 'O2Saturatation', 'BodyTemperature', 'BodyWeight', 'BodyHeight'];

  return entities.indexOf(alias) !== -1
}