package notifications

import (
	"fmt"

	"github.com/wevolunteer/wevolunteer/internal/app/events"
)

func experiencesEventsSubscribe() {
	events.Subscribe(events.ExperienceCreated, func(event events.Event) error {
		payload, ok := event.Payload.Data.(*events.ExperienceCreatedPayload)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		fmt.Printf("Notify experience created: %v '%v'\n", payload.Experience.Title, payload.Experience.Organization)

		err := NotificationTopicTrigger(payload.Experience.Organization.UID, NotificationExeperienceCreatedOrg, map[string]interface{}{
			"experience_id":     payload.Experience.UID,
			"experience_title":  payload.Experience.Title,
			"organization_name": payload.Experience.Organization.Name,
		})

		if err != nil {
			fmt.Println("novu error", err.Error())
			return err
		}

		return nil
	})
}
