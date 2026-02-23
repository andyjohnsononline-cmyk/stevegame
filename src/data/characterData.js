export const CHARACTERS = [
  {
    id: 'katrien',
    type: 'auteur',
    notePreference: 'gentle',
    name: 'Katrien van der Berg',
    role: 'filmmaker',
    personality: 'Refuses notes, brilliant if trusted. Believes cinema should challenge, not comfort. Intense and uncompromising.',
    preferredTone: 'gentle',
    dialoguePool: {
      greeting: [
        'Steve. I hope you\'ve come with something more interesting than "audience testing."',
        'Ah, the gatekeeper. Tell me—have you actually watched any Tarkovsky?',
        'Steve. I was just contemplating the light on the water. It\'s quite Bressonian today.',
        'You again. I trust you\'ve read the script and not just the coverage.',
        'Steve. Come, sit. Let\'s discuss cinema as if it matters.',
      ],
      casual: [
        'The problem with most executives is they think in quarters, not centuries.',
        'I\'ve been shooting on 16mm. Digital is a compromise I refuse to make.',
        'Did you see the new film at the EYE? Pretentious, but at least it tried.',
        'Amsterdam is beautiful, but the light is better in Rotterdam. Don\'t tell anyone I said that.',
        'My last film played in a sidebar at Venice. The main competition was... predictable.',
      ],
      heartTwo: [
        'You didn\'t immediately suggest I cut the long take. That\'s something.',
        'Perhaps you\'re not entirely lost to the algorithm. Perhaps.',
        'I\'ve had worse meetings. That isn\'t praise. But it isn\'t nothing.',
      ],
      heartFive: [
        'Your notes on the third act—precise. I\'ve already begun revisions.',
        'I didn\'t expect an executive to grasp the subtext. Color me surprised.',
        'You\'ve earned the right to call yourself a collaborator, Steve.',
      ],
      pleased: [
        'Your notes on the third act—precise. I\'ve already begun revisions.',
        'I didn\'t expect an executive to grasp the subtext. Color me surprised.',
        'You\'ve earned the right to call yourself a collaborator, Steve.',
      ],
      special: [
        'I\'m considering a project. You might be the only executive I\'d trust with it.',
        'The festival invited us. I suppose your support had something to do with it.',
      ],
      upset: [
        'So you\'ve joined the philistines. I expected better.',
        'Commercial viability? Is that what we\'re calling cowardice now?',
      ],
    },
    portraitColors: { hair: '#2c1810', skin: '#e8c4a0', shirt: '#4a3728' },
  },
  {
    id: 'marco',
    type: 'newcomer',
    notePreference: 'balanced',
    name: 'Marco Rossi',
    role: 'filmmaker',
    personality: 'Eager, raw talent, needs guidance. Hungry to learn and grateful for any feedback. Sometimes too eager.',
    preferredTone: 'balanced',
    dialoguePool: {
      greeting: [
        'Steve! Oh my god, hi! I\'ve been hoping I\'d run into you.',
        'Steve! Thank you so much for taking the time. Really, I mean it.',
        'Hey! Is it okay if I call you Steve? I feel like we\'re almost friends now.',
        'Steve! I just got your email. I\'ve read it like five times already.',
        'Hi! Sorry, I\'m a bit nervous. I\'ve never really done this before.',
      ],
      casual: [
        'I\'ve been watching so many films for research. My flatmate thinks I\'ve gone mad.',
        'Do you think it\'s too soon to ask about a second meeting? I don\'t want to be pushy.',
        'I rewrote the opening three times this week. I hope that\'s not too much.',
        'Someone told me the market is shifting toward limited series. Should I be worried?',
        'I\'ve been taking notes on everything you said. It\'s been incredibly helpful.',
      ],
      heartTwo: [
        'You actually read the whole thing? Most people just skim. I could tell.',
        'Your notes weren\'t mean. That sounds stupid, but it matters. A lot.',
        'I\'ve been showing your feedback to my writing group. They\'re impressed.',
      ],
      heartFive: [
        'You really liked it? Oh wow. I might actually cry. Good tears!',
        'Your notes were so clear. I finally understand what was wrong with act two.',
        'I can\'t believe you\'re actually investing in me. I won\'t let you down.',
      ],
      pleased: [
        'You really liked it? Oh wow. I might actually cry. Good tears!',
        'Your notes were so clear. I finally understand what was wrong with act two.',
        'I can\'t believe you\'re actually investing in me. I won\'t let you down.',
      ],
      special: [
        'I\'ve been working on something new. Can I send it to you when it\'s ready?',
        'I got into a development program! Your notes were part of my application.',
      ],
      upset: [
        'I know it wasn\'t perfect. I was hoping you\'d see the potential.',
        'Was it really that bad? I thought the premise was strong at least.',
      ],
    },
    portraitColors: { hair: '#3d2314', skin: '#d4a574', shirt: '#8b4513' },
  },
  {
    id: 'helena',
    type: 'veteran',
    notePreference: 'direct',
    name: 'Helena Johansson',
    role: 'filmmaker',
    personality: 'Lost spark, needs the right project. Thirty years in the industry. Respects honesty above flattery.',
    preferredTone: 'direct',
    dialoguePool: {
      greeting: [
        'Steve. Coffee\'s terrible here, but the company might be better.',
        'There you are. I was starting to think you\'d forgotten about us old-timers.',
        'Steve. Sit. Let\'s talk before the world gets in the way.',
        'Ah, the new blood. Still optimistic, or has the job beaten it out of you?',
        'Steve. Good to see a face that isn\'t staring at a phone.',
      ],
      casual: [
        'I\'ve made twelve films. Four of them made money. Guess which ones I\'m proud of.',
        'The industry\'s changed. Used to be about the work. Now it\'s about the algorithm.',
        'I taught half the directors working today. Most of them don\'t call anymore.',
        'Amsterdam used to have real film culture. Now it\'s all co-productions and tax breaks.',
        'My wife says I\'m too cynical. I say I\'ve earned the right.',
      ],
      heartTwo: [
        'You didn\'t talk down to me. That\'s rare. Executives forget we have wrinkles and wisdom.',
        'Honest feedback. Refreshing. Most executives tell you what you want to hear.',
        'We\'ll see if you\'re still around in twenty years. The good ones usually are.',
      ],
      heartFive: [
        'You didn\'t sugarcoat it. I respect that. The script needed to hear it.',
        'Finally, someone who understands that notes aren\'t personal attacks.',
        'Your instincts are good. Don\'t let the job beat them out of you.',
      ],
      pleased: [
        'You didn\'t sugarcoat it. I respect that. The script needed to hear it.',
        'Finally, someone who understands that notes aren\'t personal attacks.',
        'Your instincts are good. Don\'t let the job beat them out of you.',
      ],
      special: [
        'I\'ve got a project I\'ve been sitting on. Might be my last. Want to hear about it?',
        'The old guard is throwing a dinner. I\'ll put in a word for you.',
      ],
      upset: [
        'I\'ve had worse notes from better people. But not by much.',
        'Direct is one thing. Dismissive is another. Know the difference.',
      ],
    },
    portraitColors: { hair: '#c4a574', skin: '#f5e6d3', shirt: '#5c4033' },
  },
  {
    id: 'jake',
    type: 'hitmaker',
    notePreference: 'balanced',
    name: 'Jake Morrison',
    role: 'filmmaker',
    personality: 'Commercial success, secretly wants art. LA-trained, numbers-driven, but carries a Criterion subscription he never mentions.',
    preferredTone: 'balanced',
    dialoguePool: {
      greeting: [
        'Steve. Let\'s skip the pleasantries. What\'s the number?',
        'There you are. I\'ve got fifteen minutes before my next call with LA.',
        'Steve. Good. I need to know where we stand on the greenlight.',
        'Time is money, Steve. What do you have for me?',
        'Steve. I hope you\'ve done the math. I have.',
      ],
      casual: [
        'My last three projects averaged 47 million views in the first month. Just saying.',
        'The algorithm favors certain structures. I\'ve reverse-engineered them.',
        'I don\'t do passion projects. I do profitable projects that look like passion.',
        'LA thinks Amsterdam is quaint. I think it\'s a tax advantage. We\'re both right.',
        'I\'ve got a spreadsheet that predicts hits. It\'s been right 78% of the time.',
      ],
      heartTwo: [
        'You didn\'t just talk numbers. That\'s... unusual. For an executive. For me.',
        'The art print you gave me—it\'s in my office. Don\'t tell my agent.',
        'Sometimes I wonder what I\'d make if nobody was watching the numbers.',
      ],
      heartFive: [
        'Your commercial notes were spot-on. I\'ve already incorporated them.',
        'We\'re going to make a lot of money together, Steve. I can feel it.',
        'You get it. Most Europeans don\'t. They\'re too busy being "artistic."',
      ],
      pleased: [
        'Your commercial notes were spot-on. I\'ve already incorporated them.',
        'We\'re going to make a lot of money together, Steve. I can feel it.',
        'You get it. Most Europeans don\'t. They\'re too busy being "artistic."',
      ],
      special: [
        'I\'ve got something big coming. You want in, you need to move fast.',
        'There\'s a script. Small. No commercial upside. I want to make it anyway. Your thoughts?',
      ],
      upset: [
        'Character depth? I\'m making content, not therapy.',
        'You\'re going to pass because it\'s "too commercial"? That\'s a first.',
      ],
    },
    portraitColors: { hair: '#1a1a1a', skin: '#c9a86c', shirt: '#1e3a5f' },
  },
  {
    id: 'yuki',
    type: 'festival_darling',
    notePreference: 'gentle',
    name: 'Yuki Tanaka',
    role: 'filmmaker',
    personality: 'Can\'t reach mainstream. Award-winning, critically adored, commercially invisible. Believes mainstream success corrupts.',
    preferredTone: 'gentle',
    dialoguePool: {
      greeting: [
        'Steve. I hope you\'ve come to discuss the work, not the market.',
        'Ah, Steve. The canals are beautiful today. They remind me of Tokyo\'s rivers.',
        'Steve. I\'ve been thinking about your last note. Perhaps there\'s something there.',
        'Hello. I was just considering the relationship between form and content.',
        'Steve. Good. I\'ve been waiting for someone who might understand.',
      ],
      casual: [
        'Cannes was interesting this year. The main competition played it safe, as always.',
        'I\'ve been experimenting with duration. Why must films be 90 minutes?',
        'The Dutch funding system rewards mediocrity. I say this with love.',
        'My last film had no dialogue in the first twenty minutes. The distributors panicked.',
        'I believe every frame should earn its place. Most films don\'t.',
      ],
      heartTwo: [
        'You saw what I was trying to do. Few executives bother to look.',
        'Your note on the visual metaphor in act two—you understood. Thank you.',
        'Perhaps we can make something that matters. Together.',
      ],
      heartFive: [
        'I\'ve been wrong about executives before. I\'m glad to be wrong about you.',
        'Originality is rare. You seem to value it. That\'s rare too.',
        'Berlin has expressed interest. Your early support may have helped.',
      ],
      pleased: [
        'I\'ve been wrong about executives before. I\'m glad to be wrong about you.',
        'Originality is rare. You seem to value it. That\'s rare too.',
        'Berlin has expressed interest. Your early support may have helped.',
      ],
      special: [
        'I\'m developing something radical. You might be the only one who\'d consider it.',
        'The festival circuit will understand. So will you. That\'s enough.',
      ],
      upset: [
        'Commercial appeal? Is that the only lens you have?',
        'I didn\'t make this for an algorithm. I made it for people who feel.',
      ],
    },
    portraitColors: { hair: '#1a1a1a', skin: '#e8d4c4', shirt: '#6b4423' },
  },
  {
    id: 'bernie',
    type: 'boss',
    notePreference: 'balanced',
    name: "Bernard 'Bernie' Okafor",
    role: 'colleague',
    personality: 'VP of Content. Values bold bets. Seen it all, still believes in the work. Demanding but fair.',
    preferredTone: 'balanced',
    dialoguePool: {
      greeting: [
        'Steve. My office. We need to talk about the pipeline.',
        'There you are. I\'ve been reviewing your coverage. We should discuss.',
        'Steve. Good timing. I have feedback on the quarterly report.',
        'Come in. Close the door. This stays between us.',
        'Steve. I hope you\'re ready for a real conversation.',
      ],
      casual: [
        'The board wants more commercial projects. I want quality. We\'ll find the overlap.',
        'I\'ve been doing this for twenty years. The good executives learn to read people.',
        'Your instincts are improving. Don\'t let the pressure make you cautious.',
        'We\'re a small office in a big company. That means we have to fight for our projects.',
        'I\'ve seen executives burn out. Pace yourself. The marathon, not the sprint.',
      ],
      heartTwo: [
        'You took a risk on that script. I noticed. The board might not. I will.',
        'Bold bets require bold executives. Don\'t lose that.',
        'The filmmakers respect you. That\'s worth more than most people realize.',
      ],
      heartFive: [
        'That last greenlight was the right call. The numbers are proving it.',
        'You\'ve grown. I notice these things. Keep it up.',
        'Your notes on the Rossi project—exactly the right balance. Well done.',
      ],
      pleased: [
        'That last greenlight was the right call. The numbers are proving it.',
        'You\'ve grown. I notice these things. Keep it up.',
      ],
      special: [
        'I\'m considering you for the senior role. Don\'t make me regret it.',
        'I\'m putting you on the Morrison pitch. You\'ve earned it.',
      ],
      upset: [
        'We need to talk about the van der Berg situation. My office. Now.',
        'Your coverage on that last script was thin. I expect better.',
      ],
    },
    portraitColors: { hair: '#1a1a1a', skin: '#8d5524', shirt: '#2c3e50' },
  },
  {
    id: 'lena',
    type: 'data_analyst',
    notePreference: 'direct',
    name: 'Lena Vogel',
    role: 'colleague',
    personality: 'Quantifies everything. Distrusts gut instinct but respects those who balance it with data. Nerdy, precise, surprisingly warm.',
    preferredTone: 'direct',
    dialoguePool: {
      greeting: [
        'Steve! Hey, I ran those numbers you asked about. You\'re gonna want to see this.',
        'Oh good, you\'re here. I found something interesting in the viewership data.',
        'Steve! Perfect timing. I\'ve been meaning to show you this dashboard.',
        'Hey. I finished the analysis on the thriller submissions. Spoiler: we\'re oversaturated.',
        'Steve. Quick question—have you looked at the regional breakdown?',
      ],
      casual: [
        'Did you know comedy has a 23% higher completion rate than drama in the 18-24 demo?',
        'I\'ve been building a model to predict festival success. It\'s not great. Yet.',
        'The algorithm favors certain opening structures. I can show you the data.',
        'Everyone thinks they have good instincts. The data says otherwise. Mostly.',
        'I read three scripts last week. For fun. I might have a problem.',
      ],
      heartTwo: [
        'You actually looked at my report. Most executives just ask for the summary.',
        'Your instinct on that project matched the data. Rare alignment.',
        'Keep asking for the numbers. It makes my job feel useful.',
      ],
      heartFive: [
        'You actually used my data in the pitch? That\'s... that\'s great!',
        'We make a good team. You read scripts, I read spreadsheets. Together we\'re unstoppable.',
      ],
      pleased: [
        'You actually used my data in the pitch? That\'s... that\'s great!',
        'We make a good team. You read scripts, I read spreadsheets. Together we\'re unstoppable.',
      ],
      special: [
        'I\'ve got access to some competitor data. Don\'t tell anyone. Want to see?',
        'You\'re one of the few executives who doesn\'t treat data as the enemy of art.',
      ],
      upset: [
        'I gave you the data. The data said pass. What happened?',
        'You can\'t just ignore the completion rates. They\'re predictive.',
      ],
    },
    portraitColors: { hair: '#4a3728', skin: '#e8c4a0', shirt: '#2ecc71' },
  },
  {
    id: 'pieter',
    type: 'office_manager',
    notePreference: 'gentle',
    name: 'Pieter de Jong',
    role: 'colleague',
    personality: 'Knows everyone\'s secrets. Runs the place from behind the scenes. Warm, observant, discreet until he decides not to be.',
    preferredTone: 'gentle',
    dialoguePool: {
      greeting: [
        'Steve, love! Have you eaten? You look peaky. I have sandwiches in the kitchen.',
        'There\'s my favorite junior exec! How are you holding up, sweetheart?',
        'Steve! I was just telling Bernie what a help you\'ve been. Don\'t blush.',
        'Hello, dear. The coffee machine\'s broken again, but I\'ve made tea.',
        'Steve. Sit. Tell Pieter everything. I\'ve got time.',
      ],
      casual: [
        'Between us? Katrien and Jake had a shouting match in the lobby last week. Awkward.',
        'Helena\'s wife makes the most amazing stroopwafels. I\'ll see if I can get you some.',
        'The new intern has a crush on Marco. It\'s obvious. Adorable, but obvious.',
        'Bernie\'s under pressure from London. Don\'t spread that around. He needs support.',
      ],
      heartTwo: [
        'You remembered my birthday? You\'re a good one, Steve. A good one.',
        'The filmmakers ask about you. They like you. That matters more than you know.',
        'People talk. I listen. Your name comes up. Usually in a good way.',
      ],
      heartFive: [
        'You\'ve been so kind to Marco. He needs people like you. We all do.',
        'Keep doing what you\'re doing. The office is better for having you.',
      ],
      pleased: [
        'You\'ve been so kind to Marco. He needs people like you. We all do.',
        'Keep doing what you\'re doing. The office is better for having you.',
      ],
      special: [
        'I\'ve arranged a little something for the team. Your presence would mean a lot.',
        'There\'s someone I think you should meet. A filmmaker. Very talented. Very hungry.',
      ],
      upset: [
        'Steve. We need to talk about the rumors. I\'ve been hearing things.',
        'People are talking. I don\'t like what they\'re saying. Let\'s fix this.',
      ],
    },
    portraitColors: { hair: '#c4a574', skin: '#e8d4c4', shirt: '#7d4e37' },
  },
];

export function getCharacter(id) {
  if (typeof id === 'number' && id >= 0 && id < CHARACTERS.length) {
    return CHARACTERS[id];
  }
  return CHARACTERS.find((c) => c.id === id) ?? null;
}
