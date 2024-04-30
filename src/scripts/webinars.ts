import { getTags } from "./tags";
import { getPeople } from "./people";

import testWebinars1 from "../test-data/eventbrite/1event.json";
import testWebinars3 from "../test-data/eventbrite/3events.json";

const EB_BEARER = import.meta.env.EB_BEARER;

function getDetails(webinarId: string) {
  console.log("Fetching details for webinar id " + webinarId);
  return fetch(
    "https://www.eventbriteapi.com/v3/events/" +
      webinarId +
      "/structured_content/",
    {
      headers: {
        Authorization: "Bearer " + EB_BEARER
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

  webinars.map((webinar, index) => {
    webinar.people = getPeople(detailsJsons[index].modules[0].data.body.text);
    webinar.tags = getTags(webinar.name.text, webinar.description.text);
  });

  return webinars;
}
