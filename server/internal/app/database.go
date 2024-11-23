package app

import (
	"fmt"
	"net/url"
	"os"
	"strings"
	"time"

	_ "github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/wevolunteer/wevolunteer/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	DefaultPageSize = 20
)

var DB *gorm.DB

type PostgresDSN struct {
	User     string
	Password string
	Host     string
	Port     string
	DBName   string
}

type DatabaseConfig struct {
	dsn          string
	maxOpenConns int
	maxIdleConns int
	maxLifetime  time.Duration
	test         bool
}

func DatabaseInit(config *DatabaseConfig) error {
	var err error
	dsn := strings.Split(config.dsn, "://")

	if len(dsn) != 2 {
		return fmt.Errorf("invalid dsn")
	}

	config.test = os.Getenv("GO_ENV") == "test"

	DB, err = openDatabase(config)

	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	err = DB.AutoMigrate(
		&models.User{},
		&models.UserDevice{},
		&models.Organization{},
		&models.Activity{},
		&models.Experience{},
		&models.Category{},
		&models.Place{},
		&models.ServiceAccount{},
	)

	if err != nil {
		panic(fmt.Errorf("failed to migrate database: %w", err))
	}

	// Set up the database connection pool
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database connection pool: %w", err)
	}

	sqlDB.SetMaxOpenConns(config.maxOpenConns)
	sqlDB.SetMaxIdleConns(config.maxIdleConns)
	sqlDB.SetConnMaxLifetime(config.maxLifetime)

	return nil
}

func DatabaseClose(config *DatabaseConfig) error {
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get database connection pool: %w", err)
	}

	if config.test {
		var dsn *PostgresDSN
		dsn, err = parsePostgresDSN(config.dsn)

		if err != nil {
			return fmt.Errorf("invalid dsn")
		}

		if err := destroyTestDatabase(dsn); err != nil {
			return fmt.Errorf("failed to destroy test database: %w", err)
		}
	}

	return sqlDB.Close()
}

func openDatabase(config *DatabaseConfig) (*gorm.DB, error) {
	var db *gorm.DB

	if config.dsn == "" {
		return nil, fmt.Errorf("missing DSN")
	}

	dsn, err := parsePostgresDSN(config.dsn)

	if err != nil {
		return nil, err
	}

	if config.test {
		return openTestDatabase(dsn)
	}

	db, err = gorm.Open(postgres.Open(config.dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	return db, nil
}

func openTestDatabase(dsn *PostgresDSN) (*gorm.DB, error) {
	testDBName := fmt.Sprintf("%s_test", dsn.DBName)

	gormDsn := fmt.Sprintf("host=%s user=%s password=%s port=%s sslmode=disable TimeZone=UTC", dsn.Host, dsn.User, dsn.Password, dsn.Port)

	db, err := gorm.Open(postgres.Open(gormDsn), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("failed to open test database: %w", err)
	}

	db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s;", testDBName))
	db.Exec(fmt.Sprintf("CREATE DATABASE %s;", testDBName))

	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get database connection pool: %w", err)
	}

	sqlDB.Close()

	db, err = gorm.Open(postgres.Open(fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s sslmode=disable TimeZone=UTC", dsn.Host, dsn.User, dsn.Password, dsn.Port, testDBName)), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("failed to open test database: %w", err)
	}

	return db, nil
}

func destroyTestDatabase(dsn *PostgresDSN) error {
	testDBName := fmt.Sprintf("%s_test", dsn.DBName)

	gormDsn := fmt.Sprintf("host=%s user=%s password=%s port=%s sslmode=disable TimeZone=UTC", dsn.Host, dsn.User, dsn.Password, dsn.Port)

	db, err := gorm.Open(postgres.Open(gormDsn), &gorm.Config{})

	if err != nil {
		return fmt.Errorf("failed to open test database: %w", err)
	}

	db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s;", testDBName))

	return nil
}

func parsePostgresDSN(dsn string) (*PostgresDSN, error) {
	if !strings.HasPrefix(dsn, "postgres://") {
		return nil, fmt.Errorf("invalid DSN scheme: only 'postgres://' is supported")
	}

	u, err := url.Parse(dsn)
	if err != nil {
		return nil, fmt.Errorf("cannot parse DSN: %s", dsn)
	}

	user := u.User.Username()
	password, _ := u.User.Password()

	hostParts := strings.Split(u.Host, ":")
	host := hostParts[0]
	port := ""
	if len(hostParts) > 1 {
		port = hostParts[1]
	}

	dbConfig := &PostgresDSN{
		User:     user,
		Password: password,
		Host:     host,
		Port:     port,
		DBName:   strings.TrimPrefix(u.Path, "/"),
	}

	return dbConfig, nil
}

type PaginationInput struct {
	Page    int `query:"page"`
	PerPage int `query:"per_page"`
}

type PaginationInfo struct {
	Total       int64 `json:"total"`
	Page        int   `json:"page"`
	HasNextPage bool  `json:"has_next_page"`
	PerPage     int   `json:"per_page"`
}

func Paginate(pagination PaginationInput) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if pagination.Page < 1 {
			pagination.Page = 1
		}

		if pagination.PerPage == 0 {
			pagination.PerPage = DefaultPageSize
		}

		return db.Offset((pagination.Page - 1) * pagination.PerPage).Limit(pagination.PerPage)
	}
}

func PageInfo(db *gorm.DB, pagination PaginationInput) (*PaginationInfo, error) {
	pageInfo := &PaginationInfo{
		Page:    pagination.Page,
		PerPage: pagination.PerPage,
	}

	if pagination.Page < 1 {
		pageInfo.Page = 1
	}

	if pagination.PerPage == 0 {
		pageInfo.PerPage = DefaultPageSize
	}

	if err := db.Count(&pageInfo.Total).Error; err != nil {
		return nil, err
	}

	pageInfo.HasNextPage = pageInfo.Total > int64(pageInfo.Page*pageInfo.PerPage)

	return pageInfo, nil
}
