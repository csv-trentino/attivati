package commands

import (
	"fmt"
	"time"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/wevolunteer/wevolunteer/internal/app"
	"github.com/wevolunteer/wevolunteer/internal/models"
)

var logos = []string{
	"https://www.differenzadonna.org/wp-content/uploads/2020/01/differenza_donna_logo-1.jpg",
	"https://www.cefaonlus.it/wpsite/wp-content/uploads/Logo-50-anni-sito-cefa.png",
	"https://www.frontotemporale.it/wp-content/uploads/2020/11/logo_web.png",
	"https://fondazionesantorsola.it/wp-content/themes/fondazione/img/logo-fondazione-policlinico-santorsola.png",
	"https://sostienici.aism.it/dona-ora/assets/images/logo_aism.png",
	"https://fondazione.santaritadacascia.org/wp-content/uploads/sites/2/2023/01/cropped-logo-fondazione.png",
	"https://www.21luglio.org/2018/wp-content/uploads/2021/11/Logo21LugliosenzaOnlus.png",
	"https://www.comunicazioneiniziativeenpa.it/wp-content/uploads/2020/05/LOGO-ENPA.png",
}

func FakeDataCommand() error {

	categories, err := generateCategories(10)
	if err != nil {
		return err
	}
	organizations, err := generateOrganizations(10, categories)
	if err != nil {
		return err
	}

	_, err = generateActivities(100, organizations, categories)

	if err != nil {
		return err
	}

	return nil
}

func generateCategories(count int) ([]*models.Category, error) {

	categories := []*models.Category{
		{Name: "Cultura, sport e ricreazione", Code: "CulturaSportRicreazione"},
		{Name: "Istruzione e ricerca", Code: "IstruzioneRicerca"},
		{Name: "Sanità", Code: "Sanita"},
		{Name: "Assistenza sociale e protezione civile", Code: "AssistenzaSocialeProtezioneCivile"},
		{Name: "Ambiente", Code: "Ambiente"},
		{Name: "Sviluppo economico e coesione sociale", Code: "SviluppoEconomicoCoesioneSociale"},
		{Name: "Tutela dei diritti e attività politica", Code: "TutelaDirittiAttivitaPolitica"},
		{Name: "Filantropia e promozione del volontariato", Code: "FilantropiaPromozioneVolontariato"},
		{Name: "Cooperazione e solidarietà internazionale", Code: "CooperazioneSolitarietaInternazionale"},
		{Name: "Religione", Code: "Religione"},
		{Name: "Relazioni sindacali e rappresentanza di interessi", Code: "RelazioniSindacali"},
		{Name: "Altre attività", Code: "AltreAttivita"},
		{Name: "Alternanza Scuola-Lavoro", Code: "AlternanzaScuolaLavoro"},
	}

	for category := range categories {
		if err := app.DB.Create(category).Error; err != nil {
			return nil, err
		}
	}

	return categories, nil
}
func generateOrganizations(count int, categories []*models.Category) ([]*models.Organization, error) {

	var organizations []*models.Organization

	for i := 0; i < count; i++ {
		// Create a new organization

		lat, err := gofakeit.LatitudeInRange(35.0, 47.0)
		if err != nil {
			return nil, err
		}

		lon, err := gofakeit.LongitudeInRange(6.0, 19.0)
		if err != nil {
			return nil, err
		}

		organization := &models.Organization{
			Name:      gofakeit.Company(),
			UID:       gofakeit.UUID(),
			Logo:      logos[gofakeit.Number(0, len(logos)-1)],
			Email:     gofakeit.Email(),
			Phone:     gofakeit.Phone(),
			WebSite:   gofakeit.URL(),
			Address:   gofakeit.Address().Address,
			City:      gofakeit.Address().City,
			State:     gofakeit.Address().State,
			Country:   gofakeit.Address().Country,
			ZipCode:   gofakeit.Address().Zip,
			Latitude:  lat,
			Longitude: lon,
			TaxCode:   gofakeit.LetterN(10),
			VATCode:   gofakeit.LetterN(10),
			Category:  &models.Category{ID: categories[gofakeit.Number(0, len(categories)-1)].ID},
			Published: true,
		}

		if err := app.DB.Create(organization).Error; err != nil {
			return nil, err
		}

		organizations = append(organizations, organization)
	}

	return organizations, nil
}
func generateActivities(

	count int,
	organizations []*models.Organization,
	categories []*models.Category,
) ([]models.Experience, error) {
	var experiences []models.Experience

	for i := 0; i < len(organizations); i++ {
		for j := 0; j < count; j++ {
			lat, err := gofakeit.LatitudeInRange(35.0, 47.0)
			if err != nil {
				return nil, err
			}

			lon, err := gofakeit.LongitudeInRange(6.0, 19.0)
			if err != nil {
				return nil, err
			}
			activity := models.Experience{
				Title:       gofakeit.Sentence(3),
				Description: gofakeit.Sentence(10),

				UID:          gofakeit.UUID(),
				Organization: models.Organization{ID: organizations[i].ID},
				Category:     models.Category{ID: categories[gofakeit.Number(0, len(categories)-1)].ID},
				Image:        fmt.Sprintf("https://picsum.photos/id/%d/700/400", gofakeit.Number(1, 200)),
				Address:      gofakeit.Address().Address,
				City:         gofakeit.Address().City,
				State:        gofakeit.Address().State,
				Country:      gofakeit.Address().Country,
				ZipCode:      gofakeit.Address().Zip,
				Latitude:     lat,
				Longitude:    lon,

				ContactName:  gofakeit.Name(),
				ContactEmail: gofakeit.Email(),
				ContactPhone: gofakeit.Phone(),

				StartDate: gofakeit.DateRange(time.Now(), time.Now().AddDate(0, 0, 30)),
				EndDate:   gofakeit.DateRange(time.Now().AddDate(0, 0, 31), time.Now().AddDate(0, 0, 60)),

				StartTime: gofakeit.Date().Format("15:04"),
				EndTime:   gofakeit.Date().Format("15:04"),
			}

			if err := app.DB.Create(&activity).Error; err != nil {
				return nil, err
			}

			experiences = append(experiences, activity)
		}
	}

	return experiences, nil
}
