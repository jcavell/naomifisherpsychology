import { getTags } from "./tags";
import { getPeople } from "./people";
import * as fs from "fs";

import type { Webinar } from "../types/webinar";

import testWebinars1 from "../test-data/eventbrite/1event.json";
import testWebinars3 from "../test-data/eventbrite/3events.json";

// Environment variables
const EB_BEARER = import.meta.env.EB_BEARER as string;
const isDev = import.meta.env.DEV as boolean;

// Fetch webinar details responses
const getDetailsResponses = (webinars: Webinar[]): Promise<Response[]> => {
  const responses = webinars.map((webinar) => {
    return getDetails(webinar.id);
  });

  return Promise.all(responses);
};

// Fetch details for a single webinar
function getDetails(webinarId: string): Promise<Response> {
  return fetch(
    `https://www.eventbriteapi.com/v3/events/${webinarId}/structured_content/`,
    {
      headers: {
        Authorization: `Bearer ${EB_BEARER}`,
      },
    },
  );
}

// Extract video data from webinar widgets
function addVideoData(webinar: Webinar): void {
  const videoWidgets = webinar.widgets.filter(
    (widget) => widget.type === "featured_video",
  );

  if (videoWidgets.length > 0) {
    webinar.videoData = videoWidgets[0].data.video;
  }
}

// Extract agenda data from webinar widgets
function addAgenda(webinar: Webinar): void {
  const agendaWidgets = webinar.widgets.filter((w) => w.type === "agenda");

  if (agendaWidgets.length > 0) {
    webinar.agenda =
      agendaWidgets[0].data.tabs?.[0]?.slots.map((slot) => slot.title) || [];
  }
}

// Process and order ticket information
function addOrderedTickets(webinar: Webinar): void {
  webinar.orderedTickets = webinar.ticket_classes
    .map((ticket) => ({
      id: ticket.id,
      cost: ticket.cost?.display,
      costValue: ticket.cost?.value || 0,
      fee: ticket.fee?.display,
      feeValue: ticket.fee?.value || 0,
      hidden: ticket.hidden,
      costPlusFee: (
        ((ticket.cost?.value || 0) + (ticket.fee?.value || 0)) /
        100
      ).toLocaleString(undefined, { style: "currency", currency: "GBP" }),
      status: ticket.on_sale_status,
      name:
        ticket.display_name.toUpperCase().includes("RECORDING") &&
        !ticket.display_name.toUpperCase().includes("WITHOUT")
          ? "Live webinar + recording"
          : ticket.display_name,
    }))
    .filter((w) => w.cost)
    .sort((a, b) => (a.costValue || 0) - (b.costValue || 0));
}

// Add formatted date and time details to a webinar
function addDates(webinar: Webinar): void {
  const start = webinar.start.utc;
  const end = webinar.end.utc;

  const startDateTime = new Date(Date.parse(start));
  const endDateTime = new Date(Date.parse(end));

  const displayDay: Intl.DateTimeFormatOptions = { day: "numeric" };
  const displayMonth: Intl.DateTimeFormatOptions = { month: "short" };
  const displayMonthLong: Intl.DateTimeFormatOptions = { month: "long" };
  const displayYear: Intl.DateTimeFormatOptions = { year: "numeric" };

  const displayTimeStart: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/London",
  };

  const displayTimeEnd: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/London",
  };

  // Add date values to webinar
  webinar.startDateTime = startDateTime;
  webinar.endDateTime = endDateTime;
  webinar.day = startDateTime.toLocaleString(undefined, displayDay);
  webinar.month = startDateTime.toLocaleString(undefined, displayMonth);
  webinar.monthLong = startDateTime.toLocaleString(undefined, displayMonthLong);
  webinar.year = startDateTime.toLocaleString(undefined, displayYear);

  webinar.startTime = startDateTime.toLocaleString(undefined, displayTimeStart);
  webinar.endTime = endDateTime.toLocaleString(undefined, displayTimeEnd);
}

// Main function to fetch and process webinars
export default async function getWebinars(): Promise<Webinar[]> {
  const eventsResponse = await fetch(
    "https://www.eventbriteapi.com/v3/organizations/495447088469/events/?expand=category,subcategory,ticket_availability,ticket_classes&status=live",
    {
      headers: {
        Authorization: `Bearer ${EB_BEARER}`,
      },
    },
  );
  const eventsJson = await eventsResponse.json();

  const webinars: Webinar[] = eventsJson.events;

  if (isDev) {
    webinars.forEach((webinar) => {
      fs.writeFileSync(
        `webinars-json/${webinar.id}_event.json`,
        JSON.stringify(webinar, null, 2),
      );
    });
  }

  const detailsResponses = await getDetailsResponses(webinars);
  const detailsJsons = await Promise.all(
    detailsResponses.map((wd) => wd.json()),
  );

  if (isDev) {
    detailsJsons.forEach((detail, index) => {
      fs.writeFileSync(
        `webinars-json/${webinars[index].id}_detail.json`,
        JSON.stringify(detail, null, 2),
      );
    });
  }

  webinars.map((webinar, index) => {
    const detailsText = detailsJsons[index].modules[0]?.data?.body?.text ?? "";

    webinar.widgets = detailsJsons[index].widgets;
    webinar.detailsText = detailsText;
    webinar.people = getPeople(detailsText);
    webinar.tags = getTags(
      webinar.name.text,
      webinar.description.text,
      detailsText,
    );

    // Add affiliate link
    webinar.url = `${webinar.url}?aff=web`;

    addAgenda(webinar);
    addOrderedTickets(webinar);
    addVideoData(webinar);
    addDates(webinar);
  });

  if (isDev) {
    webinars.forEach((webinar) => {
      fs.writeFileSync(
        `webinars-json/${webinar.id}_processed.json`,
        JSON.stringify(webinar, null, 2),
      );
    });
  }

  // Return webinars that have tickets and haven't ended
  return webinars.filter((w) => {
    const endDateTime = new Date(Date.parse(w.end.utc));
    const now = new Date();

    return w.orderedTickets?.length && endDateTime > now;
  });
}
