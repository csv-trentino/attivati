import Box from "@/components/ui/Box";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Topbar goBack title={t("termsOfService", "Terms Of Service")} />
      <ScrollView>
        <Box px="m" py="xl">
          <Text variant="title">Termini e Condizioni del Servizio "Attivati!"</Text>
          <Text variant="secondary" mb="l">
            CSV Trentino ETS
          </Text>

          <Text variant="body">
            I presenti Termini d'Uso (di seguito, i “Termini d'Uso”) definiscono i termini di
            utilizzo del servizio “Attivati!”, offerto gratuitamente agli Utenti dall’associazione
            CSV Trentino - Non Profit Network ETS (di seguito, “CSV”), tramite l’applicazione mobile
            “Attivati!”.
          </Text>

          <Text variant="subtitle">Definizioni</Text>
          <Text variant="body">
            Oltre alle parole specificamente definite nel testo, caratterizzate dalla prima lettera
            maiuscola, le parole ed espressioni che seguono presentano il significato di seguito
            esposto: “Piattaforma”: sistema informatico composto dall’Applicazione mobile
            “Attivati!”. “Utente”: l’Utente che accede alla Piattaforma e/o ai Servizi “Utente
            Volontario” o “Volontario”: il soggetto maggiore dell'età di anni 14 che accede alla
            Piattaforma ed ai Servizi e li utilizza in qualità di potenziale Volontario. “Utente
            ENP”: l'Utente registrato sulla Piattaforma per conto dell'Ente Non Profit (ENP), che
            accede alla stessa per pubblicare le proprie posizioni aperte per attività di
            volontariato e per poter entrare in contatto con l'Utente Volontario. “App”,
            “Attivati!”, “Servizio”: servizio fornito da CSV consistente nella funzionalità di
            matchmaking per volontari, offerto da CSV tramite la Piattaforma e disciplinato dai
            presenti Termini e Condizioni e da eventuali specifici accordi. “Account Utente”:
            l’account personale creato dall’Utente.
          </Text>

          <Text variant="subtitle">Introduzione</Text>
          <Text variant="body">
            Prima di iniziare ad utilizzare la Piattaforma e prima della registrazione alla stessa,
            nell'ambito della nostra politica di correttezza e trasparenza ed in adempimento degli
            obblighi di legge, si invita l’Utente a leggere con attenzione i presenti Termini d'Uso
            che regolano l'utilizzo dei servizi offerti. Si precisa che i presenti Termini d'Uso
            devono intendersi integrati da ogni nota, avviso legale, informativo o disclaimer
            pubblicato sulla Piattaforma. L'accesso, la navigazione e l'utilizzo della Piattaforma
            nelle funzioni di questo liberamente accessibili (senza previa registrazione) implicano,
            in ogni caso, l’espressa accettazione dei presenti Termini e Condizioni nella parte in
            cui regolano tali funzioni, nonché il conseguente obbligo per ogni utente di conformarsi
            ad esse. I presenti Termini e Condizioni sono interamente vincolanti per l’Utente che si
            registri alla Piattaforma. Nel caso in cui l’Utente non intenda accettare i presenti
            Termini e Condizioni, in tutto o in parte, ovvero i termini e condizioni contenuti in
            qualsiasi altra nota, avviso legale, informativa o disclaimer presenti sulla
            Piattaforma, è invitato a non utilizzare la stessa, né il servizio "Attivati!". Laddove
            l’Utente acceda, navighi e utilizzi la Piattaforma per conto di terzi, dichiara e
            garantisce di avere il potere di rappresentare, obbligare e vincolare i terzi stessi; in
            tali casi, l'accettazione dei presenti Termini e Condizioni si intenderà effettuata
            anche per i terzi. La Piattaforma può consentire l'accesso a servizi e siti web di terze
            parti (complessivamente e individualmente indicati come "Servizi Terze Parti").
            L'utilizzo della Piattaforma e dei Servizi Terze Parti può richiedere l'accesso a
            Internet o l’accesso a servizi di terze parti. Alcuni Servizi Terze Parti potranno
            essere regolati da termini diversi o aggiuntivi, che l’Utente dovrà leggere ed accettare
            prima di utilizzare.
          </Text>

          <Text variant="subtitle">Descrizione del servizio</Text>
          <Text variant="body">
            CVS concede gratuitamente all’Utente una licenza nominativa, non cedibile, né
            rivendibile, per l’uso di "Attivati!". "Attivati!" è uno strumento digitale concepito
            per consentire a organizzazioni senza scopo di lucro (Ente Non Profit [ENP]) di
            pubblicare sulla Piattaforma le loro offerte relativamente alle posizioni disponibili
            per Volontari nell'alveo dei progetti di volontariato da esse gestiti. Nelle pagine
            dedicate a ciascuna offerta è indicato il dettaglio della stessa. In qualità di
            fornitore della Piattaforma, CSV agisce unicamente come intermediario per facilitare il
            contatto tra gli ENP e i Volontari, senza assumere alcun ruolo diretto nelle attività di
            volontariato. CSV si limita a facilitare le comunicazioni tra ENP e Volontario, ma non è
            parte dell'accordo contrattuale per lo svolgimento di attività di volontariato
            eventualmente stipulato da ENP e Volontario. CSV rimane pertanto estranea a questo
            contratto, che intercorre esclusivamente tra ENP e Volontario. CSV non si assume alcuna
            responsabilità relativamente all'attività di volontariato eventualmente accettata
            dall'Utente Volontario e alla sua corretta esecuzione, e non opera in alcun modo come
            agente dell'ENP. Salvo quanto indicato di seguito in questa sezione, l'ENP è l'unico
            responsabile per l'attività di volontariato da questi offerta e per la gestione delle
            controversie con il Volontario. Nessuna garanzia viene offerta da CSV in relazione a
            tale attività. In ragione di quanto sopra, si precisa che il servizio offerto da CSV,
            consistente nella messa in contatto tra ENP e il Volontario per lo svolgimento di
            attività di volontariato, è fornito a titolo gratuito e privo di finalità commerciali o
            economiche. In considerazione della natura gratuita del servizio e del fatto che le
            prestazioni offerte non sono riconducibili a una transazione commerciale o allo scambio
            di beni o servizi contro corrispettivo, il presente rapporto non può essere qualificato
            come contratto di consumo ai sensi del Codice del Consumo (D. Lgs. 206/2005). Pertanto,
            le disposizioni del Codice del Consumo non trovano applicazione nei confronti del
            rapporto tra la Piattaforma, l'ENP ed il Volontario.
          </Text>

          <Text variant="subtitle">Requisiti e condizioni per l'utilizzo del Servizio</Text>
          <Text variant="body">
            Il Servizio offerto è destinato a persone fisiche, secondo quanto di seguito previsto.
            L'Utente Volontario si impegna a fornire informazioni accurate, aggiornate e complete
            durante la Registrazione e durante il rapporto con l'ENP e, nel caso vi dovessero essere
            delle variazioni nei dati forniti, sarà esclusivo onere e responsabilità dell'Utente
            Volontario informare CSV di tali variazioni con tempestività. L'Utente Volontario
            dichiara, che i dati personali forniti a CSV sono veri, corretti, aggiornati, ad esso
            riferiti e/o alla persona rappresentata; nel caso di Utente che operi in rappresentanza
            di terzi, dichiara altresì che si tratta di dati inseriti con il consenso del terzo,
            assumendo ogni responsabilità in ordine alla verità, correttezza e aggiornamento delle
            informazioni fornite. Gli Utenti Volontari riconoscono e accettano che CSV non svolga un
            controllo sulle informazioni inserite nei profili se non a campione o su specifica
            segnalazione di altro Utente registrato o delle pubbliche autorità. L’Utente Volontario
            comprende e riconosce tuttavia che eventuali risposte e atti necessari per la chiusura
            dell'accordo con l'ENP da parte di quest’ultimo non dipendono da CSV, che, pertanto, non
            risponde a qualsiasi titolo della mancata attivazione dell'ENP oppure delle conseguenze
            da essa eventualmente derivanti.
          </Text>

          <Text variant="subtitle">Account Utente e Registrazione</Text>
          <Text variant="body">
            Il servizio si limita esclusivamente a facilitare il contatto tra potenziali volontari e
            gli ENP, senza intervenire in alcun modo nell'effettiva formalizzazione del rapporto di
            volontariato. Per fruire dei Servizi è richiesta la Registrazione alla Piattaforma con
            la conseguente creazL’uso della APP e dei relativi servizi è consentito ai maggiori di
            14 anni. Accettando i presenti Termini, l’Utente e/o la persona che procede con
            l’installazione sul devices della APP, dichiara e garantisce di avere compiuto almeno
            quattordici (14) anni. Per quanto concerne l'accesso e l'utilizzo del nostro Servizio di
            matchmaking per attività di volontariato da parte di utenti di età compresa tra i 14 e i
            17 anni si precisa che tale utilizzo è consentito poiché il servizio offerto è gratuito
            e non comporta la necessità di effettuare transazioni economiche né di assumersi
            specifici obblighi contrattuali nei confronti dell'ENP. ione di un Account Utente. La
            Registrazione è gratuita. La Registrazione consiste nella creazione di un Account che è
            personale e incedibile, protetto da password, e comporta la comunicazione a CSV di
            alcune informazioni e dati anche di carattere personale (si veda sezione “Trattamento
            dati personali” per maggiori informazioni). A seguito del completamento della
            Registrazione, l’Utente Volontario potrà in qualsiasi momento accedere al suo Profilo e
            accedere ai propri dati. L'Utente Volontario potrà procedere in qualsiasi momento alla
            cancellazione del proprio Account o degli Account da questi gestiti.
          </Text>

          <Text variant="subtitle">Licenza</Text>
          <Text variant="body">
            La Piattaforma è concessa all’Utente Volontario in licenza d’uso non esclusiva.
            All’Utente Volontario è concesso il diritto temporaneo, non esclusivo e non cedibile,
            per la durata dell’accordo, di utilizzare la Piattaforma in conformità con i presenti
            Termini e Condizioni. Il Volontario ha il diritto di accedere al servizio attraverso
            l'App, utilizzando, entro i limiti consentiti, le funzionalità immediatamente e
            direttamente rese disponibili dalla Piattaforma. L’App è rilasciata con licenza Open
            Source MIT ed è resa disponibile, secondo le specifiche tecniche Agid, in un repository
            pubblico gratuito. Tale licenza è riferita solo al codice sorgente dell’Applicazione
            mobile e non copre invece il connettore API. Per effetto di tale licenza MIT, si concede
            gratuitamente a qualsiasi persona che ottenga una copia del codice sorgente
            dell’Applicazione e dei file di documentazione associati (a questi fini, il “Software”),
            il permesso di trattare il Software senza restrizioni, compresi senza limitazione i
            diritti di usare, copiare, modificare, unire, pubblicare, distribuire, concedere in
            sublicenza e/o vendere copie del Software, e di consentire alle persone a cui il
            Software è fornito di farlo, alle seguenti condizioni:
          </Text>
          <Text variant="body" mt="s">
            L’avviso di copyright nella forma “Copyright ANNO TITOLARE DEL COPYRIGHT” deve essere
            incluso, insieme alla precedente autorizzazione, in tutte le copie o porzioni
            sostanziali del Software.
          </Text>
          <Text variant="body" mt="s">
            Il Software viene fornito “così com’è”, senza garanzia di alcun tipo, espressa o
            implicita, incluse ma non limitate alle garanzie di commerciabilità, idoneità a un
            particolare scopo e non violazione di diritti. In nessun caso gli autori o i titolari
            del copyright potranno essere ritenuti responsabili per qualsiasi reclamo, danno o altra
            responsabilità, derivante da o in connessione con il Software o dall’uso o altre
            operazioni condotte sul Software.
          </Text>

          <Text variant="body" mt="s">
            Pertanto, l’Utente non potrà:
          </Text>
          <Text variant="body" mt="s">
            effettuare reverse engineering, decompilare, disassemblare, modificare o creare lavori
            derivati basati sulla Piattaforma o sul connettore API o su qualunque porzione della
            Piattaforma (ad eccezione della porzione relativa all’applicazione mobile oggetto di
            licenza open source);
          </Text>

          <Text variant="body" mt="s">
            aggirare i sistemi informatici usati da CSV o dai suoi licenziatari per proteggere il
            contenuto accessibile tramite di essa;
          </Text>

          <Text variant="body" mt="s">
            utilizzare qualunque robot, spider, applicazione di ricerca e/o di reperimento di siti,
            ovvero qualunque altro dispositivo, processo o mezzo automatico per accedere,
            recuperare, effettuare scraping o indicizzare qualunque porzione della Piattaforma o dei
            suoi contenuti o del connettore API;
          </Text>

          <Text variant="body" mt="s">
            affittare, licenziare o sublicenziare la Piattaforma o il connettore API;
          </Text>

          <Text variant="body" mt="s">
            utilizzare la Piattaforma o il connettore API in qualunque altra modalità impropria tale
            da violare i presenti Termini e Condizioni;
          </Text>

          <Text variant="body" mt="s">
            diffamare, offendere, molestare, mettere in atto pratiche minatorie, minacciare o in
            altro modo violare i diritti di altri attraverso la Piattaforma;
          </Text>

          <Text variant="body" mt="s">
            diffondere o pubblicare contenuti illegali, osceni, illegittimi, diffamatori o
            inappropriati aventi ad oggetto la Piattaforma;
          </Text>

          <Text variant="body" mt="s">
            appropriarsi illecitamente dell'account in uso presso altro Utente.
          </Text>

          <Text variant="body" mt="s">
            È proibito utilizzare qualsiasi metodo per aggirare o disattivare qualsiasi meccanismo
            di crittografia, sicurezza o autenticazione per i sistemi autorizzati oppure per
            qualsivoglia software, o per ottenere accesso non autorizzato o interferire con
            qualsiasi account, servizio, hardware, software o network collegato alla piattaforma.
          </Text>

          <Text variant="subtitle">Diritti di proprietà intellettuale</Text>
          <Text variant="body">
            CSV è titolare esclusiva dei segni distintivi CSV (di seguito il “Marchio”) e dei nomi
            di dominio. Fatto salvo quanto stabilito dalla sezione “Licenza”, CSV è titolare e/o
            licenziataria di tutti i diritti di proprietà intellettuale e industriale relativi al
            Sito, alla Piattaforma e a quanto ivi pubblicato e caricato (i “Diritti IP”), ivi
            inclusi, a titolo esemplificativo, i testi, i disegni, le foto, i video, le banche dati,
            il know-how, i software, i dati e le informazioni contenute o connesse allo stesso
            diverse dai Contenuti ai sensi dei presenti Termini e Condizioni per i quali CSV abbia
            ottenuto autorizzazione d’uso da terzi (a titolo esemplificativo, contenuti concessi in
            licenza da fornitori). Nessun utilizzo del Marchio, dei Nomi di Dominio, dei Diritti IP
            è consentito, in assenza di previa autorizzazione scritta della Società. Fatto salvo
            quanto stabilito dalla sezione “Licenza”, l'Utente Volontario prende atto che, la
            riproduzione, la duplicazione, la copia, la vendita, l'esecuzione di framing e/o
            scraping, la rivendita, lo sfruttamento in qualsiasi forma, sia a titolo oneroso che
            gratuito, a fini privati o commerciali, di tutto o di singole parti, della Piattaforma
            senza la preventiva autorizzazione scritta di CSV non è consentita e sarà considerata ad
            ogni effetto di legge violazione della normativa in materia di proprietà intellettuale
            ed industriale. Gli unici utilizzi consentiti sono gli usi strettamente necessari ai
            fini della fruizione dei Servizi.
          </Text>

          <Text variant="subtitle">Durata e cancellazione account</Text>
          <Text variant="body">
            I presenti Termini e Condizioni hanno una durata corrispondente al tempo intercorrente
            tra l’attivazione dell’Account e la sua disattivazione, per qualsiasi ragione essa
            avvenga. L'Utente Volontario ha il diritto di cancellare il proprio account in qualsiasi
            momento, senza dover fornire alcuna motivazione. La cancellazione dell'Account può
            essere effettuata direttamente nella sezione dedicata al profilo personale all'interno
            dell'App. Una volta richiesta la cancellazione, CSV provvederà a chiudere l'Account
            dell'Utente Volontario e ad eliminare i relativi dati personali, salvo il caso in cui la
            conservazione di tali dati sia necessaria per adempiere ad obblighi di legge.
          </Text>

          <Text variant="subtitle">Forza maggiore</Text>
          <Text variant="body">
            CSV non sarà responsabile per l’inadempimento delle proprie obbligazioni qualora questo
            sia dovuto a eventi che siano estranei al suo controllo, includendo, a mero titolo
            esemplificativo, pandemie, guerre, inondazioni, cataclismi e qualsiasi altra causa che
            CSV non abbia la possibilità di prevenire usando la normale diligenza.
          </Text>

          <Text variant="subtitle">Notifiche</Text>
          <Text variant="body">
            L’Utente Volontario concorda nel ricevere comunicazioni da parte di CSV, ovvero
            notifiche relative al servizio e all'App, incluso eventuali alterazioni ai presenti
            Termini di Utilizzo e all'Informativa sulla Privacy, all’indirizzo di posta elettronica
            inserito durante la procedura di registrazione dell’account.
          </Text>

          <Text variant="subtitle">Modifiche</Text>
          <Text variant="body">
            Nel caso si rendesse necessario aggiornare l'App, i Servizi o i presenti Termini e
            Condizioni, saranno adottate le misure appropriate per informare l’Utente Volontario,
            coerentemente con l'importanza dei cambiamenti effettuati. L’accesso o l’uso continuato
            dell'App o del Servizio dopo l’entrata in vigore degli aggiornamenti implicano
            l’accettazione della versione più aggiornata del contenuto dei Termini e Condizioni.
            Qualora l’Utente Volontario non dovesse concordare con le modifiche, gli aggiornamenti,
            le integrazioni ai presenti Termini e Condizioni apportati, lo si invita a non
            utilizzare l'App e qualora registrato a cancellare la propria utenza.
          </Text>

          <Text variant="subtitle">Cessione</Text>
          <Text variant="body">
            CSV si riserva la facoltà di cedere, anche parzialmente, a terzi, il presente accordo, e
            i diritti e gli obblighi dallo stesso derivanti, in qualsiasi momento, e senza alcuno
            specifico consenso da parte dell’Utente Volontario. È fatto divieto all’Utente di cedere
            i presenti Termini e Condizioni. In caso di violazione da parte dell’Utente Volontario
            del divieto di cessione, la cessione si intenderà come non avvenuta e quindi priva di
            effetti nei rapporti con CSV, che avrà la facoltà di ritenere risolti i presenti Termini
            e Condizioni.
          </Text>

          <Text variant="subtitle">Garanzie e responsabilità</Text>
          <Text variant="body">
            CSV non garantisce che l'App o il Servizio operino sempre senza errori o senza
            interruzioni. Salvo quanto espressamente e specificamente previsto nel presente accordo,
            e nella misura massima consentita dalla legge applicabile, CSV non presta alcuna
            garanzia (esplicita o implicita) in relazione all'App e al Servizio, incluse, in via
            esemplificativa e non esaustiva, garanzie di qualità, di adeguatezza per uno scopo
            specifico, o qualsiasi altra garanzia implicita derivante dalla prassi o dagli usi
            commerciali. L’Ente, sempre nella misura massima consentita dalla legge applicabile, non
            presterà alcuna garanzia relativamente alla compatibilità dell’App con particolari
            piattaforme e relativamente agli effetti che potranno verificarsi sulla funzionalità di
            software, servizi o prodotti di terze parti, in ragione dell’adozione dell’App e del
            Servizio. Fermo restando l'impegno nel cercare di garantire la continuità dell’App e dei
            Servizi, CSV non presta alcuna garanzia e, nei limiti previsti dalla normativa
            applicabile, non sarà in alcun modo responsabile, per le ipotesi di ritardi,
            imprecisioni nell’aggiornamento delle informazioni, malfunzionamenti, interruzioni e/o
            sospensioni dell'accesso ai dati causati da:
          </Text>
          <Box my="s" gap="s">
            <Text variant="body">
              1. errato utilizzo da parte dell'Utente Volontario dell'App o dei Servizi;
            </Text>
            <Text variant="body">
              2. malfunzionamenti di qualsiasi tipo del dispositivo mobile utilizzato;
            </Text>
            <Text variant="body">
              3. interruzioni totali o parziali, o in ogni caso inefficienze, dei servizi forniti
              dagli operatori di telecomunicazioni o da qualunque altro soggetto terzo addetto alla
              trasmissione dei dati;
            </Text>
            <Text variant="body">
              4. operazioni di manutenzione effettuate da CSV al fine di salvaguardare l'efficienza
              e la sicurezza dell'App e dei Servizi (di tali interruzioni dei Servizi sarà data,
              qualora possibile, preventiva comunicazione);
            </Text>
            <Text variant="body">5. qualsiasi altra causa non imputabile a CSV.</Text>
          </Box>
          <Text variant="body">
            La Piattaforma ed il Servizio "Attivati!" sono dotati di efficaci misure di sicurezza e
            di procedure di autenticazione finalizzate a consentire l'accesso ai dati esclusivamente
            a favore dell’Utente legittimato ad accedervi. L’Utente è tenuto all'efficace e
            scrupolosa custodia delle credenziali di autenticazione e dei codici di sicurezza
            necessari per accedere alla Piattaforma ed ai Servizi, a non comunicare a soggetti terzi
            le predette credenziali e i codici, e, ove consentito, a modificare e aggiornare gli
            stessi periodicamente, assumendo ogni responsabilità al riguardo. L’Utente accetta,
            altresì, che qualora dovesse procedere a sua discrezione a esportare al di fuori della
            Piattaforma, memorizzandoli sul Suo dispositivo, documenti e informazioni estratti dalla
            stessa, le misure di sicurezza implementate nella Piattaforma e nei Servizi non saranno
            più efficaci per proteggere i tali dati, i quali potranno essere soggetti al rischio di
            accesso abusivo da parte di soggetti non autorizzati. L’Utente si assume ogni
            responsabilità riguardo all’efficace custodia del suo dispositivo mobile, all'eventuale
            applicazione di altri strumenti (quali codici di accesso o sistemi biometrici)
            finalizzati a prevenire accessi non consentiti al dispositivo stesso, e accetta che CSV
            non sarà in alcun modo, e in nessun caso, responsabile di eventuali accessi abusivi al
            suo dispositivo e comunque causati da imperizia nella gestione dello stesso, delle
            credenziali di autenticazione, e dei codici di sicurezza. Ugualmente CSV non sarà in
            nessun caso responsabile degli eventuali danni arrecati ai dati di titolarità
            dell’Utente dalla presenza, sul dispositivo di quest’ultimo, di codici maligni (virus
            informatici, trojan horses, worms, o altra tipologia di malware) e/o dall'interazione
            con software di terze parti. Le predette limitazioni di responsabilità si applicano
            nella misura massima consentita dalla legge applicabile.
          </Text>

          <Text variant="subtitle">Limitazione di responsabilità</Text>
          <Text variant="body">
            L’Utente Volontario riconosce ed accetta che CSV non è parte del rapporto ENP-Volontario
            e che tale rapporto ha luogo esclusivamente tra ENP e Volontario, in ossequio alle
            condizioni stabilite di volta in volta tra le parti.
          </Text>
          <Text variant="body">
            Resta inteso che in nessun caso CSV potrà essere ritenuto responsabile con riferimento
            alla qualità, caratteristiche e/o disponibilità delle attività di volontariato offerte
            dall'ENP.
          </Text>
          <Text variant="body">
            L'ENP e l’Utente Volontario riconoscono e accettano rispettivamente che CSV:
          </Text>

          <Text variant="body" mt="s">
            non potrà essere ritenuto responsabile né a titolo di colpa, né a titolo di dolo, per
            qualunque danno diretto e/o indiretto, patrimoniale e non patrimoniale, incidentali,
            consequenziali, che dovesse derivare dalla condotta e attività dell'ENP;
          </Text>
          <Text variant="body" mt="s">
            non sarà pertanto responsabile per le eventuali perdite subite o qualsiasi altro danno
            che non sia conseguenza immediata e diretta del proprio inadempimento fatto salvo il
            caso di dolo o colpa grave di CSV.
          </Text>

          <Text variant="subtitle">Trattamento dati personali</Text>
          <Text variant="body">
            CSV procederà al trattamento dei dati personali degli Utenti Volontari nel rispetto
            della normativa vigente in materia di privacy come definito in dettaglio
            nell'informativa sul trattamento dei dati personali, "Privacy Policy".
          </Text>

          <Text variant="subtitle">Disposizioni finali</Text>
          <Text variant="body">
            Qualora una o più disposizioni dei presenti Termini e Condizioni venga dichiarata
            invalida o inefficace interamente o parzialmente per una qualsiasi ragione, sarà
            scindibile dalle altre e non inciderà sulla validità ed efficacia degli altri Termini e
            Condizioni ovvero sulla loro esecuzione nella loro interezza o di qualsiasi altra
            clausola o disposizione. Le comunicazioni da trasmettere all’Utente Volontario
            registrato verranno effettuate mediante lettera raccomandata, lettera semplice,
            attraverso il portale ovvero tramite posta elettronica agli indirizzi indicati
            dall'Utente in sede di Registrazione. Le comunicazioni da trasmettere a CSV dovranno
            essere effettuate mediante il Servizio Clienti attraverso la pagina di supporto.
            L'eventuale tolleranza di CSV in merito a comportamenti dell'Utente Volontario posti in
            essere in violazione delle disposizioni contenute nelle presenti Condizioni Generali non
            costituisce rinuncia ai diritti derivanti dalle disposizioni violate né a qualsivoglia
            diritto e facoltà di legge e di contratto, nonché al diritto di esigere l'esatto
            adempimento di tutti i presenti Termini e Condizioni qui previsti.
          </Text>

          <Text variant="subtitle">Legge applicabile e Foro competente</Text>
          <Text variant="body">
            I presenti Termini e Condizioni, gli eventuali contratti per singoli Servizi, nonché
            ogni e qualsivoglia rapporto CSV e gli Utenti Volontari che tragga origine dall’utilizzo
            del Portale o della Piattaforma sono regolati dalla legge Italiana. Competente a
            conoscere delle controversie sull'applicazione e interpretazione dei Presenti Termini e
            Condizioni è il Tribunale di Trento in via esclusiva, ad eccezione delle ipotesi in cui
            la legge preveda un Foro diverso esclusivo ed inderogabile.
          </Text>

          <Text variant="subtitle">Contatti</Text>
          <Text variant="body">CSV Trentino - Non Profit Network ETS</Text>
          <Text variant="body">Indirizzo: Via Renato Lunelli, 4, 38121, Trento (TN)</Text>
          <Text variant="body">Email: info@volontariatotrentino.it</Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
