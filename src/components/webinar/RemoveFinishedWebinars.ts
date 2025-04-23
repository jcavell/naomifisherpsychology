import { useEffect } from "react";

export function RemoveFinishedWebinars() {
  useEffect(() => {
    function hideFinishedWebinars() {
      const webinarCards = document.querySelectorAll(".card-webinars");
      const currentTime = new Date();

      webinarCards.forEach((card) => {
        // Assert that card is an HTMLElement
        const element = card as HTMLElement;
        const endTimeStr = element.getAttribute("data-webinar-end");

        if (!endTimeStr) {
          console.log("Warning: EventbriteWebinar card found without end time");
          return;
        }

        const endTime = new Date(endTimeStr);
        if (!isNaN(endTime.getTime())) {
          if (currentTime > endTime) {
            element.style.display = "none";
          } else {
            element.style.display = "block";
          }
        }
      });
    }

    hideFinishedWebinars();
    const interval = setInterval(hideFinishedWebinars, 60000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
