package media

import (
	"bytes"
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/wevolunteer/wevolunteer/internal/app"
)

type MediaUploadData struct {
	Filename    string
	ContentType string
	Size        int64
	Body        bytes.Buffer
}

func MediaUpload(data MediaUploadData) (string, error) {
	// Configurazione delle credenziali AWS
	creds := credentials.NewStaticCredentials(app.Config.AWS_PUBLIC_KEY, app.Config.AWS_SECRET_KEY, "")

	sess, err := session.NewSession(&aws.Config{
		Credentials:      creds,
		Endpoint:         aws.String(app.Config.AWS_ENDPOINT),
		Region:           aws.String(app.Config.AWS_REGION),
		DisableSSL:       aws.Bool(true),
		S3ForcePathStyle: aws.Bool(true),
	})
	if err != nil {
		return "", fmt.Errorf("failed to create AWS session: %v", err)
	}

	svc := s3.New(sess)

	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket:        aws.String(app.Config.AWS_BUCKET),
		Key:           aws.String(data.Filename),
		Body:          bytes.NewReader(data.Body.Bytes()),
		ContentLength: aws.Int64(data.Size),
		ContentType:   aws.String(data.ContentType),
		ACL:           aws.String("public-read"),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to S3: %v", err)
	}

	var url string

	if app.Config.AWS_ENDPOINT != "" {
		url = fmt.Sprintf("%s/%s/%s", strings.TrimSuffix(app.Config.AWS_ENDPOINT, "/"), app.Config.AWS_BUCKET, data.Filename)
	} else {
		url = fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", app.Config.AWS_BUCKET, app.Config.AWS_REGION, data.Filename)
	}

	return url, nil

}
