package notifications

import (
	"fmt"

	"github.com/wevolunteer/wevolunteer/internal/app/events"
)

func usersEventsSubscribe() {
	events.Subscribe(events.UserFollowOrg, func(event events.Event) error {
		user, ok := event.Payload.Data.(*events.UserFollowOrgPayload)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		if !user.User.NotificationsFollowedOrganizations {
			return nil
		}

		go func() error {
			fmt.Printf("User %s followed org %s\n", user.User.Email, user.Organization.Name)

			topic, err := NotificationGetTopic(user.Organization.UID)

			if err != nil || topic == nil {
				err := NotificationCreateTopic(user.Organization.UID, user.Organization.Name)
				if err != nil {
					return fmt.Errorf("error creating topic %s %s", user.Organization.UID, user.Organization.Name)
				}
			}

			err = NotificationTopicAddSubscriber(user.Organization.UID, user.User.UID)

			if err != nil {
				fmt.Println("novu error", err.Error())
				return err
			}

			return nil
		}()

		return nil
	})

	events.Subscribe(events.UserUnfollowOrg, func(event events.Event) error {
		user, ok := event.Payload.Data.(*events.UserFollowOrgPayload)

		if !ok {
			return fmt.Errorf("invalid data type")
		}
		go func() error {
			fmt.Printf("User %s unfollowed org %s\n", user.User.Email, user.Organization.Name)

			err := NotificationTopicRemoveSubscriber(user.Organization.UID, user.User.UID)

			if err != nil {
				fmt.Println("novu error", err.Error())
				return err
			}
			return nil
		}()

		return nil
	})

}
