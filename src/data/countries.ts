import { Country, CriterionInfo } from '../types';

export const COUNTRIES: Country[] = [
  { id: 1, performanceOrder: 1, countryCode: 'DK', country: 'Данія', artist: 'Søren Torpegaard Lund', song: 'Før Vi Går Hjem', youtubeId: 'lqXYe1SHNZA' },
  { id: 2, performanceOrder: 2, countryCode: 'DE', country: 'Німеччина', artist: 'Sarah Engels', song: 'Fire', youtubeId: 'FpGjPN1E2DE' },
  { id: 3, performanceOrder: 3, countryCode: 'IL', country: 'Ізраїль', artist: 'Noam Bettan', song: 'Michelle', youtubeId: 'L9JVTSHKeqc' },
  { id: 4, performanceOrder: 4, countryCode: 'BE', country: 'Бельгія', artist: 'ESSYLA', song: 'Dancing on the Ice', youtubeId: 'hz8CWouTIoo' },
  { id: 5, performanceOrder: 5, countryCode: 'AL', country: 'Албанія', artist: 'Alis', song: 'Nân', youtubeId: 'FBoF2J8Mrbw' },
  { id: 6, performanceOrder: 6, countryCode: 'GR', country: 'Греція', artist: 'Akylas', song: 'Ferto', youtubeId: 'G0y1sZ4CxaE' },
  { id: 7, performanceOrder: 7, countryCode: 'UA', country: 'Україна', artist: 'LELÉKA', song: 'Ridnym', youtubeId: 'oSUIylL64XU' },
  { id: 8, performanceOrder: 8, countryCode: 'AU', country: 'Австралія', artist: 'Delta Goodrem', song: 'Eclipse', youtubeId: 'xlze1NdwlII' },
  { id: 9, performanceOrder: 9, countryCode: 'RS', country: 'Сербія', artist: 'LAVINA', song: 'Kraj Mene', youtubeId: 'uyfdKvR1nJM' },
  { id: 10, performanceOrder: 10, countryCode: 'MT', country: 'Мальта', artist: 'AIDAN', song: 'Bella', youtubeId: 'FpG_DV2jAQo' },
  { id: 11, performanceOrder: 11, countryCode: 'CZ', country: 'Чехія', artist: 'Daniel Zizka', song: 'CROSSROADS', youtubeId: 'MNfJxo04M5I' },
  { id: 12, performanceOrder: 12, countryCode: 'BG', country: 'Болгарія', artist: 'DARA', song: 'Bangaranga', youtubeId: '4Mxq2WCAhT4' },
  { id: 13, performanceOrder: 13, countryCode: 'HR', country: 'Хорватія', artist: 'LELEK', song: 'Andromeda', youtubeId: '-qtoDzlS-rk' },
  { id: 14, performanceOrder: 14, countryCode: 'GB', country: 'Велика Британія', artist: 'LOOK MUM NO COMPUTER', song: 'Eins, Zwei, Drei', youtubeId: 'xnls0LHAJLg' },
  { id: 15, performanceOrder: 15, countryCode: 'FR', country: 'Франція', artist: 'Monroe', song: 'Regarde !', youtubeId: 'YwwE7zqQ6XM' },
  { id: 16, performanceOrder: 16, countryCode: 'MD', country: 'Молдова', artist: 'Satoshi', song: 'Viva, Moldova!', youtubeId: 'sJjTOalT4DY' },
  { id: 17, performanceOrder: 17, countryCode: 'FI', country: 'Фінляндія', artist: 'Linda Lampenius x Pete Parkkonen', song: 'Liekinheitin', youtubeId: 'i8vlDO89YQA' },
  { id: 18, performanceOrder: 18, countryCode: 'PL', country: 'Польща', artist: 'ALICJA', song: 'Pray', youtubeId: 'WsmVIlscdJU' },
  { id: 19, performanceOrder: 19, countryCode: 'LT', country: 'Литва', artist: 'Lion Ceccah', song: 'Sólo Quiero Más', youtubeId: '_0kkvvTc3hQ' },
  { id: 20, performanceOrder: 20, countryCode: 'SE', country: 'Швеція', artist: 'FELICIA', song: 'My System', youtubeId: 'az6XIorzZxM' },
  { id: 21, performanceOrder: 21, countryCode: 'CY', country: 'Кіпр', artist: 'Antigoni', song: 'JALLA', youtubeId: 'QMjGilVXpD0' },
  { id: 22, performanceOrder: 22, countryCode: 'IT', country: 'Італія', artist: 'Sal Da Vinci', song: 'Per Sempre Sì', youtubeId: 'OknnSe8SG8Q' },
  { id: 23, performanceOrder: 23, countryCode: 'NO', country: 'Норвегія', artist: 'JONAS LOVV', song: 'YA YA YA', youtubeId: 'FcFaMMTz5-M' },
  { id: 24, performanceOrder: 24, countryCode: 'RO', country: 'Румунія', artist: 'Alexandra Căpitănescu', song: 'Choke Me', youtubeId: 'xJgWNtg6YPo' },
  { id: 25, performanceOrder: 25, countryCode: 'AT', country: 'Австрія', artist: 'COSMÓ', song: 'Tanzschein', youtubeId: 'F9YqxdIzPQk' },
];

export const CRITERIA: CriterionInfo[] = [
  { key: 'vocal', labelUk: 'Вокал', labelEn: 'Vocal', description: 'Якість живого вокалу' },
  { key: 'stage', labelUk: 'Шоу', labelEn: 'Stage', description: 'Хореографія, костюми, сцена' },
  { key: 'song', labelUk: 'Пісня', labelEn: 'Song', description: 'Мелодія, текст, аранжування' },
  { key: 'overall', labelUk: 'Загальне', labelEn: 'Overall', description: "Суб'єктивне враження" },
];