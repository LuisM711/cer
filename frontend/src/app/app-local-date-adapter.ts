
import { NativeDateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class LocalDateAdapter extends NativeDateAdapter {
  
  override parse(value: string | null): Date | null {
    if (!value) {
      return null;
    }
    const parts = value.split('-').map(v => parseInt(v, 10));
    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  }
}
