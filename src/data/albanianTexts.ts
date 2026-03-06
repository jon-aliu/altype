export interface TextEntry {
  id: number;
  title: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
}

const albanianTexts: TextEntry[] = [
  {
    id: 1,
    title: "Natyra Shqiptare",
    difficulty: "easy",
    text: "Shqipëria është një vend i vogël por i bukur. Malet e saj janë të larta dhe lumenjtë janë të pastër. Njerëzit janë të ngrohtë dhe mikpritës. Traditat shqiptare janë shumë të vjetra dhe të çmuara. Gjuha shqipe është një nga gjuhët më të vjetra në Europë.",
  },
  {
    id: 2,
    title: "Deti Adriatik",
    difficulty: "easy",
    text: "Deti Adriatik lag brigjet perëndimore të Shqipërisë. Uji është i pastër dhe i ngrohtë gjatë verës. Peshkatarët dalin në det çdo mëngjes herët. Fshatrat bregdetare kanë një histori të gjatë. Turistët vijnë çdo vit për të shijuar bukuritë natyrore.",
  },
  {
    id: 3,
    title: "Kultura dhe Tradita",
    difficulty: "medium",
    text: "Kultura shqiptare ka rrënjë të thella historike. Muzika polifonike është shpallur trashëgimi botërore nga UNESCO. Vallet tradicionale të Shqipërisë janë të ndryshme dhe të pasura. Kostumi kombëtar shqiptar ka shumë variacione sipas krahinave. Bektashizmi dhe islami janë dy tradita fetare kryesore.",
  },
  {
    id: 4,
    title: "Historia e Skënderbeut",
    difficulty: "medium",
    text: "Gjergj Kastrioti Skënderbeu ishte heroi kombëtar i shqiptarëve. Ai luftoi kundër pushtimit osman për mbi njëzet vjet. Kështjella e Krujës ishte qendra e rezistencës shqiptare. Skënderbeu fitoi shumë beteja falë strategjisë dhe trimërisë. Emri i tij është simbol i lirisë dhe krenarisë kombëtare.",
  },
  {
    id: 5,
    title: "Tirana Moderne",
    difficulty: "medium",
    text: "Tirana është kryeqyteti dhe qyteti më i madh i Shqipërisë. Gjatë dy dekadave të fundit, qyteti ka ndryshuar shumë. Ndërtesat e reja bashkëkohore janë ngritur pranë atyre historike. Bulevardi kryesor është vendi ku mbledhen banorët çdo ditë. Parqet e gjelbra ofrojnë hapësira pushimi për familjet.",
  },
  {
    id: 6,
    title: "Ekonomia dhe Progresi",
    difficulty: "hard",
    text: "Ekonomia shqiptare ka pësuar transformime të thella gjatë tranzicionit demokratik. Investimet e huaja janë rritur ndjeshëm vitet e fundit, sidomos në sektorin e turizmit dhe të energjisë. Infrastruktura rrugore dhe hekurudhore po modernizohet me financime europiane. Eksportet e produkteve bujqësore dhe tekstilit kanë shënuar rritje të konsiderueshme. Integrimi europian mbetet prioriteti kryesor i politikës së jashtme shqiptare.",
  },
  {
    id: 7,
    title: "Letërsia Shqipe",
    difficulty: "hard",
    text: "Letërsia shqipe ka një traditë të pasur që shkon shumë shekuj mbrapa. Naim Frashëri konsiderohet poeti kombëtar i shqiptarëve dhe vepra e tij ka influencuar brezat. Ismail Kadare është shkrimtari shqiptar më i njohur në botë dhe veprat e tij janë përkthyer në dhjetëra gjuhë. Letërsia bashkëkohore shqiptare trajton tema universale si identiteti, memoria dhe liria. Leximi i letërsisë kombëtare është mënyra më e mirë për të njohur shpirtin e një populli.",
  },
  {
    id: 8,
    title: "Gastronomia Shqiptare",
    difficulty: "easy",
    text: "Kuzhina shqiptare është e shijshme dhe e larmishme. Byrekët me djathë ose me spinaq janë të njohur kudo. Mishi i qengjit është pjata tradicionale kryesore. Frutat dhe perimet shqiptare janë të freskëta dhe të shijshme. Rakija është pija tradicionale e prodhuar nga fruta të ndryshme.",
  },
];

export default albanianTexts;
