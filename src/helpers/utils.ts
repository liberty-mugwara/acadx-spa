/* eslint-disable @typescript-eslint/camelcase */
import { date } from 'quasar';
export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return date.formatDate(d, 'ddd, D MMM YYYY');
}

export function formatDateTime(dateString: string): string {
  const d = new Date(dateString);
  return date.formatDate(d, 'ddd, D MMM YYYY, hh:mma');
}
export function resetObj(obj: any): void {
  if (obj && typeof obj === 'object')
    if (Array.isArray(obj)) obj.length = 0;
    else
      for (const key in obj) {
        if (typeof obj[key] === 'string') obj[key] = '';
        else if (typeof obj[key] === 'number') obj[key] = 0;
        else if (typeof obj[key] === 'boolean') obj[key] = false;
        else if (typeof obj[key] === 'object') resetObj(obj[key]);
      }
}
export const getValue = (value: unknown) => {
  /**
   * false and zero are values but are falsy
   * this function returns value if any or null if value is undefined
   */
  return value
    ? value
    : value === false
    ? false
    : value === 0
    ? 0
    : value === ''
    ? ''
    : null;
};

//*miscellaneous***
export const countOccurrences = (baseString: string, testString: string) =>
  baseString.split(testString).length - 1;

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const formatId = (id: string) => {
  if (id.length == 2) return id + '-';
  if (countOccurrences(id, '--')) return id.replace('--', '-');
  if (id.length > 9)
    if (id.charAt(2) != '-')
      return `${id.slice(0, 2)}-${id.slice(2)}`.toUpperCase();

  return id.toUpperCase();
};

interface Icons {
  [key: string]: string;
}

const icons: Icons = {
  active: 'las la-leaf',
  address: 'las la-map-marker',
  available_number: 'las la-id-badge',
  bank: 'las la-university',
  branch: 'las la-code-branch',
  city: 'las la-city',
  classification: 'mdi-shape-outline',
  country: 'las la-globe-africa',
  date_joined: 'las la-calendar-day',
  email: 'las la-envelope-open-text',
  first_name: 'las la-signature',
  id: 'las la-id-badge',
  join_date: 'las la-calendar-day',
  last_name: 'las la-signature',
  librarian: 'las la-book-reader',
  name: 'las la-signature',
  national_id: 'las la-id-card',
  parent: 'las la-user',
  phone: 'las la-phone-square',
  phone_number: 'las la-phone-square',
  province: 'las la-map-marked-alt',
  school_admin: 'las la-user-tie',
  staff: 'las la-user-astronaut',
  starting_number: 'las la-id-badge',
  student: 'las la-user-graduate',
  suburb: 'las la-map-marked-alt',
  superadmin: 'mdi-account-cowboy-hat',
  superuser: 'las la-user-secret',
  supervisor: 'las la-user-secret',
  teacher: 'las la-chalkboard-teacher',
  tel_number: 'las la-phone'
};
const computeIcon = (key: string) => {
  if (key.startsWith('bank')) return 'las la-piggy-bank';
  if (key.startsWith('group_')) return 'las la-users';
  return undefined;
};
export const getIcon = (key: string) =>
  icons[key.replace(' ', '_')] || computeIcon(key) || 'las la-question-circle';
