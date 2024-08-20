import dayjs, {Dayjs} from 'dayjs'
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function formatDate(value: string, inputFormat: null | string = null) {
  if (inputFormat) {
    return dayjs(value, inputFormat).format('DD-MM-YYYY')
  }
  return dayjs(value).format('DD-MM-YYYY')
}

export const convertDateToCompare = (value: string): Dayjs => {
  const date = dayjs(value, 'DD-MM-YYYY').toDate()
  return dayjs(date);
}
