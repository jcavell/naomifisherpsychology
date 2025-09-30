import { getTags } from "./tags";
import { getPeople } from "./people";
import * as fs from "fs";
import { env, isDev } from "./env";
import * as path from "path";
import type {
  EventbriteTicket,
  EventbriteWebinar,
  EventbriteWidget,
  EventbriteVideoData,
  Webinar,
  WebinarTicket,
} from "../types/webinar";

import logger from "./logger.ts";

const TEST_DATA_DIR = "src/test-data/eventbrite";
const useCached = env.DEV_USES_CACHED_WEBINARS;

const readCachedData = (fileName: string) => {
  try {
    const filePath = path.join(TEST_DATA_DIR, fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    return null;
  }
};

const writeCacheData = (fileName: string, data: any) => {
  try {
    fs.writeFileSync(
      path.join(TEST_DATA_DIR, fileName),
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    logger.ERROR("Error writing cache:", error);
  }
};


// Get single webinar (e.g. for webinars details page or webinar-ticket API endpoint)
export const getWebinar = async (
  webinarId: string,
): Promise<Webinar | undefined> => {

  if (useCached) {
    console.log("GET SINGLE WEBINAR: using cached webinar data for " + webinarId + "");
    const webinars = readCachedData('webinars.json');
    const details = readCachedData('details.json');

    if (webinars && details) {
      const webinar = webinars.find((w: EventbriteWebinar) => w.id === webinarId);
      const detail = details[webinars.findIndex((w: EventbriteWebinar) => w.id === webinarId)];
      if (webinar && detail) {
        return transformEventbriteToWebinar(webinar, detail);
      }
    }
  }

  console.log("GET SINGLE WEBINAR: Calling Eventbrite API for webinar " + webinarId + "");

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

// Get all webinars (for homepage, webinars, tags, bio pages)
export default async function getWebinars(): Promise<Webinar[]> {
  if (useCached) {
    logger.INFO("GET WEBINARS: Attempting to use cached webinars and details data");
    const webinars = readCachedData('webinars.json');
    const details = readCachedData('details.json');

    if (webinars && details) {
      logger.INFO("GET WEBINARS: Found and will use cached webinars and details data");
      const processedWebinars = webinars.map((webinar: EventbriteWebinar, index: number) =>
        transformEventbriteToWebinar(webinar, details[index])
      );

      return processedWebinars.filter((w) => {
        const now = new Date();
        return w.tickets?.length && w.endDateTime > now;
      });
    }
  }

  logger.INFO("GET WEBINARS: Calling the Eventbrite API for basic data");

// 1. Get the BASIC webinars info
  const eventsResponse = await fetch(
    "https://www.eventbriteapi.com/v3/organizations/495447088469/events/?expand=category,subcategory,ticket_availability,ticket_classes&status=live",
    {
      headers: {
        Authorization: `Bearer ${env.EB_BEARER}`,
      },
    },
  );

  if (!eventsResponse.ok) {
    throw new Error(`Server error: ${eventsResponse.status}`);
  }

  const eventsJson: { events: EventbriteWebinar[] }  = await eventsResponse.json();
  const eventbriteWebinars: EventbriteWebinar[] = eventsJson.events;

  // Store webinars json if debugging is needed
  if (isDev()) {
    eventbriteWebinars.forEach((webinar) => {
      fs.writeFileSync(
        `webinars-json/${webinar.id}_event.json`,
        JSON.stringify(webinar, null, 2),
      );
    });
  }

  // 2. Get the DETAILS for each webinar
  const detailsResponses = await getAllWebinarsDetails(eventbriteWebinars);
  const detailsJsons = await Promise.all(
    detailsResponses.map((wd) => wd.json()),
  );

  // Store webinars details json if debugging is needed
  if (isDev()) {
    detailsJsons.forEach((detail, index) => {
      fs.writeFileSync(
        `webinars-json/${eventbriteWebinars[index].id}_detail.json`,
        JSON.stringify(detail, null, 2),
      );
    });
  }

  // 3. PROCESS these and convert into the Webinar type
  const processedWebinars = eventsJson.events.map((webinar, index) =>
    transformEventbriteToWebinar(webinar, detailsJsons[index]),
  );

  // Store processed webinars json if debugging is needed
  if (isDev()) {
    processedWebinars.forEach((webinar) => {
      fs.writeFileSync(
        `webinars-json/${webinar.id}_processed.json`,
        JSON.stringify(webinar, null, 2),
      );
    });
  }

  // 4. FILTER webinars that have tickets and haven't ended
  const filteredWebinars = processedWebinars.filter((w) => {
    const now = new Date();
    return w.tickets?.length && w.endDateTime > now;
  });

  // Cache the results if we are using the cache
  if (useCached) {
    writeCacheData('webinars.json', eventbriteWebinars);
    writeCacheData('details.json', detailsJsons);
  }

  return filteredWebinars;
}

const getAllWebinarsDetails = async (webinars: EventbriteWebinar[]): Promise<Response[]> => {
  logger.INFO("GET ALL WEBINARS DETAILS: Calling getWebinar details in for each webinar");
  const responses = await Promise.all(
    webinars.map(async (webinar) => {
      const response = await getWebinarDetails(webinar.id);
      if (!response.ok) {
        throw new Error(`Failed to fetch webinar details: ${response.status}`);
      }
      return response;
    })
  );
  return responses;
};

function getWebinarDetails(webinarId: string): Promise<Response> {
  logger.INFO("GET WEBINARS DETAILS: Calling Eventbrite API strucutred_content vfor webinarId: " + webinarId);
  return fetch(
    `https://www.eventbriteapi.com/v3/events/${webinarId}/structured_content/`,
    {
      headers: {
        Authorization: `Bearer ${env.EB_BEARER}`,
      },
    },
  );
}

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
        ? "Webinar + recording"
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
    .sort((a, b) => a.costValue - b.costValue);
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
