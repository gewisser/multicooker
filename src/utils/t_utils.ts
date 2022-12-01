export function enumToArray(
  t_enum: Record<string, unknown>,
  mapLabel?: string[]
) {
  const EWifiModeLen = Object.keys(t_enum).length;
  const arrayResult = [];

  let i = 0;

  for (const [key, value] of Object.entries(t_enum)) {
    arrayResult.push({
      value: Number(key),
      enumName: value as string,
      label: mapLabel ? mapLabel[i] : '',
    });

    i++;

    if (i === EWifiModeLen / 2) {
      break;
    }
  }

  return arrayResult;
}
