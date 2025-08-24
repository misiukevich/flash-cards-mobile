import { parseCSV } from './csvParser';
import { LanguageData, FlashCard } from '../types';

// Sample data based on the actual CSV files
const ENGLISH_CSV_DATA = `Item,Translation,Context,Context translation
annual,годовой,annual payment for life,ежегодный пожизненный платеж
on condition,при условии,on condition that he receive smth,"при условии, что он получит что-то"
to stick,придерживаться,to stick to commitments,придерживаться обязательств
retirement,уход на пенсию / уход в отставку,he spent much of his retirement traveling in Europe,"он провел большую часть своей пенсии, путешествуя по Европе"
to resist,сопротивляться,antibodies help us to resist infection,антитела помогают нам противостоять инфекции
to lack,не хватать / испытывать недостаток,,
lack,недостаток,his lack of manners is unbelievable,его отсутствие манер невероятно
capable,способный,I'm quite capable of taking care of myself,Я вполне способен позаботиться о себе
frighten,пугать,if you say anything to him you might frighten him,"если ты ему что-нибудь скажешь, можешь напугать его"
in spite of,несмотря на,,
failure,неудача,,
determined,определенный / решительный,determined to succeed,полон решимости добиться успеха
evident,очевидный,she ate the cookies with evident enjoyment,она съела печенье с явным удовольствием
courage,смелость,,
amusing,забавный,,
towards,в направлении,the first step towards peace,первый шаг к миру
proven,доказано / доказанный,a proven risk to health,доказанный риск для здоровья
brainwash,промывание мозгов,the organization could brainwash young people,организация могла промыть мозги молодым людям
signpost,указатель,,
recover,восстанавливать,the economy has begun to recover,экономика начала восстанавливаться
janitor,дворник,,
increase,увеличивать,he was waiting for the next pay increase,он ждал следующего повышения зарплаты
figure out,выяснить / понять / придумать,Then you better figure out how to catch him,"Тогда тебе лучше придумать / выяснить, как его поймать"
cause,причина,"I have a cause, several actually.","У меня есть причина, на самом деле несколько."
confidence,уверенность / доверие,They have our confidence and support.,Они могут рассчитывать на наше доверие и поддержку.
engagement,помолвка,We agreed our engagement was strictly business.,"Мы решили, что наша помолвка всего лишь формальность."
fertility,плодородие / плодовитость,improve the soil fertility by adding compost,"улучшить плодородие почвы, добавив компост"
pagan,язычник,My husband is just like that pagan emperor.,"Мой муж точно такой же, как тот языческий император."
burial,захоронение,,
coincidence,совпадение,It was no coincidence that we met.,"То, что мы встретились - это не совпадение."
sacrifice,жертва / жертвоприношение,This requires the sacrifice of time and energy.,Это требует жертв - в плане времени и энергии.
conspiracy,заговор,"When something happens, she sees it as a conspiracy.","Когда что-то случается, она воспринимает это как заговор."
essential,существенный / необходимый,But we believe that more than legitimacy is essential to success.,"Но мы считаем, что для успеха необходимо нечто большее, чем легитимность."
essentials,предметы первой необходимости,,
remain,оставаться,it'll still remain a part of our culture,это по-прежнему останется частью нашей культуры
encourage,поощрять,they encourage us to keep working,они побуждают нас продолжать работать
loan,кредит / заём / ссуда,"borrowers can take out a loan for $84,000",заемщики могут взять ссуду на $ 84 000
goat,козел / коза,You'd do better if you buy a goat.,"Вы бы поступили умнее, купив козу."
intend,собираться / намереваться,What do you intend doing about it?,Что вы собираетесь с этим делать?
obtain,получать,I had to obtain permission from her father,Мне пришлось получить разрешение от ее отца
actually,фактически / на самом деле,he actually expected me to be pleased about it!,"он на самом деле ожидал, что я буду доволен этим!"
possess,обладать / владеть,he did not possess a sense of humor,он не обладал чувством юмора
gain,получить / добиться / выгода / усиление,"Whenever another creature comes into play, you gain 1 life.","Каждый раз, когда в игру входит другое существо, вы получаете 1 жизнь."
prediction,прогнозирование / предсказание,the prediction of future behavior,предсказание будущего поведения
gap,зазор,,
sustainable,стабильный,,
aspiration,стремление,,
pros and cons,плюсы и минусы,,
meassure,мера,,
high-end,лидирующий,,
struggle,борьба,,
praise,хвалить,,
impact,влияние,,
wealth,богатство,,
affairs,дела,,
suppliers,поставщики,,
suspiciously,подозрительно,,
half as much,вдвое меньше,,
twice as much / double price,вдвое больше,,
evidence,свидетельство / доказательство,,
suspect,подозревать,,
victim,жертва,,
witness,свидетель,,
patient,терпеливый / пациент,,
hitchhike,автостоп,,
prodigy,вундеркинд,,
enhances,усиливать,,
embarrassed,смущенный,,
confused,спутанный / смущенный,He was totally confused by the new company policy,
frustrated,растроенный,,
try on,примерять,,
dress up,наряжаться,,
outfit,наряд,,
put off,откладывать,,
take off,снять,,
kick out,выгонять,,
settle down,успокоиться / остепениться / поселиться,,
mind your own business,не лезь не в свое дело / занимайся своим делом,,
keep myself to myself,быть наедине с собой,,
otherwise,иначе,,
Make yourself at home!,чувствуй себя как дома,,
mess,беспорядок,,
to mess,возиться,,
reserved,сдержанный,,
find out,выяснить / понять / придумать,,
applicable,применимый,,
diverse,разнообразный,,
to leverage,использовать,,
leverage,система рычагов,,
nightmare,страшный сон,,
catfish,сом,,
alike,точно так же / одинаково,,
cosy,уютный,,
cosiness,уют,,
awareness,осведомленность / осознание,,
to be aware of, быть в курсе,,
comforting,утешительный,,
to tend to,склоняться к,,
to associate,ассоциировать,`;

const POLISH_CSV_DATA = `Item,Translation,Context,Context translation
zapewnić,обеспечить,,
urządzenia,устройства,,
sprzęt,оборудование,может быть и про спортивное обородувание и про технику и тд,
sokowirówka,соковыжималка,,
blender,блендер,,
robot kuchenny,кухонный комбайн,,
deska do prasowania,гладильная доска,,
gust,вкус,,
właśnie,только что / точно / верно,,
czyli,то есть,,
jak,как,"Jak bedziesz w Krakowie, zadzwoń do nas.",
jakby,как,"Jakbyś była w Krakowie, zadzwoń do nas.",
jeśli,если,"Jeśli (jeżeli) masz ochote, możemy iść na kawę.",
jeśliby,если,"Jeślibyscie przyjechali do Krakowa, pokazalibyśmy wam Kazimierz.",
"chociaż, choć",хотя,,
natomiast,тогда как,,
"lecz, ale",но,,
więc,поэтому,,
ponieważ,поскольку / потому что,,
bowiem,так как,,
mimo,несмотря на,,
tędy,сюда,,
tamtędy,туда,,
zostawać,остаться,,
garnitur,костюм,,
krawat,галстук,,
rękawiczki,перчатки,,
czapka,шапка,,
kurtka,куртка,,
spodnie,брюки,,
skórzany,кожаный,,
w kropki,в горошек,,
wełna,шерсть,,
gruba,грубая,,
cienki,тонкий,,
nie stać mnie na,я не могу себе позволить,,
kasa,каса / деньги,nie mam kasy,не могу заплатить
trwonić,растрачивать,,
wydawać,тратить,,
ogólnie,вообще,,
opinia / zdanie,мнение,,
okoliczności,обстоятельства,,
szacunek,уважение,,
wreszcie,наконец,,
najwyższy i najgrubszy,самый высокий и самый толстый,,
chrupiący,хрустящий,,
sprzątać,убирать,,
podnieść słuchawkę,поднять трубку ,,
załatwić,уладить,,
należeć do,принадлежать к,,
bliźniak,близнец,,
urodziłem się,я родился,,
zwiedzać,посещать,,
wychodzić za mąż,выйти замуж,,
sufit,потолок,,
spiżarnia,кладовая,,
pokój dziecięcy,детская комната,,
korytarz,коридор,,
łazienka,ванная комната,,
twój wymarzony dom,дом вашей мечты,,
parter,первый этаж,,
piętro,этаж,,
przeprowadzka,переезд,,
gabinet,кабинет,,
toaleta,туалет,,
jadalnia,столовая,,
taras,терраса,,
przedpokój,прихожая,,
wybitna,выдающаяся,,
niezdecydowany,нерешительный,,
dziennikarz,журналист,,
pić mi się chce,хочется пить,,
samodzielny,самостоятельный,,
roztrzepany,рассеянный,,
smutny,грустный,,
mam to w dupie,мне плевать,,
gościu,незнакомец,,
ziomek,земляк,,
chodnik,тротуар,,
regał,стеллаж,,
na plaży,на пляже,,
łyżwy,коньки,,
narty,лыжи,,
w doniczce,в горшке,,
wady i zalety,минусы и плюсы,zalety - преимущества; wady - недостатки,
łatwy,легкий,,
uważam,я считаю / я думаю,,
wynagrodzenie,зарплата,,
połączyć,объединить,,
irytuje,раздражает,,
rządzić,управлять,,
wstręt,отвращение,,
wymyślić,придумать,,
radość,радость,,
wstyd,стыд,,
smutek,печаль,,
woda spada/biegnie,вода падает / бежит,,
skomplikowane,сложно,,
bez PIENIĘDZY,без денег,`;

export const loadCSVData = async (): Promise<LanguageData> => {
  try {
    // Parse the CSV data
    const englishCards = parseCSV(ENGLISH_CSV_DATA, 'english');
    const polishCards = parseCSV(POLISH_CSV_DATA, 'polish');

    return {
      english: englishCards,
      polish: polishCards,
    };
  } catch (error) {
    console.error('Error loading CSV data:', error);
    throw new Error('Failed to load CSV data');
  }
};
