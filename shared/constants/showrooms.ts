// shared/constants/showrooms.ts
import type { ShowroomLocation } from '../types/showroom';

export const MAXARO_SHOWROOMS: ShowroomLocation[] = [
  {
    id: 'roosendaal',
    city: 'Roosendaal',
    name: 'Maxaro Flagship Showroom Roosendaal',
    address: 'Rucphensebaan 17',
    postalCode: '4706 PH Roosendaal',
    phone: '0165 - 574 080',
    openingHoursToday: '09:00 - 18:00 (7 dagen geopend)',
    isFlagship: true,
  },
  {
    id: 'utrecht',
    city: 'Utrecht',
    name: 'Maxaro Showroom Utrecht',
    address: 'The Wall, Hertogwetering 171',
    postalCode: '3543 AS Utrecht',
    phone: '030 - 307 2400',
    openingHoursToday: '09:00 - 18:00',
  },
  {
    id: 'hoofddorp',
    city: 'Hoofddorp',
    name: 'Maxaro Showroom Hoofddorp',
    address: 'Kruisweg 787',
    postalCode: '2132 NG Hoofddorp',
    phone: '023 - 201 4400',
    openingHoursToday: '09:00 - 18:00',
  },
];
