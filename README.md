# Auto kuće u Zagrebu

## Opis skupa podataka

Ovaj skup podataka sadrži popis auto kuća u Zagrebu, njihovo radno vrijeme, popis automobila koje prodaju, kontakt podatke: broj telefona, email te adresu auto kuće.
Za svaki automobil kojega auto kuća prodaje navedena je marka auomobila, model automobila te njegova cijena u eurima.

Nazivi auto kuća, radno vrijeme, kontakt podaci i adrese su stvarni podaci pronađeni pomoću [Google Maps](https://www.google.com/maps/).

Marke, modeli i cijene automobila su također stvarni podaci pronađeni na internetskim stranicama proizvođača automobila marki: [Audi](https://www.audi.hr), [BMW](https://www.bmw.hr/hr/index.html), [Mercedes-Benz](https://www.mercedes-benz.hr/passengercars.html), [Renault](https://www.renault.hr/vozila.html), [Volkswagen](https://www.volkswagen.hr).

**Napomena**: Podaci o tome koja auto kuća prodaje koju marku i model automobila te po kojoj cijeni su izmišljeni.

## Metapodaci

- **Licenca**: CC0 1.0 Universal
  
- **Autor**: Fran Laić
  
- **Verzija**: 1.0
  
- **Jezik**: hrvatski
    
- **Format zapisa vremena**: hh:mm:ss (ISO 8601)
  
- **Dostupni formati**: CSV, JSON

- **Objavljeno**: studeni 2023.

- **Zadnje ažurirano**: studeni 2023.

- **Ključne riječi**: auto kuća, automobil, Zagreb

- **Opis atributa**:
  | **Atribut**     | **Opis atributa**                                   | **Tip podatka** |
  |-----------------|-----------------------------------------------------|-----------------|
  | dealership_name | Naziv auto kuće                                     | string          |
  | days            | Dani na koje se odnose vremena otvaranja/zatvaranja | string          |
  | open_time       | Vrijeme u koje se otvara auto kuća                  | time            |
  | closing_time    | Vrijeme u koje se zatvara auto kuća                 | time            |
  | brand           | Naziv marke automobila                              | string          |
  | car_name        | Naziv modela automobila                             | string          |
  | price_euro      | Cijena automobila u eurima                          | numeric         |
  | phone_number    | Kontakt broj telefona                               | string          |
  | email           | Kontakt email                                       | string          |
  | address         | Adresa auto kuće                                    | string          |
