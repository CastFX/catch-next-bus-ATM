export type LineStatus = {
	"Line": {
		"LineId": string,
		"OperatorCode": string,
		"LineCode": string,
		"LineDescription": string,
		"TransportMode": number,
		"Suburban": boolean,
		"OtherRoutesAvailable": boolean,
		"Radiobus": boolean,
		"RadiobusCapolinea": boolean
	},
	"Direction": string,
	"BookletUrl": string,
	"BookletUrl2": string,
	"WaitMessage": string,
	"JourneyPatternId": string,
	"TrafficBulletins": {
		"Title": string,
		"Body": string,
		"PublicationDate": string,
		"ExpirationaDate": string
	}[],
}

export type ATM_LineStatus_Response = {
	"Code": string,
	"Description": string,
	"Location": {
			"X": number,
			"Y": number
	},
	"CustomerCode": string,
	"Municipality": string,
	"Address": string,
	"Telephone": string,
	"Fax": string,
	"SiteUrl": string,
	"Email": string,
	"Category": {
			"CategoryId": string,
			"CategoryName": string,
			"HasTimeTables": boolean,
			"Icons": string
	}
	"Lines": LineStatus[],
}

export type Schedule = {
	"Hour": number,
	"NightDetail": string,
	"ScheduleDetail": string,
}

export type DaysInfo = {
	"DayTimeDescription": string
	"Mon": boolean,
	"Tue": boolean,
	"Wed": boolean,
	"Thu": boolean,
	"Fri": boolean,
	"Sat": boolean,
	"Sun": boolean
	"Hol": boolean,
}

export type WeekSchedule = {
	"DayType": DaysInfo,
	"Schedule": Schedule[],
}

export type Day = keyof DaysInfo;
export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as Day[];

export type ATM_Timetable_Response = {
	"DescOrario": string,
	"Direction": string,
	"FromDate": string,
	"LineCode": string,
	"StopCode": string,
	"TimeSchedules": WeekSchedule[],
}

const example = {
	"Code": "4494132",
	"Description": "V.le Ungheria",
	"Location": {
			"X": 9.24880415301383,
			"Y": 45.445546394275866
	},
	"Category": {
			"CategoryId": "20",
			"CategoryName": "Fermate mezzi di superficie",
			"HasTimeTables": true,
			"Icons": null
	},
	"Lines": [
			{
					"Line": {
							"LineId": "66",
							"OperatorCode": "",
							"LineCode": "66",
							"LineDescription": "Cadore - Peschiera Borromeo",
							"TransportMode": 0,
							"Suburban": false,
							"OtherRoutesAvailable": false,
							"Radiobus": false,
							"RadiobusCapolinea": false
					},
					"Direction": "0",
					"BookletUrl": "https://orari.atm.it/66_16084.pdf",
					"BookletUrl2": "66",
					"WaitMessage": null,
					"JourneyPatternId": "66|0",
					"TrafficBulletins": [
							{
									"Title": "Bus 66: fermata sospesa",
									"Body": "<p>Sono in programma lavori stradali in piazzale Martini. Dalle 8:30 di mercoledì 5 luglio, la fermata piazzale Martini (in <strong>direzione Cadore</strong>) è sospesa.</p><p>In alternativa usate la fermata provvisoria che si trova 30 metri prima. </p><div><br></div>",
									"PublicationDate": "2023-06-29T09:30:14Z",
									"ExpirationaDate": "2023-08-30T20:00:00Z"
							}
					],
					"Links": [
							{
									"Rel": "timetable",
									"Href": "tpl/stops/16084/timetable/line/66/dir/0",
									"Title": null
							},
							{
									"Rel": "journeypattern",
									"Href": "tpl/journeyPatterns/66|0",
									"Title": null
							}
					]
			},
			{
					"Line": {
							"LineId": "88",
							"OperatorCode": "",
							"LineCode": "88",
							"LineDescription": "Rogoredo FS M3 - Linate",
							"TransportMode": 0,
							"Suburban": false,
							"OtherRoutesAvailable": false,
							"Radiobus": false,
							"RadiobusCapolinea": false
					},
					"Direction": "0",
					"BookletUrl": "https://orari.atm.it/88_16084.pdf",
					"BookletUrl2": "88",
					"WaitMessage": "no serv.",
					"JourneyPatternId": "88|0",
					"TrafficBulletins": [
							{
									"Title": "Nuova M4 a San Babila: cambiamenti alle linee bus",
									"Body": "<h3>La nuova M4 è aperta</h3><h3><p style=\"font-size:medium\"><span style=\"font-weight:400\">La nuova linea è aperta tra San Babila e Aeroporto di Linate. </span></p></h3><h3>La nuova M4 avvicina Linate al centro città</h3><h3><p style=\"font-size:medium;font-weight:400\"><strong>Con l'apertura delle nuove stazioni, </strong>la nuova tratta Linate-San Babila offre agli abitanti delle zone di corso Indipendenza, piazzale Susa e viale Argonne un servizio veloce e diretto con piazza San Babila e con il resto della rete metropolitana. L’aeroporto di Linate, i quartieri e il centro di Milano sono così collegati in meno di un quarto d’ora.<br>La blu è in servizio tutti i giorni: <strong>dal lunedì al giovedì, dalle 6 alle 22; dal venerdì alla domenica, dalle 6 alle 00:30.</strong></p></h3><h3>Metropolitana e mezzi di superficie ridisegnano una rete più connessa</h3><h3><p style=\"font-size:medium\"><span style=\"font-weight:400\">Abbiamo cambiato</span><strong style=\"font-weight:400\"> i percorsi di alcuni bus</strong><span style=\"font-weight:400\">, con questi criteri:</span></p><ul style=\"font-size:medium;font-weight:400\">    <li><strong>adeguare la rete di superficie all’espansione della rete metropolitana,</strong> senza sovrapposizioni e migliorando la corrispondenza tra fermate di superficie e stazioni M4 </li>    <li><strong>allineare l’offerta di trasporto alla domanda di mobilità </strong>anche con nuove corse, prolungamenti di linea e nuove linee </li></ul><p style=\"font-size:medium;font-weight:400\">Trovate i nuovi percorsi in <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/ATM_Leaflet_A3_2023.06_PRINT_2%20versione%20web.jpg\" target=\"_blank\">questa mappa</a>. Qui sotto trovate cosa cambia, e le nuove fermate.</p></h3><h3>Zone Indipendenza, Dateo, Susa, Argonne</h3><h3><ul style=\"font-size:medium;font-weight:400\">    <li><strong>Nasce il bus notturno NM4.</strong> Sostituisce la metropolitana M4 tutte le notti, tra Linate e Duomo. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/NM4_DUOMO_LINATE.pdf\" target=\"_blank\">Fermate</a> </li>    <li><strong>Linea 27.</strong> Resta in servizio per garantire il collegamento diretto tra il centro e le zone di viale Ungheria, via Mecenate, viale Corsica e corso 22 Marzo. </li>    <li><strong>Linea 73.</strong> Diventa <strong>973</strong> e resta in servizio tra Linate e San Felicino. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/973_LINATE_SAN%20FELICINO.pdf\" target=\"_blank\">Fermate</a> </li>    <li><strong>Bus 38.</strong> Fa servizio tra via Corelli e Susa M4, passando in via Pannonia/Don San Martino anziché in via Marescalchi. Non fa servizio tra via Corelli e Novegro (frazione di Segrate). La nuova <strong>973</strong> (ex 73/) collega l’aeroporto di Linate e Novegro. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/38_PLE_SUSA_NOVEGRO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 45.</strong> Cambia percorso tra viale Ungheria e P.za Ovidio, passando in via Salomone anziché in via Zama (via Zama è servita dalla <strong>linea 66</strong>, che non passa più in via Salomone). <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/45_LAMBRATE_SAN%20DONATO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 54.</strong> La linea è sempre in servizio tra Dateo M4 e Lambrate M2. Ma passa in via Marescalchi anziché in via Pannonia. Alcune corse arrivano fino al Quartiere Feltre-Gobba M2 al posto del bus <strong>75</strong>. La linea non serve più la tratta Dateo-Duomo, servita invece dalla <strong>M4</strong> e dalla nuova linea <strong>61</strong>. La linea notturna <strong>N54</strong> continua a fare servizio nei week end tra Dateo e Lambrate, con una fermata a Susa in corrispondenza con la NM4. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/54_CNA%20GOBBA_DATEO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 60.</strong> Si allunga: da largo Augusto arriva a Duomo (piazza Diaz) al posto della linea <strong>73</strong>. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/60_DUOMO_ZARA.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 61.</strong> La linea segue il nuovo percorso largo Murani-Dateo M4-Duomo M1 M3 (via Baracchini). Sostituisce la tratta est dell’attuale <strong>61</strong> e garantisce il collegamento tra corso Indipendenza e Duomo. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/61_DUOMO_LGO%20MURANI.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 66.</strong> La linea fa servizio tra Peschiera Borromeo e via Cadore. Passa in via Zama anziché via Salomone (via Salomone è servita dalla linea <strong>45</strong>). Le corse che oggi terminano nel paese di Linate sono sostituite dalla linea <strong>88</strong>. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/66_CADORE_PESCHIERA.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 75.</strong> La linea è sostituita dalla <strong>54</strong> tra via Pitteri, Lambrate FS M2 e Cascina Gobba M2. Resta in servizio il Radiobus di Quartiere <strong>Q75</strong>. </li>    <li><strong>Nuovo bus 85.</strong> La nuova linea fa servizio tra piazza Napoli, piazza Cadorna e piazza San Babila (ovvero la tratta ovest della ex linea <strong>61</strong>). La tratta San Babila-largo Murani è servita dalla linea <strong>61</strong> o, in parte, dalla <strong>M4</strong>. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/85_LGO%20AUGUSTO_PZZA%20NAPOLI.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 88.</strong> La linea fa più corse tra Rogoredo e il Quartiere Aviazione. Le corse tra la stazione di Rogoredo e viale Ungheria arrivano fino all’Ospedale Monzino e al paese di Linate (nuovo collegamento con M3 e ferrovie), in sostituzione del bus <strong>66</strong>. Dopo le 22, il bus <strong>88</strong> fa servizio fa servizio tra il quartiere Aviazione e viale Ungheria. Il <strong>radiobus Q88</strong> fa servizio come al solito tra viale Ungheria e Rogoredo. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/88_LINATE_ROGOREDO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 901.</strong> La linea collega Peschiera Borromeo ai capolinea di San Donato M3 e Linate Aeroporto M4. Nei giorni festivi, la linea è sostituita dalla nuova <strong>903</strong>. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/901_SAN%20DONATO_PESCHIERA%20BORROMEO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 902.</strong> La linea collega in modo capillare Peschiera Borromeo al capolinea San Donato M3 (fa servizio nelle frazioni di Peschiera non servite dalla <strong>901</strong>). Nei giorni festivi, la linea è sostituita dalla nuova <strong>903</strong>. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/902_%20SAN%20DONATO_PESCHIERA%20BORROMEO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Nuovo bus 903.</strong> Segue nei giorni festivi gli stessi percorsi delle linee <strong>901</strong> e <strong>902</strong>, in servizio nei giorni feriali. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/903_SAN%20DONATO_LINATE.pdf\" target=\"_blank\">Fermate</a> </li></ul></h3><h3>Zone Lodi e Ripamonti</h3><h3><ul style=\"font-size:medium;font-weight:400\">    <li><strong>Bus 34.</strong> Si allunga in via Amidani. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/34_FATIMA_TOFFETTI.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 77.</strong> La linea segue un nuovo percorso tra Corvetto e il capolinea della M3 di San Donato. Sostituisce il vecchio percorso della <strong>84</strong>. Ferma anche alla stazione ferroviaria di Rogoredo. Non passa da piazzale Lodi. Continua a servire la tratta Poasco-Chiaravalle-Corvetto M3. <a href=\"/it/ViaggiaConNoi/InfoTraffico/Documents/77_POASCO_SAN%20DONATO.pdf\" target=\"_blank\">Nuove fermate</a> </li>    <li><strong>Bus 84.</strong> Non arriva a San Donato. Questa tratta è servita dal bus 77. Fa servizio tra largo Augusto e Corvetto M3 (viale Martini). <span><a>Nuove fermate</a></span> </li></ul></h3><h3> </h3>",
									"PublicationDate": "2023-07-05T19:42:28Z",
									"ExpirationaDate": "2023-09-29T22:00:00Z"
							}
					],
					"Links": [
							{
									"Rel": "timetable",
									"Href": "tpl/stops/16084/timetable/line/88/dir/0",
									"Title": null
							},
							{
									"Rel": "journeypattern",
									"Href": "tpl/journeyPatterns/88|0",
									"Title": null
							}
					]
			}
	],
	"Links": [
			{
					"Rel": "self",
					"Href": "geodata/pois4494132",
					"Title": null
			},
			{
					"Rel": "linesummary",
					"Href": "tpl/stops/16084/linesummary",
					"Title": null
			}
	]
}

export const headers: HeadersInit = {
	"accept": "application/json, text/plain, */*",
	"accept-language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7",
	"cache-control": "no-cache",
	"content-type": "application/x-www-form-urlencoded;charset=UTF-8",
	"pragma": "no-cache",
	"sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
	"sec-ch-ua-mobile": "0",
	"sec-ch-ua-platform": "\"macOS\"",
	"sec-fetch-dest": "empty",
	"sec-fetch-mode": "cors",
	"sec-fetch-site": "same-origin"
};

const apiUrl = "https://giromilano.atm.it/proxy.ashx";

const stopApiUrl = (stopId: string) =>
	`tpPortal/geodata%2Fpois%2F${stopId}%3Flang%3Dit`;

const getTimetableUrl = (stopCode: string, lineId: string, dir: string) =>
	`tpPortal/tpl/stops/${stopCode}/timetable/line/${lineId}/dir/${dir}`;

export const fetchStopData = async (stopId: string) => {
	const response = await fetch(apiUrl, {
		headers,
		body: "url=" + stopApiUrl(stopId),
		method: "POST",
	});

	const data: ATM_LineStatus_Response = await response.json();
	return data;
}

export const fetchTimetableData = async (stopCode: string, lineId: string, dir: string) => {
	const response = await fetch(apiUrl, {
		headers,
		body: "url=" + getTimetableUrl(stopCode, lineId, dir),
		method: "POST",
	});

	const data: ATM_Timetable_Response = await response.json();
	return data;
}