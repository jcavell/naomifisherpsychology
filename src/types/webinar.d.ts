export type Ticket = {
  id: string;
  name: string;
  cost?: { display: string; value: number; currency: string };
  fee?: { display: string; value: number };
  hidden: boolean;
  on_sale_status: string;
  sales_end: string;
  display_name: string;
};

export type Widget = {
  type: string;
  data: {
    video?: string;
    tabs?: { slots: { title: string }[] }[];
  };
};

export type Webinar = {
  id: string;
  name: { text: string };
  description: { text: string };
  start: { utc: string };
  end: { utc: string };
  ticket_classes: Ticket[];
  widgets: Widget[];
  url: string;

  // Added during processing
  agenda?: string[];
  videoData?: string;
  orderedTickets?: ProcessedTicket[];
  startDateTime?: Date;
  endDateTime?: Date;
  day?: string;
  month?: string;
  monthLong?: string;
  year?: string;
  startTime?: string;
  endTime?: string;
  people?: string[];
  tags?: string[];
  detailsText?: string;
};

export type ProcessedTicket = {
  id: string;
  cost: string | undefined;
  costValue: number | undefined;
  fee: string | undefined;
  feeValue: number | undefined;
  hidden: boolean;
  costPlusFee: string;
  status: string;
  name: string;
};
