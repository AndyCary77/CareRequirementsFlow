// Mock data model for the Office "Details" tab — rebuilt from the legacy
// AngularJS office-details form. No backend here, so this is just a plain
// typed const standing in for what a real `vm.office` payload would carry,
// following the same lightweight pattern as tagsMockData.ts.

export interface PpeStockItem {
  label: string;
  count: number;
  /** null = "30+" (effectively unlimited at current usage), otherwise an exact day count. */
  daysRemaining: number | null;
}

export interface OfficeDetails {
  // Brand
  brand: string;

  // Office details
  name: string;
  companyName: string;
  address1: string;
  address2: string;
  city: string;
  county: string;
  country: string;
  postcode: string;
  secret: string;
  accountId: string;
  ssReference: string;

  // Communication details
  openingHours: string;
  onCallHours: string;
  email: string;
  website: string;
  tel: string;
  outOfHoursTel: string;
  fax: string;
  contact: string;
  mobile: string;
  oncall: string;

  // Colour scheme
  colours: { main: string };

  // Status and type
  active: boolean;
  isTest: boolean;
  type: 'DOMICILIARY' | 'RESIDENTIAL';

  // Visit timeout and task settings
  enableTaskTimeout: boolean;
  taskMissedAlerts: boolean;
  visitTaskTimeoutEmail: string;
  visitTaskTimeoutSmsNumber: string;

  // Booking settings
  bookingMissedAlerts: boolean;
  bookingTimeout: number | null;
  bookingTimeoutEmail: string;
  bookingTimeoutSmsNumber: string;

  // openPASS settings
  openpassEnabled: boolean;
  openpassEmail: string;

  // App settings
  message: string;
  deviceWhiteList: string;

  // Regulator details
  cqcProviderId: string;
  cqcLocation: string;

  // NHS integration details
  odsCode: string;
  asid: string;

  // Features
  passRosterEnabled: boolean;
  mfaEnabled: boolean;
  journalEnabled: boolean;

  // Audit footer
  modifiedBy: string;
  modifiedAt: string;
  createdBy: string;
  createdAt: string;

  ppeStock: {
    lastUpdatedAt: string;
    items: PpeStockItem[];
  };
}

export const MOCK_OFFICE: OfficeDetails = {
  brand: 'everyLIFE',

  name: 'Lichfield & Tamworth',
  companyName: 'everyLIFE Technologies Ltd',
  address1: 'A1, East Wing, Cody Technology Park',
  address2: 'Ively Road',
  city: 'Farnborough',
  county: 'Hampshire',
  country: 'United Kingdom',
  postcode: 'GU14 0LX',
  secret: 'lichfield-office',
  accountId: 'ACC-4471',
  ssReference: 'SS-88213',

  openingHours: 'Mon–Fri, 9:00am–5:30pm',
  onCallHours: '5:30pm–9:00am, weekends & bank holidays',
  email: 'office@example-care.co.uk',
  website: 'www.example-care.co.uk',
  tel: '01543 415 208',
  outOfHoursTel: '01543 415 209',
  fax: '',
  contact: 'Alison Mercer',
  mobile: '07700 900 123',
  oncall: '07700 900 456',

  colours: { main: 'rgb(27, 37, 152)' },

  active: true,
  isTest: false,
  type: 'DOMICILIARY',

  enableTaskTimeout: true,
  taskMissedAlerts: true,
  visitTaskTimeoutEmail: 'alerts@example-care.co.uk',
  visitTaskTimeoutSmsNumber: '',

  bookingMissedAlerts: true,
  bookingTimeout: 30,
  bookingTimeoutEmail: 'bookings@example-care.co.uk',
  bookingTimeoutSmsNumber: '',

  openpassEnabled: true,
  openpassEmail: 'openpass@example-care.co.uk',

  message: '',
  deviceWhiteList: '',

  cqcProviderId: '1-1013335752',
  cqcLocation: '',

  odsCode: '',
  asid: '',

  passRosterEnabled: false,
  mfaEnabled: true,
  journalEnabled: true,

  modifiedBy: 'Amie Lockey',
  modifiedAt: '02/08/2026',
  createdBy: 'Elena Azzini (everyLIFEAdmin)',
  createdAt: '22/05/2019',

  ppeStock: {
    lastUpdatedAt: '2026-08-02 20:44',
    items: [
      { label: 'Facemask', count: 480, daysRemaining: null },
      { label: 'Apron', count: 220, daysRemaining: null },
      { label: 'Long sleeved disposable gown', count: 0, daysRemaining: 0 },
      { label: 'Gloves', count: 1200, daysRemaining: null },
      { label: 'Eye protection (disposable goggles or full-face visor)', count: 64, daysRemaining: null },
      { label: 'Hand sanitiser', count: 90, daysRemaining: null },
    ],
  },
};

// Placeholder list only — the real brand picker's search/selection
// behaviour is being specified separately (see OfficeDetailsPage's brand
// card), this just gives the field something to hold today.
export const BRAND_OPTIONS = ['everyLIFE', 'PASS Group', 'Cera Care', 'Right at Home', 'Home Instead'];
