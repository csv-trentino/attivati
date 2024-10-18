import Box from "@/components/ui/Box";
import Divider from "@/components/ui/Divider";
import Text from "@/components/ui/Text";
import Topbar from "@/components/ui/Topbar";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface ListItemProps {
  title?: string;
  children: string | React.ReactNode;
}

function ListItem({ title, children }: ListItemProps) {
  return (
    <Box flexDirection="row" alignItems="flex-start" justifyContent="flex-start" paddingLeft="m">
      <Text>• </Text>
      <Text variant="body">
        {title && <Text fontFamily="DMSansBold">{title}: </Text>}
        {children}
      </Text>
    </Box>
  );
}

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Topbar goBack title={t("privacyPolicy", "Privacy Policy")} />
      <ScrollView>
        <Box px="m" py="xl">
          <Text variant="title" fontFamily="DMSansBold" fontSize={20}>
            Informativa sul trattamento dei dati personali
          </Text>
          <Text variant="secondary">
            Ai sensi e per gli effetti dell’art. 13 del Regolamento UE n. 2016/679
          </Text>
          <Text variant="body" mt="s">
            App Attivati!
          </Text>

          <Text variant="subtitle" fontFamily="DMSansBold" my="m">
            Introduzione
          </Text>
          <Text variant="body">
            Benvenuto! Questa è l'informativa sulla privacy di “Attivati!”, l'app per il
            volontariato in Trentino (che da qui in poi chiameremo solo: “App”). L'App ti aiuta a
            trovare attività di volontariato che potrebbero piacerti e ti mette in contatto con le
            organizzazioni che le offrono.
          </Text>

          <Text variant="subtitle" fontFamily="DMSansBold">
            Cosa troverai in questo documento?
          </Text>
          <Text variant="body">
            Ti spiegheremo come e perché raccogliamo e usiamo i tuoi dati personali quando utilizzi
            l’App e come puoi fare per modificarli o cancellarli se vuoi. È importante leggere tutto
            con attenzione.
          </Text>

          <Text variant="subtitle" fontFamily="DMSansBold">
            Alcune definizioni utili per comprendere a pieno il documento
          </Text>

          <ListItem title="GDPR">
            Il GDPR è una legge europea che serve a proteggere la tua privacy e a regolare come
            vengono trattati i tuoi dati personali) soprattutto da parte delle aziende ma non solo).
          </ListItem>

          <ListItem title="Dato personale">
            Qualsiasi informazione che permette di identificare, direttamente (come il tuo nome ed
            il tuo cognome) o indirettamente (il tuo codice fiscale) una persona. In altre parole, i
            tuoi dati personali rivelano informazioni su di te.
          </ListItem>

          <ListItem title="Trattamento di dati personali">
            Qualsiasi operazione effettuata sui tuoi dati. Come, ad esempio, la raccolta,
            l’organizzazione, la cancellazione, la modifica, la rielaborazione, la conservazione.
          </ListItem>

          <ListItem title="Titolare del trattamento">
            E’ chi decide cosa fare con i tuoi dati personali. Decide: perché i dati vengono
            raccolti, come e dove devono essere conservati o comunicati, per quanto tempo devono
            essere conservati ecc.
          </ListItem>

          <ListItem title="Data Protection Officer">
            Il responsabile della protezione dati (“DPO”) è la persona incaricata di controllare che
            tutto venga fatto seguendo le leggi sulla protezione dei dati.
          </ListItem>

          <ListItem title="Finalità del trattamento">
            Lo scopo per cui i dati personali sono trattati. Ad esempio, i dati possono essere
            trattati per offrire un servizio oppure per inviare materiale promozionale.
          </ListItem>

          <ListItem title="Base giuridica">
            La base giuridica è la giustificazione legale per cui un'azienda o un'organizzazione può
            raccogliere e utilizzare i tuoi dati personali. È come un "permesso" che autorizza il
            trattamento dei tuoi dati.
          </ListItem>

          <ListItem title="Categorie particolari di dati personali (o dati sensibili)">
            I dati personali sensibili includono informazioni relative alla salute, all'etnia, alle
            opinioni politiche, alle convinzioni religiose, all'appartenenza sindacale,
            all'orientamento sessuale o ai precedenti penali. Vi chiediamo di non condividere alcun
            dato personale sensibile sulla nostra app.
          </ListItem>

          <ListItem title="Responsabili del trattamento">
            I soggetti che si occupano di alcune attività di trattamento su indicazione e per conto
            del Titolare del trattamento.
          </ListItem>

          <Text variant="subtitle" fontFamily="DMSansBold" my="m">
            Titolarità del trattamento
          </Text>
          <Text variant="body">
            Quando utilizzi l’applicazione mobile “Attivati!” (di seguito “l’app”), i tuoi dati sono
            gestiti da:
          </Text>

          <Text variant="body" my="m" fontFamily="DMSansBold">
            CSV Trentino – Non profit network ETS (“CSV”) e Comitato Trento Capitale Europea del
            Volontariato 2024 ETS (“Comitato”)
          </Text>
          <Text variant="body">
            che sono i due contitolari del trattamento dei tuoi dati personali. In altre parole, CSV
            e Comitato lavorano insieme alla realizzazione del progetto “Trento Capitale Europea del
            Volontariato 2024” e trattano i tuoi dati in collaborazione fra loro. Per avere maggiori
            informazioni su questo rapporto puoi scrivere a uno degli indirizzi email indicati nella
            sezione “Contatti”.
          </Text>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Data Protection Officer
          </Text>
          <Text variant="body">
            Abbiamo nominato un DPO. Se hai domande specifiche sul trattamento dei tuoi dati, puoi
            contattarlo in qualsiasi momento scrivendo a csv-tn-dpo@chino.io.
          </Text>

          <Divider my="m" />

          <Text variant="title" fontFamily="DMSansBold" fontSize={20}>
            Perché raccogliamo i tuoi dati?
          </Text>
          <Text variant="subtitle" fontFamily="DMSansBold">
            A. Offrirti l’App e le sue funzionalità
          </Text>
          <Text variant="body">
            Per permetterti di usare la nostra applicazione e le sue funzionalità principali,
            svolgiamo una serie di <Text fontFamily="DMSansBold">attività</Text> che comportano il
            trattamento dei tuoi dati personali, come, per esempio:
          </Text>
          <Box gap="s" my="m">
            <ListItem>Registrazione del volontario in app;</ListItem>
            <ListItem>Log-in del volontario;</ListItem>
            <ListItem>Modifica dei dati e gestione del profilo;</ListItem>
            <ListItem>
              Gestione della candidatura per partecipazione ad attività di volontariato;
            </ListItem>
            <ListItem>
              Comunicazione della disponibilità del volontario e dei suoi dati agli Enti che hanno
              proposto l’iniziativa;
            </ListItem>
            <ListItem>
              Gestione della sicurezza e garanzia del corretto funzionamento dell’applicazione.
            </ListItem>
          </Box>

          <Text variant="body" my="m">
            Nello svolgimento queste attività trattiamo le{" "}
            <Text fontFamily="DMSansBold">categorie di dati personali</Text> di seguito elencate:
          </Text>

          <ListItem title="Dati identificativi *"> (quali nome, cognome);</ListItem>
          <ListItem title="Dati di contatto *"> (indirizzo email)</ListItem>
          <ListItem title="Dati pseudo-identificativi *"> (codice fiscale);</ListItem>
          <ListItem title="Caratteristiche personali">(data di nascita, lingue parlate);</ListItem>
          <ListItem title="Dati demografici"> (città di residenza);</ListItem>
          <ListItem title="Dati relativi all’educazione, alla professione e all’impiego">
            (professione esercitata);
          </ListItem>
          <ListItem title="Immagini"> (foto profilo);</ListItem>
          <ListItem title="Dati d’uso"> (dati di navigazione);</ListItem>
          <ListItem title="Altri dati">
            (dati inseriti nello spazio note, dati gps, candidatura attività di volontariato,
            preferenze per attività di volontariato).
          </ListItem>

          <Text variant="body" mt="m">
            Il conferimento delle tipologie di dati indicate sopra con “*” è obbligatorio. La
            mancata fornitura di tali dati comporterà l'impossibilità di concludere e di dare
            esecuzione al contratto e dunque di procedere con il servizio richiesto.{" "}
            <Text fontFamily="DMSansBold">
              In altre parole, non ti sarà possibile utilizzare l’App se non inserisci almeno i dati
              indicati con “*”.
            </Text>
          </Text>

          <Text variant="body">
            I restanti dati sono facoltativi e puoi scegliere liberamente di inserirli o meno.
          </Text>
          <Text variant="body">
            I dati d’uso vengono invece raccolti automaticamente quando utilizzi l’applicazione.
          </Text>

          <Text variant="subtitle" fontFamily="DMSansBold">
            B. Marketing diretto
          </Text>

          <Text variant="body">
            Solo se sei d’accordo, trattiamo i tuoi dati personali per inviarti informazioni sulle
            nostre attività, eventi e servizi e sulle attività promosse dagli Enti Non Profit che
            collaborano con noi. Si tratta in particolare di invio di comunicazioni su prodotti,
            servizi o eventi offerti da noi o dai nostri partner, compresa la nostra newsletter.
          </Text>

          <Text variant="body" my="m">
            La base giuridica che ci rende possibile trattare i tuoi dati per questa finalità è
            l’articolo 6(1)(a) del GDPR - <Text fontFamily="DMSansBold">Consenso</Text>.
          </Text>

          <Text variant="body">
            Per l’invio di queste comunicazioni avremo bisogno di trattare i tuoi:
          </Text>

          <Box my="m">
            <ListItem title="Dati identificativi *"> (quali nome, cognome);</ListItem>
            <ListItem title="Dati di contatto *"> (indirizzo email)</ListItem>
          </Box>

          <Text variant="body">
            Non è obbligatorio acconsentire al trattamento di questi dati per la finalità di
            Marketing diretto. Infatti, tratteremo i tuoi dati per questa finalità solo se ci darai
            il tuo consenso che potrai revocare in qualsiasi momento scrivendoci a
            privacy@volontariatotrentino.it oppure utilizzando gli appositi link presenti in fondo
            alle comunicazioni promozionali.
          </Text>

          <Text variant="subtitle" fontFamily="DMSansBold">
            C. Altre finalità{" "}
          </Text>

          <ListItem title="Rispondere ad ordini e richieste legittime provenienti da Autorità Pubbliche">
            la base giuridica è data da eventuali{" "}
            <Text fontFamily="DMSansBold">obblighi di legge</Text> - 6(1)(c) GDPR e tratteremo tutti
            i dati eventualmente necessari per rispondere alle richieste dall’Autorità Pubblica.
          </ListItem>
          <ListItem title="Gestione di eventuali contenziosi davanti alle autorità competenti e difesa dei nostri diritti">
            la base giuridica potrebbe essere data da un{" "}
            <Text fontFamily="DMSansBold">obbligo di legge</Text> - 6(1)(c) del GDPR o da un nostro
            <Text fontFamily="DMSansBold"> interesse legittimo</Text> (6(1)(f) GDPR) relativo alla
            gestione di eventuali contenziosi e alla difesa dei nostri diritti. Tratteremo tutti i
            dati necessari per la gestione di eventuali contenziosi e per la difesa dei nostri
            diritti.
          </ListItem>
          <ListItem title="Garantire la sicurezza dei sistemi informatici e delle informazioni">
            trattiamo i tuoi dati per garantire la capacità dei nostri sistemi informatici di
            resistere, ad un dato livello di sicurezza, a eventi imprevisti o ad atti illeciti o
            dolosi che compromettano la disponibilità, l’autenticità, l’integrità e la riservatezza
            dei dati personali; ciò potrebbe includere, ad esempio, misure volte a prevenire
            l’accesso non autorizzato e la diffusione di codici dannosi e a fermare gli attacchi di
            “blocco dei servizi”. La base giuridica è data da un nostro{" "}
            <Text fontFamily="DMSansBold"> interesse legittimo</Text> (6(1)(f) GDPR) a garantire la
            sicurezza dei sistemi informatici utilizzati nella realizzazione di “Attivati!”.
          </ListItem>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Categorie particolari di dati personali
          </Text>
          <Text variant="body">
            Non trattiamo dati sensibili che ti riguardano. Infatti, la nostra applicazione non
            richiede in nessun momento l’inserimento di alcun dato sensibile. Ti invitiamo quindi a
            non condividere in nessun caso dati personali di questa natura sulla nostra
            applicazione.
          </Text>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Dati giudiziari e dati relativi a condanne penali
          </Text>
          <Text variant="body">
            Non trattiamo dati giudiziari e dati relativi a condanne penali. Anche in questo caso,
            ti invitiamo a non condividere con noi dati personali di questa natura.
          </Text>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Cookies e tecnologie simili
          </Text>
          <Text variant="body">
            I cookie e tecnologie simili come i pixel o i tag (parliamo genericamente di "cookie")
            sono piccoli file o segmenti di codice che possono raccogliere informazioni sugli utenti
            quando questi navigano su un sito web o un’applicazione (mobile o web). I cookie vengono
            memorizzati sui dispositivi degli utenti per un determinato periodo e hanno diverse
            funzionalità. La nostra applicazione utilizza solamente cookie di natura strettamente
            tecnica, che servono a facilitare o migliorare l’esperienza di navigazione. Non
            utilizziamo i cookie per tracciare la tua attività o per creare profili personalizzati a
            fini pubblicitari. Per questa ragione, non siamo obbligati a chiederti il consenso
            all’utilizzo dei cookie
          </Text>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Come raccogliamo i tuoi dati
          </Text>
          <Text variant="body">
            Raccogliamo i tuoi dati quando interagisci con la nostra applicazione e con noi. In
            particolare, raccogliamo i tuoi dati personali quando:
          </Text>
          <Box gap="s">
            <Text variant="body">
              1) Ti registri sull’applicazione e la utilizzi, inserendo i tuoi dati personali e
              richiedendo di partecipare alle attività di volontariato;
            </Text>
            <Text variant="body">
              2) Ci contatti per chiederci aiuto o informazioni o per lasciarci un feedback;
            </Text>
            <Text variant="body">
              3) Navighi sull’applicazione (dati di navigazione, raccolti in modo automatico per far
              funzionare l’applicazione stessa).
            </Text>
          </Box>
          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Condivisione dei tuoi dati
          </Text>
          <Text variant="body">
            In generale, condivideremo i tuoi dati personali solo al fine di offrirti la possibilità
            di utilizzare la nostra applicazione, come specificato nei Termini e Condizioni di
            servizio.
          </Text>

          <Box gap="s">
            <Text variant="subtitle" fontFamily="DMSansBold">
              a. Organizzazioni aderenti all’app
            </Text>
            <Text variant="body">
              Nel momento in cui chiedi di partecipare ad una attività di volontariato presente
              sull’App, i tuoi dati personali saranno comunicati all’Ente Non Profit che promuove
              tale attività. I tuoi dati personali vengono comunicati all’Ente al fine di gestire la
              tua “candidatura” e valutare la tua compatibilità con le esigenze dell’Ente. Da quel
              momento in poi, l’organizzazione che valuta la tua candidatura, sarà qualificata come
              “autonomo titolare del trattamento”. In altre parole, significa che tale
              organizzazione deciderà in autonomia come e perché trattare i tuoi dati e sarà
              direttamente responsabile della protezione degli stessi. Potrai chiedere all’Ente così
              individuato maggiori informazioni relativamente al trattamento dei tuoi dati.
            </Text>
            <Text variant="subtitle" fontFamily="DMSansBold">
              b. Responsabili del trattamento
            </Text>
            <Text variant="body">
              Avremo bisogno di affidare la gestione di alcune attività (e dei tuoi dati) ad aziende
              specializzate (come quelle che gestiscono i server o conservano i dati per conto
              nostro). In questi casi, ci assicuriamo che queste aziende trattino i tuoi dati con la
              massima riservatezza e sicurezza (Art. 28 GDPR).
            </Text>
            <Text variant="subtitle" fontFamily="DMSansBold">
              c. c. Autorità pubbliche
            </Text>
            <Text variant="body">
              Potremmo aver bisogno di condividere i tuoi dati con Autorità Pubbliche che ne
              facciano legittima richiesta, in adempimento ad obblighi nazionali e/o internazionali.
            </Text>
            <Text variant="subtitle" fontFamily="DMSansBold">
              b. d. Condivisione tra contitolari
            </Text>
            <Text variant="body">
              In quanto contitolari, Comitato e CSV condividono la titolarità dei dati personali di
              “Attivati!”, al fine comune di fornirti un’App completa e funzionante.
            </Text>
          </Box>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Trasferimento dei dati al di fuori dell’UE/SEE
          </Text>
          <Text variant="body">
            L’Unione europea è particolarmente attenta alla protezione dei dati personali delle
            persone che si trovano in Europa. Per questo motivo, i dati personali possono essere
            trasmessi (“inviati”) al di fuori dell’Europa e dello Spazio Economico Europeo solo in
            determinate circostanze e comunque solo seguendo quanto stabilito dal GDPR. Quando
            utilizzi l’applicazione, i tuoi dati personali saranno trattati all'interno dell'Unione
            Europea e dello Spazio Economico Europeo. Dovesse rendersi necessario un trasferimento
            dei tuoi dati al di fuori dell’Unione Europea lo faremo solo nel rispetto delle modalità
            previste dal GDPR stesso. Per ulteriori dettagli sui trasferimenti puoi contattare il
            nostro DPO in qualsiasi momento.
          </Text>
          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Conservazione dei dati personali
          </Text>
          <Text variant="body">
            Conserveremo i tuoi dati personali per il tempo necessario a fornirti il servizio che ci
            stai richiedendo (App “Attivati!”). In altre parole, conserveremo i tuoi dati personali
            finché il tuo account non verrà cancellato. In alcuni casi potremmo conservare più a
            lungo i tuoi dati. Questo potrebbe avvenire in particolare nel caso di azioni legali o
            controversie relative ai nostri rapporti contrattuali esistenti. Quando i tuoi dati
            personali sono trattati sulla base del consenso, i dati saranno trattati fino alla
            revoca del consenso (nel tuo caso questo può accadere per l’invio della newsletter e di
            comunicazioni promozionali). Se i dati personali non sono più necessari per le finalità
            o per gli interessi legittimi da noi perseguiti e non si applica nessun'altra base
            giuridica, cancelleremo i tuoi dati.
          </Text>
          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            I tuoi diritti
          </Text>
          <Box my="m">
            <ListItem title="Sapere se i tuoi dati personali sono in fase di trattamento">
              e, in caso affermativo, richiederne l'accesso o richiedere delle copie dei tuoi dati
              personali. Puoi inoltre chiederci ulteriori informazioni relative alla presente
              Informativa (Diritto di accesso);
            </ListItem>

            <ListItem title="Chiederci di correggere le informazioni che ritieni inaccurate">
              . Hai anche il diritto di chiederci di completare le informazioni che ritieni
              incomplete. Ricorda comunque che puoi modificare i tuoi dati all’interno dell’apposita
              sezione dell’App (Diritto di rettifica);
            </ListItem>

            <ListItem title="Chiederci di cancellare i tuoi dati personali">
              {" "}
              in determinate circostanze (Diritto all'oblio);
            </ListItem>

            <ListItem title="Opporsi al trattamento dei dati personali">
              , per motivi connessi alla tua situazione specifica (Diritto di opposizione);
            </ListItem>

            <ListItem title="Non essere sottoposto a decisioni automatizzate">
              , inclusa la profilazione. Ti ricordiamo che, come già detto sopra, la nostra App non
              utilizza processi decisionali automatizzati (Diritti relativi al processo decisionale
              automatizzato individuale, inclusa la profilazione);
            </ListItem>

            <ListItem title="Revocare il consenso">
              dato in qualsiasi momento(Diritto di revoca del consenso);
            </ListItem>

            <ListItem title="Ricevere i dati personali in un formato standard nel caso in cui desideri trasferirli">
              a un altro titolare del trattamento (Diritto alla portabilità dei dati);
            </ListItem>

            <ListItem title="Presentare un reclamo in qualsiasi momento all'Autorità Garante per la protezione dei dati personali">
              , in caso di violazione dei diritti di protezione dei dati (Diritto di proporre
              reclamo ad un'autorità di controllo);
            </ListItem>

            <ListItem title="Chiederci di limitare il trattamento">
              delle tue informazioni in determinate circostanze (Diritto di limitazione del
              trattamento);
            </ListItem>

            <ListItem title="Chiederci maggiori informazioni sul rapporto di contitolarità">
              tra Comitato e CSV, in particolare per quanto riguarda il contenuto essenziale del
              contratto che lo regola;
            </ListItem>

            <ListItem title="Richiedere che le suddette modifiche siano comunicate ad altre parti">
              a cui sono stati comunicati i dati.
            </ListItem>
          </Box>

          <Text variant="body">
            L'esercizio dei diritti non è soggetto ad alcun vincolo di forma ed è gratuito.
          </Text>
          <Text variant="body">
            Puoi esercitare i tuoi diritti contattandoci al seguente indirizzo:
            privacy@volontariatotrentino.it.
          </Text>

          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Contatti
          </Text>
          <Text variant="subtitle" fontFamily="DMSansBold" my="m">
            CSV Trentino – Non profit network ETS (“CSV”)
          </Text>
          <Box gap="s">
            <Text variant="body">Via Renato Lunelli, 4 - 38121 Trento</Text>
            <Text variant="body">Telefono 0461.916604</Text>
            <Text variant="body">Email: privacy@volontariatotrentino.it</Text>
            <Text variant="body">C.F. 96061940225 - P. IVA 01852790227.</Text>
          </Box>
          <Text variant="subtitle" fontFamily="DMSansBold" my="m">
            Comitato Trento Capitale Europea del Volontariato 2024 ETS (“Comitato”)
          </Text>
          <Box gap="s">
            <Text variant="body">Via Renato Lunelli, 4 - 38121 Trento</Text>
            <Text variant="body">E-mail: info@trentovolo.capital</Text>
            <Text variant="body">C.F. 96121400228.</Text>
          </Box>
          <Text variant="title" fontFamily="DMSansBold" fontSize={20} my="m">
            Aggiornamento dell’informativa
          </Text>
          <Text variant="body">
            Il documento che hai appena letto può essere modificato e rivisto. Eventuali modifiche a
            questa Informativa verranno pubblicate nell’apposita sezione dell’App e, se necessario,
            ti verranno comunicate. Ti invitiamo a consultare periodicamente la nostra Informativa
            in modo da essere sempre informato su come trattiamo i tuoi dati personali.
          </Text>
          <Text variant="body" mt="s">
            Ultimo aggiornamento: 10.08.2024
          </Text>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
