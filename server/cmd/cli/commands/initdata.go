package commands

import (
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	"gorm.io/gorm/clause"

	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

type GeoData struct {
	City string
	Lat  float64
	Long float64
}

var Categories = []models.Category{
	{ID: 1, Name: "Arte, cultura, musica e sport"},
	{ID: 2, Name: "Educazione e animazione giovanile"},
	{ID: 3, Name: "Salute, disabilità, anziani e protezione civile"},
	{ID: 5, Name: "Ambiente e animali"},
	{ID: 7, Name: "Diritti, migrazioni, solitarietà internazionale"},
	{ID: 13, Name: "Altro"},
	{ID: 14, Name: "Alternanza Scuola-Lavoro"},
}

func InitDataCommand() error {
	fmt.Println("Import Geo Data")

	geoData, err := readGEODataFile("data/geoitaly.csv")

	if err != nil {
		return err
	}

	app.DB.Clauses(
		clause.OnConflict{
			Columns:   []clause.Column{{Name: "name"}},
			DoUpdates: clause.AssignmentColumns([]string{"latitude", "longitude"}),
		},
	).CreateInBatches(&geoData, 1000)

	fmt.Println("Import Categories")

	app.DB.Clauses(
		clause.OnConflict{
			Columns:   []clause.Column{{Name: "id"}},
			DoUpdates: clause.AssignmentColumns([]string{"name"}),
		},
	).CreateInBatches(&Categories, 1000)

	return nil
}

func readGEODataFile(path string) ([]models.Place, error) {
	fmt.Println("Reading Geo Data File")
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ';'
	reader.FieldsPerRecord = -1

	var geoData []models.Place
	var seenCities = make(map[string]bool)

	if _, err := reader.Read(); err != nil {
		return nil, err
	}

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}

		city := record[2]

		lat_str := strings.Replace(record[5], ",", ".", 1)
		lat, err := strconv.ParseFloat(lat_str, 64)
		if err != nil {
			return nil, err
		}

		long_str := strings.Replace(record[6], ",", ".", 1)
		long, err := strconv.ParseFloat(long_str, 64)
		if err != nil {
			return nil, err
		}

		if _, ok := seenCities[city]; ok {
			continue
		}

		seenCities[city] = true

		item := models.Place{
			Name:      city,
			Latitude:  lat,
			Longitude: long,
		}

		geoData = append(geoData, item)
	}

	return geoData, nil
}
