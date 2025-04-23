export let url = undefined;

// Raw Webinar from Eventbrite API
export type EventbriteWebinar = {
  id: string;
  name: { text: string };
  description: { text: string };
  start: { utc: string };
  end: { utc: string };
  ticket_classes: EventbriteTicket[];
  widgets: EventbriteWidget[];
  url: string;
  logo: EventbriteLogo;
};

export type EventbriteTicket = {
  id: string;
  name: string;
  cost?: { display: string; value: number; currency: string };
  fee?: { display: string; value: number };
  hidden: boolean;
  on_sale_status: string;
  sales_end: string;
  display_name: string;
};

export type EventbriteWidget = {
  type: string;
  data: {
    video?: string;
    tabs?: { slots: { title: string }[] }[];
  };
};

export type EventbriteLogo = {
  original: {
    url: string;
    width: number;
    height: number;
  };
};

type EventbriteVideoThumbnail = {
  url: string;
};

type EventbriteVideoThumbnails = {
  small: EventbriteVideoThumbnail;
  medium: EventbriteVideoThumbnail;
  large: EventbriteVideoThumbnail;
};

type EventbriteVideoData = {
  url: string;
  embed_url: string;
  thumbnail: EventbriteVideoThumbnails;
  provider: string;
};

// Transformed Webinar
export type Webinar = {
  id: string;
  title: string;
  description: string;
  detailsText: string;
  startDate: Date;
  endDate: Date;
  tickets: WebinarTicket[];
  agenda: string[];
  url: string;
  logoUrl: string;
  displayDate: {
    day: string;
    month: string;
    monthLong: string;
    year: string;
    startTime: string;
    endTime: string;
  };
  people: string[];
  tags: string[];
  videoData?: EventbriteVideoData;

  // Keep for now - but replace with startDate and endDate at above
  startDateTime: Date;
  endDateTime: Date;
  day: string;
  month: string;
  monthLong: string;
  year: string;
  startTime: string;
  endTime: string;
};

// Transformed Webinar Ticket
export type WebinarTicket = {
  id: string;
  cost: string | undefined;
  costValue: number | undefined;
  fee: string | undefined;
  feeValue: number | undefined;
  hidden: boolean;
  costPlusFee: string;
  status: string;
  name: string;
  salesEnd: string;
};
