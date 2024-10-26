package notifications

import (
	"fmt"
	"log"

	"github.com/wevolunteer/wevolunteer/internal/app/events"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

func accountsEventsSubscribe() {
	events.Subscribe(events.UserSignup, func(event events.Event) error {
		data, ok := event.Payload.Data.(*events.UserEventPayload)

		if !ok {
			fmt.Println("User signed up: error")
			return fmt.Errorf("invalid data type")
		}

		go func() {

			fmt.Println("User signed up: ", data.User.Email)
			err := NotificationTrigger(data.User, NotificationUserSignup, map[string]interface{}{
				"user_firstname": data.User.FirstName,
				"user_lastname":  data.User.LastName,
			})

			if err != nil {
				log.Fatal("novu error", err.Error())
			}
		}()

		fmt.Printf("User signed up: %v\n", event.Payload.Data)
		return nil
	})

	events.Subscribe(events.UserLogin, func(event events.Event) error {
		fmt.Printf("User logged in: %v\n", event.Payload.Data)
		return nil
	})

	events.Subscribe(events.UserDeleted, func(event events.Event) error {
		fmt.Printf("User deleted: %v\n", event.Payload.Data)
		data, ok := event.Payload.Data.(*events.UserEventPayload)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		go func() {
			err := NotificationTrigger(data.User, NotificationUserDelete, map[string]interface{}{
				"user_firstname": data.User.FirstName,
				"user_lastname":  data.User.LastName,
			})

			if err != nil {
				log.Fatal("novu error", err.Error())
			}
		}()

		return nil
	})

	events.Subscribe(events.UserCodeRequestedAuth, func(event events.Event) error {
		user, ok := event.Payload.Data.(*models.User)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		fmt.Printf("User requested code: email %s code %s\n", user.Email, user.OTPCode)

		err := NotificationTrigger(user, NotificationVerificationCodeAuth, map[string]interface{}{
			"verification_code": user.OTPCode,
		})

		if err != nil {
			log.Fatal("novu error", err.Error())
			return err
		}

		return nil
	})

	events.Subscribe(events.UserCodeRequestedDelete, func(event events.Event) error {
		user, ok := event.Payload.Data.(*models.User)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		fmt.Printf("User requested delete: email %s code %s\n", user.Email, user.OTPCode)

		err := NotificationTrigger(user, NotificationVerificationCodeDelete, map[string]interface{}{
			"verification_code": user.OTPCode,
		})

		if err != nil {
			log.Fatal("novu error", err.Error())
			return err
		}

		return nil

	})

	events.Subscribe(events.UserCodeVerified, func(event events.Event) error {
		user, ok := event.Payload.Data.(*models.User)

		if !ok {
			return fmt.Errorf("invalid data type")
		}

		fmt.Printf("User verified code: email %s", user.Email)
		return nil
	})

	events.Subscribe(events.UserDeviceRegistered, func(event events.Event) error {
		payload, ok := event.Payload.Data.(events.UserDeviceCreatePayload)

		if !ok {
			fmt.Println("User device registered: error")

			return fmt.Errorf("invalid data type")
		}

		NotificationAddDevice(payload.User, payload.Device.Token)

		return nil
	})
}
