package commands

import (
	"fmt"

	"github.com/wevolunteer/wevolunteer/internal/app/accounts"
)

type CreateSuperUserInput struct {
	Email    string
	Password string
}

func CreateSuperUserCommand(input CreateSuperUserInput) error {
	fmt.Println("Create super user")

	if input.Email == "" {
		return fmt.Errorf("email is required")
	}

	if input.Password == "" {
		return fmt.Errorf("password is required")
	}

	user, _ := accounts.UserGetByEmail(input.Email)

	if user != nil {
		isSuperUser := true
		accounts.UserUpdate(user.ID, &accounts.UserUpdateData{
			Email:       &input.Email,
			Password:    &input.Password,
			IsSuperUser: &isSuperUser,
		})

		return nil
	}

	data := accounts.UserCreateData{
		Email:       input.Email,
		Password:    input.Password,
		IsSuperUser: true,
	}

	_, err := accounts.UserCreate(&data)

	if err != nil {
		return err
	}

	return nil
}
