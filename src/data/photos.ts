// Généré par scripts/fetch-photos.mjs — ne pas modifier à la main.
// Photos libres de droits de Wikimedia Commons (via Wikidata). Chaque photo
// a son auteur et sa licence : ils sont affichés dans l'appli (obligatoire).

export interface PlayerPhoto {
  /** Nom du joueur sur Wikidata */
  name: string;
  /** Miniature 400 px hébergée par Wikimedia */
  url: string;
  author: string;
  license: string;
  licenseUrl: string;
  /** Page du fichier sur Commons */
  source: string;
}

export const PHOTOS: Record<string, PlayerPhoto> = {
  "pele": {
    "name": "Pelé",
    "url": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Auteur inconnu",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Pele_con_brasil_(cropped).jpg"
  },
  "cruyff": {
    "name": "Johan Cruijff",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Johan_Cruijff_%281974%29.jpg/500px-Johan_Cruijff_%281974%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Rob Mieremet / Anefo",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Johan_Cruijff_(1974).jpg"
  },
  "maradona": {
    "name": "Diego Maradona",
    "url": "https://upload.wikimedia.org/wikipedia/commons/4/48/Argentina_celebrando_copa_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Auteur inconnu",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Argentina_celebrando_copa_(cropped).jpg"
  },
  "platini": {
    "name": "Michel Platini",
    "url": "https://upload.wikimedia.org/wikipedia/commons/6/66/Michel_Platini_2010_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Chancellery of the President of the Republic of Poland",
    "license": "GFDL 1.2",
    "licenseUrl": "https://gnu.org/licenses/old-licenses/fdl-1.2.html",
    "source": "https://commons.wikimedia.org/wiki/File:Michel_Platini_2010_(cropped).jpg"
  },
  "zico": {
    "name": "Zico",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Zico_2012.jpg/500px-Zico_2012.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Doha Stadium Plus",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Zico_2012.jpg"
  },
  "kempes": {
    "name": "Mario Kempes",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Mario_Kempes_Argentina_v_Spain_19_July_2026-036_%28cropped%29.jpg/500px-Mario_Kempes_Argentina_v_Spain_19_July_2026-036_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Mario_Kempes_Argentina_v_Spain_19_July_2026-036_(cropped).jpg"
  },
  "rummenigge": {
    "name": "Karl-Heinz Rummenigge",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/2015-02-06_Rummenigge_0400.JPG/500px-2015-02-06_Rummenigge_0400.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Michael Lucan",
    "license": "CC BY-SA 3.0 de",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/de/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:2015-02-06_Rummenigge_0400.JPG"
  },
  "paolorossi": {
    "name": "Paolo Rossi",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Paolo_Rossi_Vicenza_%28cropped%29.jpg/500px-Paolo_Rossi_Vicenza_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "The original uploader was Snake90 at Italian Wikipedia .",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Paolo_Rossi_Vicenza_(cropped).jpg"
  },
  "lothar": {
    "name": "Lothar Matthäus",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/2019_Lothar_Matth%C3%A4us.jpg/500px-2019_Lothar_Matth%C3%A4us.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Steffen Prößdorf",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:2019_Lothar_Matth%C3%A4us.jpg"
  },
  "lineker": {
    "name": "Gary Lineker",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Gary_Lineker_%28cropped%29.jpg/500px-Gary_Lineker_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Liton Ali",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Gary_Lineker_(cropped).jpg"
  },
  "francescoli": {
    "name": "Enzo Francescoli",
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/21/Enzo_Francescoli_2011.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Christophe95",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Enzo_Francescoli_2011.jpg"
  },
  "vanbasten": {
    "name": "Marco van Basten",
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/24/Marco_van_Basten_%28ca_2006%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Paul Blank - Postproduktie.nl",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "source": "https://commons.wikimedia.org/wiki/File:Marco_van_Basten_(ca_2006).jpg"
  },
  "rbaggio": {
    "name": "Roberto Baggio",
    "url": "https://upload.wikimedia.org/wikipedia/commons/4/4e/%D8%B1%D9%88%D8%A8%D8%B1%D8%AA%D9%88_%D8%A8%D8%A7%D8%AC%D9%88_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "AbolfaZl0990",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:%D8%B1%D9%88%D8%A8%D8%B1%D8%AA%D9%88_%D8%A8%D8%A7%D8%AC%D9%88_(cropped).jpg"
  },
  "romario": {
    "name": "Romário",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Senadores_da_57%C2%AA_Legislatura_%2852689451805%29.jpg/500px-Senadores_da_57%C2%AA_Legislatura_%2852689451805%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Agência Senado from Brasilia, Brazil",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Senadores_da_57%C2%AA_Legislatura_(52689451805).jpg"
  },
  "batistuta": {
    "name": "Gabriel Batistuta",
    "url": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Gabriel_batistuta.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Auteur inconnu",
    "license": "Public domain",
    "licenseUrl": "",
    "source": "https://commons.wikimedia.org/wiki/File:Gabriel_batistuta.jpg"
  },
  "hagi": {
    "name": "Gheorghe Hagi",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Lansarea_candidaturii_Gabrielei_Szabo_pentru_Camera_Deputatilor%2C_Voluntari_-_04.05_%2848%29_%2814270956179%29_%28cropped%29.jpg/500px-Lansarea_candidaturii_Gabrielei_Szabo_pentru_Camera_Deputatilor%2C_Voluntari_-_04.05_%2848%29_%2814270956179%29_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Partidul Social Democrat from Romania",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Lansarea_candidaturii_Gabrielei_Szabo_pentru_Camera_Deputatilor,_Voluntari_-_04.05_(48)_(14270956179)_(cropped).jpg"
  },
  "stoichkov": {
    "name": "Hristo Stoitchkov",
    "url": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Hristo_stoichkov-2010.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Biso",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Hristo_stoichkov-2010.jpg"
  },
  "okocha": {
    "name": "Jay-Jay Okocha",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Match_legends_2017_CC_%285%29.jpg/500px-Match_legends_2017_CC_%285%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Кирилл Венедиктов",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Match_legends_2017_CC_(5).jpg"
  },
  "zidane": {
    "name": "Zinedine Zidane",
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Hadi Abyar",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Zinedine_Zidane_by_Tasnim_03.jpg"
  },
  "henry": {
    "name": "Thierry Henry",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Thierry_Henry_%2851649035951%29_%28cropped%29.jpg/500px-Thierry_Henry_%2851649035951%29_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Web Summit",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Thierry_Henry_(51649035951)_(cropped).jpg"
  },
  "ronaldo": {
    "name": "Ronaldo",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/051119SMcC0014.jpg/500px-051119SMcC0014.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Web Summit",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:051119SMcC0014.jpg"
  },
  "ronaldinho": {
    "name": "Ronaldinho",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Ronaldinho_in_2019.jpg/500px-Ronaldinho_in_2019.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Marcos Corrêa/PR",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Ronaldinho_in_2019.jpg"
  },
  "kaka": {
    "name": "Kaká",
    "url": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Ricardo_Izecson_dos_Santos_Leite_%28Kak%C3%A1%29_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "José Cruz/ABr (cropped by tales.ebner )",
    "license": "CC BY 3.0 br",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/br/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Ricardo_Izecson_dos_Santos_Leite_(Kak%C3%A1)_01.jpg"
  },
  "bergkamp": {
    "name": "Dennis Bergkamp",
    "url": "https://upload.wikimedia.org/wikipedia/commons/7/75/Dennis_Bergkamp_2014_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Kieran Clarke",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Dennis_Bergkamp_2014_(cropped).jpg"
  },
  "beckham": {
    "name": "David Beckham",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/David_Beckham_2009.jpg/500px-David_Beckham_2009.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "The Democratic Alliance",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:David_Beckham_2009.jpg"
  },
  "raul": {
    "name": "Raúl González",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Raul_Gonzalez_2012_2.jpg/500px-Raul_Gonzalez_2012_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Doha Stadium Plus Qatar",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Raul_Gonzalez_2012_2.jpg"
  },
  "klose": {
    "name": "Miroslav Klose",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/2016209185719_2016-07-27_Champions_for_Charity_-_Sven_-_1D_X_-_0149_-_DV3P4742_mod.jpg/500px-2016209185719_2016-07-27_Champions_for_Charity_-_Sven_-_1D_X_-_0149_-_DV3P4742_mod.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Sven Mandel",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:2016209185719_2016-07-27_Champions_for_Charity_-_Sven_-_1D_X_-_0149_-_DV3P4742_mod.jpg"
  },
  "ribery": {
    "name": "Franck Ribéry",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Franck_Ribery_2019_%28cropped%29.jpg/500px-Franck_Ribery_2019_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Sven Mandel",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Franck_Ribery_2019_(cropped).jpg"
  },
  "pirlo": {
    "name": "Andrea Pirlo",
    "url": "https://upload.wikimedia.org/wikipedia/commons/6/6e/20150616_-_Portugal_-_Italie_-_Gen%C3%A8ve_-_Andrea_Pirlo_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Clément Bucco-Lechat",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:20150616_-_Portugal_-_Italie_-_Gen%C3%A8ve_-_Andrea_Pirlo_(cropped).jpg"
  },
  "ftorres": {
    "name": "Fernando Torres",
    "url": "https://upload.wikimedia.org/wikipedia/commons/5/57/Fernando_Torres_2017.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "cristina cifuentes",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Fernando_Torres_2017.jpg"
  },
  "villa": {
    "name": "David Villa",
    "url": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Spain-Tahiti%2C_Confederations_Cup_2013_%2802%29_%28Villa_crop%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Tânia Rêgo/ABr",
    "license": "CC BY 3.0 br",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/br/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:Spain-Tahiti,_Confederations_Cup_2013_(02)_(Villa_crop).jpg"
  },
  "messi": {
    "name": "Lionel Messi",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/500px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg"
  },
  "cr7": {
    "name": "Cristiano Ronaldo",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/500px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_(cropped).jpg"
  },
  "xavi": {
    "name": "Xavi Hernández",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Xavi_13981129001173637176666027076571.jpg/500px-Xavi_13981129001173637176666027076571.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Mehdi Zare",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Xavi_13981129001173637176666027076571.jpg"
  },
  "iniesta": {
    "name": "Andrés Iniesta",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Andr%C3%A9s_Iniesta_Argentina_v_Spain_19_July_2026-034_%28cropped%29.jpg/500px-Andr%C3%A9s_Iniesta_Argentina_v_Spain_19_July_2026-034_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Andr%C3%A9s_Iniesta_Argentina_v_Spain_19_July_2026-034_(cropped).jpg"
  },
  "lahm": {
    "name": "Philipp Lahm",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Philipp_Lahm_auf_der_Berlinale_2024%2C_Ausschnitt.jpg/500px-Philipp_Lahm_auf_der_Berlinale_2024%2C_Ausschnitt.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Elena Ternovaja",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Philipp_Lahm_auf_der_Berlinale_2024,_Ausschnitt.jpg"
  },
  "muller": {
    "name": "Thomas Müller",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Thomas_M%C3%BCller_2022_%28cropped%29.jpg/500px-Thomas_M%C3%BCller_2022_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Werner100359",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Thomas_M%C3%BCller_2022_(cropped).jpg"
  },
  "neuer": {
    "name": "Manuel Neuer",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Manuel_Neuer_Ecuador_v_Germany_25_June_2026-148.jpg/500px-Manuel_Neuer_Ecuador_v_Germany_25_June_2026-148.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Manuel_Neuer_Ecuador_v_Germany_25_June_2026-148.jpg"
  },
  "forlan": {
    "name": "Diego Forlán",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/U10_Diego_Forl%C3%A1n_7524.jpg/500px-U10_Diego_Forl%C3%A1n_7524.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Ailura",
    "license": "CC BY-SA 3.0 at",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/at/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:U10_Diego_Forl%C3%A1n_7524.jpg"
  },
  "suarez": {
    "name": "Luis Suárez",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Luis_Su%C3%A1rez_NE_Revolution_Inter_Miami_7.9.25-053_%28cropped%29.jpg/500px-Luis_Su%C3%A1rez_NE_Revolution_Inter_Miami_7.9.25-053_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Luis_Su%C3%A1rez_NE_Revolution_Inter_Miami_7.9.25-053_(cropped).jpg"
  },
  "cavani": {
    "name": "Edinson Cavani",
    "url": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Edinson_Cavani_2018_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Анна Нэсси",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Edinson_Cavani_2018_(cropped).jpg"
  },
  "robben": {
    "name": "Arjen Robben",
    "url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Arjen_Robben_2013.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "author": "Дмитрий Садовников",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Arjen_Robben_2013.jpg"
  },
  "james": {
    "name": "James Rodríguez",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/James_al_natural_-_Series%2C_02.jpg/500px-James_al_natural_-_Series%2C_02.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Canal 10 Gold",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:James_al_natural_-_Series,_02.jpg"
  },
  "benzema": {
    "name": "Karim Benzema",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Karim_Benzema_Pick.jpg/500px-Karim_Benzema_Pick.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Zack",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Karim_Benzema_Pick.jpg"
  },
  "neymar": {
    "name": "Neymar",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg/500px-Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg"
  },
  "kdb": {
    "name": "Kevin De Bruyne",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg/500px-Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_(cropped).jpg"
  },
  "modric": {
    "name": "Luka Modrić",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg/500px-Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Luka_Modric_Croatia_v_Portugal_2_July_2026-055.jpg"
  },
  "mbappe": {
    "name": "Kylian Mbappé",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg/500px-Kylian_Mbappe_France_v_Senegal_16_June_2026-391_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kylian_Mbappe_France_v_Senegal_16_June_2026-391_(cropped).jpg"
  },
  "griezmann": {
    "name": "Antoine Griezmann",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Antoine_Griezmann_%2851100409504%29_%28cropped%29.jpg/500px-Antoine_Griezmann_%2851100409504%29_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Biser Todorov ( User:Biso ) from Sofia, Bulgaria",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "source": "https://commons.wikimedia.org/wiki/File:Antoine_Griezmann_(51100409504)_(cropped).jpg"
  },
  "kane": {
    "name": "Harry Kane",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Harry_Kane_England_v_Ghana_23_June_2026-219_%28cropped%29.jpg/500px-Harry_Kane_England_v_Ghana_23_June_2026-219_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Harry_Kane_England_v_Ghana_23_June_2026-219_(cropped).jpg"
  },
  "bellingham": {
    "name": "Jude Bellingham",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg/500px-Jude_Bellingham_England_v_Ghana_23_June_2026-061_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Jude_Bellingham_England_v_Ghana_23_June_2026-061_(cropped).jpg"
  },
  "foden": {
    "name": "Phil Foden",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg/500px-2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2613%2C_Phil_Foden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Steffen Prößdorf",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:2023-10-04_Fu%C3%9Fball,_M%C3%A4nner,_UEFA_Champions_League,_RB_Leipzig_-_Manchester_City_FC_1DX_2613,_Phil_Foden.jpg"
  },
  "vini": {
    "name": "Vinicius Júnior",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg/500px-Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Vin%C3%ADcius_J%C3%BAnior_Brazil_V_Morocco_13_June_2026-207_(cropped).jpg"
  },
  "vandijk": {
    "name": "Virgil van Dijk",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/20160604_AUT_NED_8876_%28cropped%29.jpg/500px-20160604_AUT_NED_8876_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Ailura",
    "license": "CC BY-SA 3.0 at",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/at/deed.en",
    "source": "https://commons.wikimedia.org/wiki/File:20160604_AUT_NED_8876_(cropped).jpg"
  },
  "pedri": {
    "name": "Pedri",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Pedri_France_v_Spain_7.24.26-245.jpg/500px-Pedri_France_v_Spain_7.24.26-245.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Pedri_France_v_Spain_7.24.26-245.jpg"
  },
  "gavi": {
    "name": "Gavi",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Gavi_France_v_Spain_7.24.26-275_%28cropped%29.jpg/500px-Gavi_France_v_Spain_7.24.26-275_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Gavi_France_v_Spain_7.24.26-275_(cropped).jpg"
  },
  "musiala": {
    "name": "Jamal Musiala",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Jamal_Musiala_Ecuador_v_Germany_25_June_2026-174_%28cropped%29.jpg/500px-Jamal_Musiala_Ecuador_v_Germany_25_June_2026-174_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Jamal_Musiala_Ecuador_v_Germany_25_June_2026-174_(cropped).jpg"
  },
  "hakimi": {
    "name": "Achraf Hakimi",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Achraf_Hakimi_Morocco_v_Norway_7_June_2026-16.jpg/500px-Achraf_Hakimi_Morocco_v_Norway_7_June_2026-16.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Achraf_Hakimi_Morocco_v_Norway_7_June_2026-16.jpg"
  },
  "yamal": {
    "name": "Lamine Yamal",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Lamine_Yamal_Argentina_v_Spain_19_July_2026-214_%28new_cropped%29.jpg/500px-Lamine_Yamal_Argentina_v_Spain_19_July_2026-214_%28new_cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Lamine_Yamal_Argentina_v_Spain_19_July_2026-214_(new_cropped).jpg"
  },
  "wirtz": {
    "name": "Florian Wirtz",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Florian_Wirtz_Ecuador_v_Germany_25_June_2026-181_%28cropped%29.jpg/500px-Florian_Wirtz_Ecuador_v_Germany_25_June_2026-181_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Florian_Wirtz_Ecuador_v_Germany_25_June_2026-181_(cropped).jpg"
  },
  "endrick": {
    "name": "Endrick Felipe",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Team_Brazil_at_2026_FIFA_World_Cup_by_YantsImages_%28Endrick%29.jpg/500px-Team_Brazil_at_2026_FIFA_World_Cup_by_YantsImages_%28Endrick%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "YantsImages",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Team_Brazil_at_2026_FIFA_World_Cup_by_YantsImages_(Endrick).jpg"
  },
  "davies": {
    "name": "Alphonso Davies",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Alphonso_Davies_Canada_v_Qatar_18_June_2026-007_%28cropped%29.jpg/500px-Alphonso_Davies_Canada_v_Qatar_18_June_2026-007_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Bryan Berlin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Alphonso_Davies_Canada_v_Qatar_18_June_2026-007_(cropped).jpg"
  },
  "darwin": {
    "name": "Darwin Núñez",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Darwin_N%C3%BA%C3%B1ez_%28cropped%29.jpg/500px-Darwin_N%C3%BA%C3%B1ez_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Steffen Prößdorf",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Darwin_N%C3%BA%C3%B1ez_(cropped).jpg"
  },
  "donnarumma": {
    "name": "Gianluigi Donnarumma",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Norway_Italy_-_June_2025_B_33_-_Gianluigi_Donnarumma_%28close-up%29.jpg/500px-Norway_Italy_-_June_2025_B_33_-_Gianluigi_Donnarumma_%28close-up%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Original: MichaelEmilio / Derivative work: Danyele",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:Norway_Italy_-_June_2025_B_33_-_Gianluigi_Donnarumma_(close-up).jpg"
  },
  "son": {
    "name": "Son Heung-min",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/BFA_2023_-2_Heung-Min_Son_%28cropped%29.jpg/500px-BFA_2023_-2_Heung-Min_Son_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Ujishadow",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:BFA_2023_-2_Heung-Min_Son_(cropped).jpg"
  },
  "xavisimons": {
    "name": "Xavi Simons",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2672_%28Xavi_Simons%29.jpg/500px-2023-10-04_Fu%C3%9Fball%2C_M%C3%A4nner%2C_UEFA_Champions_League%2C_RB_Leipzig_-_Manchester_City_FC_1DX_2672_%28Xavi_Simons%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "Original: Steffen Prößdorf ; Derivative work: SonoGrazy",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "source": "https://commons.wikimedia.org/wiki/File:2023-10-04_Fu%C3%9Fball,_M%C3%A4nner,_UEFA_Champions_League,_RB_Leipzig_-_Manchester_City_FC_1DX_2672_(Xavi_Simons).jpg"
  },
  "mitoma": {
    "name": "Kaoru Mitoma",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Kaoru_Mitoma_00-01-48.01.png/500px-Kaoru_Mitoma_00-01-48.01.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "author": "AFC Bournemouth",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "source": "https://commons.wikimedia.org/wiki/File:Kaoru_Mitoma_00-01-48.01.png"
  }
};
