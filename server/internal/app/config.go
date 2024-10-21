package app

import (
	"time"

	"github.com/spf13/viper"
)

const (
	EnvProduction  = "production"
	EnvTesting     = "testing"
	EnvDevelopment = "development"
)

var Config struct {
	ENV   string
	DEBUG bool

	JWT_SECRET              string
	DB_DSN                  string
	DB_MAX_OPEN_CONNECTIONS int
	DB_MAX_IDLE_CONNECTIONS int
	DB_MAX_LIFETIME         time.Duration
	NOVU_API_KEY            string

	STORE_SERVICE_ACCOUNT string
	STORE_SERVICE_OTP     string

	AWS_PUBLIC_KEY string
	AWS_SECRET_KEY string
	AWS_ENDPOINT   string
	AWS_REGION     string
	AWS_BUCKET     string

	CDN_ENDPOINT string

	APP_URL string
}

func ParseConfig(path string) {
	env := viper.GetString("SERVER_ENV")

	if env == "" {
		env = EnvDevelopment
	}

	viper.SetDefault("db_dsn", "sqlite3://db.sqlite3")
	viper.SetDefault("debug", false)
	viper.SetDefault("db_max_open_connections", 100)
	viper.SetDefault("db_max_idle_connections", 10)

	viper.SetDefault("aws_region", "us-east-1")
	viper.SetDefault("app_url", "http://localhost:3000")

	viper.Set("store_service_account", "example@example.com")
	viper.Set("store_service_otp", "12345")

	viper.SetConfigFile(".env")
	viper.AddConfigPath(".")

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		log.Debug("Using config file: ", viper.ConfigFileUsed())
	}

	Config.DEBUG = viper.GetBool("debug")
	Config.DB_DSN = viper.GetString("db_dsn")
	Config.JWT_SECRET = viper.GetString("jwt_secret")
	Config.NOVU_API_KEY = viper.GetString("novu_apikey")
	Config.DB_MAX_LIFETIME = time.Hour

	Config.AWS_PUBLIC_KEY = viper.GetString("aws_public_key")
	Config.AWS_SECRET_KEY = viper.GetString("aws_secret_key")
	Config.AWS_ENDPOINT = viper.GetString("aws_endpoint")
	Config.AWS_REGION = viper.GetString("aws_region")
	Config.AWS_BUCKET = viper.GetString("aws_bucket")
	Config.CDN_ENDPOINT = viper.GetString("cdn_endpoint")

	Config.STORE_SERVICE_ACCOUNT = viper.GetString("store_service_account")
	Config.STORE_SERVICE_OTP = viper.GetString("store_service_otp")

	Config.APP_URL = viper.GetString("app_url")

	if Config.JWT_SECRET == "" {
		log.Fatal("JWT_SECRET must be set")
	}

	if Config.NOVU_API_KEY == "" {
		log.Debug("NOVU_API_KEY not set. Notifications are disabled")
	}
}
