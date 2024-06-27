import { getTags } from "./tags";
import { getPeople } from "./people";

import testWebinars1 from "../test-data/eventbrite/1event.json";
import testWebinars3 from "../test-data/eventbrite/3events.json";

const EB_BEARER = import.meta.env.EB_BEARER;

function getDetails(webinarId: string) {
  // console.log("Fetching details for webinar id " + webinarId);
  return fetch(
    "https://www.eventbriteapi.com/v3/events/" +
      webinarId +
      "/structured_content/",
    {
      headers: {
        Authorization: "Bearer " + EB_BEARER,
      },
    }
  );
}

export default async function getWebinars() {
  const eventsResponse = await fetch(
    "https://www.eventbriteapi.com/v3/organizations/495447088469/events/?expand=category,subcategory,ticket_availability,ticket_classes&status=live",
    {
      headers: {
        Authorization: "Bearer " + EB_BEARER,
      },
    }
  );

  const eventsJson = await eventsResponse.json();
  // console.log("Upcoming webinar summaries: " + JSON.stringify(eventsJson));

  const getDetailsResponses = (webinars) => {
    const responses = webinars.map((webinar) => {
      return getDetails(webinar.id);
    });

    return Promise.all(responses);
  };

  const webinars = eventsJson.events;

  const detailsResponses = await getDetailsResponses(webinars);
  const detailsJsons = await Promise.all(
    detailsResponses.map((wd) => wd.json())
  );

  // console.log("Webinar details" + JSON.stringify(detailsJsons));

  function addVideoData(webinar) {
    const videoWidgets = webinar.widgets.filter(
      (widget) => widget.type === "featured_video"
    );
    // console.log("VW" + JSON.stringify(videoWidgets));
    if (videoWidgets.length > 0) {
      webinar.videoData = videoWidgets[0].data.video;
    }
  }

  function addOrderedTickets(webinar) {
    webinar.orderedTickets = webinar.ticket_classes
      .map((ticket) => ({
        cost: ticket.cost?.display,
        costValue: ticket.cost?.value,
        fee: ticket.fee?.display,
        status: ticket.on_sale_status,
        name: ticket.display_name,
      }))
      .filter((w) => w.cost)
      .sort((a, b) => a.costValue - b.costValue);
  }

  function addDates(webinar) {
    const start = webinar.start.utc;
    const end = webinar.end.utc;

    const startDateTime = new Date(Date.parse(start));
    const endDateTime = new Date(Date.parse(end));

    const displayDay = { day: "numeric" };
    const displayMonth = { month: "short" };

    const displayTimeStart = {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/London",
    };

    const displayTimeEnd = {
      hour: "numeric",
      minute: "numeric",
      timeZone: "Europe/London",
      //timeZoneName: "short",
    };

    // Add date values to webinar
    webinar.startDateTime = startDateTime;
    webinar.endDateTime = endDateTime;
    webinar.day = startDateTime.toLocaleString(undefined, displayDay);
    webinar.month = startDateTime.toLocaleString(undefined, displayMonth);
    webinar.startTime = startDateTime.toLocaleString(
      undefined,
      displayTimeStart
    );
    webinar.endTime = endDateTime.toLocaleString(undefined, displayTimeEnd);
  }

  webinars.map((webinar, index) => {
    const detailsText = detailsJsons[index].modules[0].data.body.text;
    webinar.widgets = detailsJsons[index].widgets;
    webinar.detailsText = detailsText;
    webinar.people = getPeople(detailsText);
    webinar.tags = getTags(
      webinar.name.text,
      webinar.description.text,
      detailsText
    );

    addOrderedTickets(webinar);
    addVideoData(webinar);
    addDates(webinar);
  });

  // Only return webinars that haven't ended
  return webinars.filter(w => {
      const end = w.end.utc;
      const endDateTime = new Date(Date.parse(end));
      // const now = new Date("2024-07-09T14:29:00");
      const now = new Date();
      
      // console.log(`** End: ${endDateTime} Now: ${now}`);
  
      return endDateTime > now;
  })
}
