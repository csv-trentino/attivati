package notifications

import (
	"fmt"
	"log"

	"github.com/wevolunteer/wevolunteer/internal/app/events"
)

func activitiesEventsSubscribe() {

	events.Subscribe(events.ActivityAccepted, func(event events.Event) error {
		payload, ok := event.Payload.Data.(*events.ActivityNotificationEventPayload)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		fmt.Printf("Notify activity accepted: %v\n", payload.Activity.Experience.Title)

		err := NotificationTrigger(payload.User, NotificationActivityAccepted, map[string]interface{}{
			"experience_title":  payload.Activity.Experience.Title,
			"organization_name": payload.Activity.Experience.Organization.Name,
			"first_name":        payload.User.FirstName,
		})

		if err != nil {
			log.Fatal("novu error", err.Error())
			return err
		}

		return nil
	})
}
