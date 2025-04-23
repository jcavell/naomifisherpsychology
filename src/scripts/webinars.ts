import { getTags } from "./tags";
import { getPeople } from "./people";
import * as fs from "fs";
import { env } from "./env.ts";

//export const prerender = false;

import type {
  EventbriteTicket,
  EventbriteWebinar,
  EventbriteWidget,
  EventbriteVideoData,
  Webinar,
  WebinarTicket,
} from "../types/webinar";

import testWebinars1 from "../test-data/eventbrite/1event.json";
import testWebinars3 from "../test-data/eventbrite/3events.json";
import logger from "./logger.ts";

const isDev = import.meta.env.DEV;

// Get a single webinar
export const getWebinar = async (
  webinarId: string,
): Promise<Webinar | undefined> => {
  const eventResponse = await fetch(
    `https://www.eventbriteapi.com/v3/events/${webinarId}/?expand=ticket_classes`,
    {
      headers: {
        Authorization: `Bearer ${env.EB_BEARER}`,
      },
    },
  );

  // Return undefined for 404, throw error for server issues
  if (eventResponse.status === 404) {
    return undefined;
  }
  if (!eventResponse.ok) {
    throw new Error(`Server error: ${eventResponse.status}`);
  }

  const webinar: EventbriteWebinar = await eventResponse.json();
  const detailsResponse = await getWebinarDetails(webinar.id);

  // Return undefined for 404, throw error for server issues
  if (detailsResponse.status === 404) {
    return undefined;
  }
  if (!detailsResponse.ok) {
    throw new Error(`Server error: ${detailsResponse.status}`);
  }

  const detailsJson = await detailsResponse.json();
  return transformEventbriteToWebinar(webinar, detailsJson);
};

// Get all webinars
export default async function getWebinars(): Promise<Webinar[]> {
  const eventsResponse = await fetch(
    "https://www.eventbriteapi.com/v3/organizations/495447088469/events/?expand=category,subcategory,ticket_availability,ticket_classes&status=live",
    {
      headers: {
        Authorization: `Bearer ${env.EB_BEARER}`,
      },
    },
  );

  logger.INFO("eventsResponse", eventsResponse);

  const eventsJson: { events: EventbriteWebinar[] }  = await eventsResponse.json();
  const eventbriteWebinars: EventbriteWebinar[] = eventsJson.events;

  if (isDev) {
    eventbriteWebinars.forEach((webinar) => {
      fs.writeFileSync(
        `webinars-json/${webinar.id}_event.json`,
        JSON.stringify(webinar, null, 2),
      );
    });
  }

  const detailsResponses = await getAllWebinarsDetails(eventbriteWebinars);
  const detailsJsons = await Promise.all(
    detailsResponses.map((wd) => wd.json()),
  );

  if (isDev) {
    detailsJsons.forEach((detail, index) => {
      fs.writeFileSync(
        `webinars-json/${eventbriteWebinars[index].id}_detail.json`,
        JSON.stringify(detail, null, 2),
      );
    });
  }

  const processedWebinars = eventsJson.events.map((webinar, index) =>
    transformEventbriteToWebinar(webinar, detailsJsons[index]),
  );

  if (isDev) {
    processedWebinars.forEach((webinar) => {
      fs.writeFileSync(
        `webinars-json/${webinar.id}_processed.json`,
        JSON.stringify(webinar, null, 2),
      );
    });
  }

  // Return webinars that have tickets and haven't ended
  return processedWebinars.filter((w) => {
    const now = new Date();
    return w.tickets?.length && w.endDateTime > now;
  });
}

function getWebinarDetails(webinarId: string): Promise<Response> {
  return fetch(
    `https://www.eventbriteapi.com/v3/events/${webinarId}/structured_content/`,
    {
      headers: {
        Authorization: `Bearer ${env.EB_BEARER}`,
      },
    },
  );
}

const getAllWebinarsDetails = (
  webinars: EventbriteWebinar[],
): Promise<Response[]> => {
  const responses = webinars.map((webinar) => {
    return getWebinarDetails(webinar.id);
  });

  return Promise.all(responses);
};

function transformEventbriteToWebinar(
  eventbriteWebinar: EventbriteWebinar,
  detailsJson: any,
): Webinar {
  const detailsText = detailsJson.modules[0]?.data?.body?.text ?? "";
  const startDate = new Date(eventbriteWebinar.start.utc);
  const endDate = new Date(eventbriteWebinar.end.utc);
  const displayDate = formatDisplayDates(
    eventbriteWebinar.start.utc,
    eventbriteWebinar.end.utc,
  );

  return {
    id: eventbriteWebinar.id,
    title: eventbriteWebinar.name.text,
    description: eventbriteWebinar.description.text,
    startDate,
    endDate,
    detailsText,
    videoData: extractVideoData(detailsJson.widgets),
    tickets: transformTickets(eventbriteWebinar.ticket_classes),
    agenda: extractAgenda(detailsJson.widgets),
    url: `${eventbriteWebinar.url}?aff=web`,
    logoUrl: eventbriteWebinar.logo.original.url,
    displayDate: formatDisplayDates(
      eventbriteWebinar.start.utc,
      eventbriteWebinar.end.utc,
    ),
    people: getPeople(detailsText),
    tags: getTags(
      eventbriteWebinar.name.text,
      eventbriteWebinar.description.text,
      detailsText,
    ),
    // Legacy date fields - to be removed later
    startDateTime: startDate,
    endDateTime: endDate,
    day: displayDate.day,
    month: displayDate.month,
    monthLong: displayDate.monthLong,
    year: displayDate.year,
    startTime: displayDate.startTime,
    endTime: displayDate.endTime,
  };
}

function extractVideoData(
  widgets: EventbriteWidget[],
): EventbriteVideoData | undefined {
  const videoWidgets = widgets.filter(
    (widget) => widget.type === "featured_video",
  );

  return videoWidgets[0]?.data.video as EventbriteVideoData | undefined;
}

function extractAgenda(widgets: EventbriteWidget[]): string[] {
  const agendaWidgets = widgets.filter((w) => w.type === "agenda");
  return (
    agendaWidgets[0]?.data.tabs?.[0]?.slots.map((slot) => slot.title) || []
  );
}

function transformTickets(ticketClasses: EventbriteTicket[]): WebinarTicket[] {
  return ticketClasses
    .map((ticket) => ({
      id: ticket.id,
      name: ticket.display_name.toLowerCase().includes("recording")
        ? "Webinar + recording for 30 days"
        : "Webinar",
      cost: ticket.cost?.display || "Free",
      costValue: ticket.cost?.value || 0,
      fee: ticket.fee?.display || "No fee",
      feeValue: ticket.fee?.value || 0,
      costPlusFee: (
        ((ticket.cost?.value || 0) + (ticket.fee?.value || 0)) /
        100
      ).toLocaleString(undefined, { style: "currency", currency: "GBP" }),
      status: ticket.on_sale_status,
      salesEnd: ticket.sales_end,
      hidden: ticket.hidden,
    }))
    .filter((ticket) => !ticket.hidden)
    .sort((a, b) => b.costValue - a.costValue);
}

function formatDisplayDates(startUtc: string, endUtc: string) {
  const startDateTime = new Date(Date.parse(startUtc));
  const endDateTime = new Date(Date.parse(endUtc));

  const displayDay: Intl.DateTimeFormatOptions = { day: "numeric" };
  const displayMonth: Intl.DateTimeFormatOptions = { month: "short" };
  const displayMonthLong: Intl.DateTimeFormatOptions = { month: "long" };
  const displayYear: Intl.DateTimeFormatOptions = { year: "numeric" };
  const displayTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/London",
  };

  return {
    day: startDateTime.toLocaleString(undefined, displayDay),
    month: startDateTime.toLocaleString(undefined, displayMonth),
    monthLong: startDateTime.toLocaleString(undefined, displayMonthLong),
    year: startDateTime.toLocaleString(undefined, displayYear),
    startTime: startDateTime.toLocaleString(undefined, displayTime),
    endTime: endDateTime.toLocaleString(undefined, displayTime),
  };
}
