package notifications

import (
	"context"
	"fmt"

	novu "github.com/novuhq/go-novu/lib"
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

const (
	NotificationUserSignup                  = "welcome"
	NotificationUserDelete                  = "account-deleted"
	NotificationUserEmailChanged            = "account-email-has-been-changed"
	NotificationVerificationCodeAuth        = "verification-code"
	NotificationVerificationCodeDelete      = "verification-code-delete"
	NotificationVerificationCodeEmailChange = "verification-code-email-change"
	NotificationActivityAccepted            = "enrollment-confirmation"
	NotificationExeperienceCreatedOrg       = "new-activity-for-organization"
	NotificationExeperienceCreatedNearby    = "new-actvity-nearby"
	NotificationActivityReminder            = "activity-reminder"
)

func Init() {
	accountsEventsSubscribe()
	activitiesEventsSubscribe()
	experiencesEventsSubscribe()
	usersEventsSubscribe()
}

func NotificationTrigger(recipient *models.User, eventId string, payload map[string]interface{}) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	ctx := context.Background()

	to := map[string]interface{}{
		"lastName":     recipient.LastName,
		"firstName":    recipient.FirstName,
		"subscriberId": recipient.UID,
		"email":        recipient.Email,
	}

	data := novu.ITriggerPayloadOptions{To: to, Payload: payload}

	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	_, err := novuClient.EventApi.Trigger(ctx, eventId, data)
	if err != nil {
		fmt.Println("novu error", err.Error())
		return err
	}

	return nil
}

func NotificationTopicTrigger(key string, eventId string, payload map[string]interface{}) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	ctx := context.Background()

	fmt.Printf("Notify topic %s\n", key)

	to := []map[string]interface{}{
		{
			"type":     "Topic",
			"topicKey": key,
		},
	}

	data := novu.ITriggerPayloadOptions{To: to, Payload: payload}

	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	_, err := novuClient.EventApi.Trigger(ctx, eventId, data)
	if err != nil {
		fmt.Println("novu error", err.Error())
		return err
	}

	return nil
}

func NotificationCreateTopic(key string, name string) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	ctx := context.Background()
	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	err := novuClient.TopicsApi.Create(ctx, key, name)
	if err != nil {
		fmt.Println("novu error", err.Error())
		return err
	}

	return nil
}

func NotificationGetTopic(key string) (*novu.GetTopicResponse, error) {
	if app.Config.NOVU_API_KEY == "" {
		return nil, nil
	}

	ctx := context.Background()
	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	topic, err := novuClient.TopicsApi.Get(ctx, key)
	if err != nil {
		return nil, err
	}

	return topic, nil
}

func NotificationTopicAddSubscriber(topicKey string, subscriberUID string) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	ctx := context.Background()
	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	err := novuClient.TopicsApi.AddSubscribers(ctx, topicKey, []string{subscriberUID})
	if err != nil {
		fmt.Println("novu error", err.Error())
		return err
	}

	return nil
}

func NotificationTopicRemoveSubscriber(topicKey string, subscriberUID string) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	ctx := context.Background()
	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	err := novuClient.TopicsApi.RemoveSubscribers(ctx, topicKey, []string{subscriberUID})
	if err != nil {
		fmt.Println("novu error", err.Error())
		return err
	}

	return nil
}

func NotificationAddSubscriber(recipient *models.User) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	data := map[string]interface{}{
		"lastName":     recipient.LastName,
		"firstName":    recipient.FirstName,
		"subscriberId": recipient.UID,
		"email":        recipient.Email,
	}

	ctx := context.Background()
	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	_, err := novuClient.SubscriberApi.Identify(ctx, recipient.UID, data)
	if err != nil {
		fmt.Println("novu error", err.Error())
		return err
	}

	return nil
}

func NotificationAddDevice(recipient *models.User, deviceToken string) error {
	if app.Config.NOVU_API_KEY == "" {
		return nil
	}

	err := NotificationAddSubscriber(recipient)

	if err != nil {
		return err
	}

	ctx := context.Background()
	novuClient := novu.NewAPIClient(app.Config.NOVU_API_KEY, &novu.Config{})

	novuClient.SubscriberApi.UpdateCredentials(ctx, recipient.UID, novu.SubscriberCredentialPayload{
		Credentials: novu.Credentials{
			DeviceTokens: []string{deviceToken},
		},
		ProviderId: "expo",
	})

	return nil
}
