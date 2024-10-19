package events

import (
	"sync"

	"github.com/wevolunteer/wevolunteer/internal/utils/logger"
)

type EventType string

const (
	UserSignup                   EventType = "user.signup"
	UserLogin                    EventType = "user.login"
	UserDeleted                  EventType = "user.deleted"
	UserFollowOrg                EventType = "user.follow.org"
	UserUnfollowOrg              EventType = "user.unfollow.org"
	UserCodeRequestedAuth        EventType = "user.code.requested.auth"
	UserCodeRequestedDelete      EventType = "user.code.requested.verify"
	UserCodeVerified             EventType = "user.code.verified"
	ExperienceCreated            EventType = "experience.created"
	ActivityCreated              EventType = "activity.created"
	ActivityPublishedNearby      EventType = "activity.published.nearby"
	ActivityPublishedFollowedOrg EventType = "activity.published.followed_org"
	ActivityAccepted             EventType = "activity.accepted"
	ActivityRejected             EventType = "activity.rejected"
	ActivityIncoming             EventType = "activity.incoming"
	UserDeviceRegistered         EventType = "user.device.registered"
)

type Event struct {
	Type    EventType
	Payload EventPayload
}

type EventHandler func(Event) error

var (
	subscribers = make(map[EventType][]EventHandler)
	mu          sync.RWMutex
)

var log = logger.GetLogger()

func Subscribe(eventType EventType, handler EventHandler) {
	mu.Lock()
	defer mu.Unlock()
	subscribers[eventType] = append(subscribers[eventType], handler)
}

func Publish(event Event) {
	mu.RLock()
	defer mu.RUnlock()
	handlers, found := subscribers[event.Type]
	log.Debugf("Publishing event %s", event.Type)
	if found {
		for _, handler := range handlers {
			handler(event)
		}
	}
}
