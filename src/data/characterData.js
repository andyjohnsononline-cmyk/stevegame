/**
 * NPC definitions for Greenlight.
 * 5 filmmakers, 3 office colleagues, 2 industry contacts.
 */

export const CHARACTERS = [
  // 1. Katrien van der Berg - The Auteur
  {
    id: 'katrien',
    type: 'auteur', // for NPC sprite lookup
    notePreference: 'gentle', // alias for preferredTone
    name: 'Katrien van der Berg',
    role: 'filmmaker',
    archetype: 'auteur',
    nationality: 'Dutch',
    personality: 'Refuses notes, brilliant if trusted. Believes cinema should challenge, not comfort. Intense and uncompromising.',
    creativePhilosophy: 'The audience doesn\'t know what it needs until you show them. Compromise is the death of vision.',
    preferredGiftType: 'rare_cinema_books',
    preferredTone: 'gentle',
    defaultLocation: 'canal_walk',
    schedule: {
      morning: 'canal_walk',
      afternoon: 'cafe',
      evening: 'cafe',
    },
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
      heartEight: [
        'I\'m considering a project. You might be the only executive I\'d trust with it.',
        'The festival invited us. I suppose your support had something to do with it.',
        'Finally, someone who speaks of craft rather than "content."',
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
      about: [
        'I make films for people who are willing to be uncomfortable. There aren\'t many of us left.',
        'The Dutch funding system rewards mediocrity. I say this with love. And rage.',
        'Every frame should earn its place. Most films don\'t understand that.',
      ],
    },
    portraitColors: {
      hair: '#2c1810',
      skin: '#e8c4a0',
      shirt: '#4a3728',
    },
  },
  // 2. Marco Rossi - The Newcomer
  {
    id: 'marco',
    type: 'newcomer',
    notePreference: 'balanced',
    name: 'Marco Rossi',
    role: 'filmmaker',
    archetype: 'newcomer',
    nationality: 'Italian',
    personality: 'Eager, raw talent, needs guidance. Hungry to learn and grateful for any feedback. Sometimes too eager.',
    creativePhilosophy: 'I want to make something that matters. I just don\'t know how yet. That\'s why I need people like you.',
    preferredGiftType: 'coffee',
    preferredTone: 'balanced',
    defaultLocation: 'office_ground',
    schedule: {
      morning: 'office_ground',
      afternoon: 'office_upper',
      evening: 'cafe',
    },
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
      heartEight: [
        'I\'ve been working on something new. Can I send it to you when it\'s ready?',
        'I got into a development program! Your notes were part of my application.',
        'Everyone said executives only care about numbers. You\'re different.',
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
      about: [
        'Rome has the history. Amsterdam has the future. I want to be where things are happening.',
        'My nonna thinks I\'m crazy. She\'s probably right. But she also thinks I\'m talented.',
        'I write at night. The city is quieter. The ideas are louder.',
      ],
    },
    portraitColors: {
      hair: '#3d2314',
      skin: '#d4a574',
      shirt: '#8b4513',
    },
  },
  // 3. Helena Johansson - The Veteran
  {
    id: 'helena',
    type: 'veteran',
    notePreference: 'direct',
    name: 'Helena Johansson',
    role: 'filmmaker',
    archetype: 'veteran',
    nationality: 'Swedish',
    personality: 'Lost spark, needs the right project. Thirty years in the industry. Respects honesty above flattery.',
    creativePhilosophy: 'I\'ve made twelve films. Four made money. Guess which ones I\'m proud of. The trick is finding the project that lets you be proud and paid.',
    preferredGiftType: 'vintage_wine',
    preferredTone: 'direct',
    defaultLocation: 'cafe',
    schedule: {
      morning: 'cafe',
      afternoon: 'office_upper',
      evening: 'canal_walk',
    },
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
      heartEight: [
        'I\'ve got a project I\'ve been sitting on. Might be my last. Want to hear about it?',
        'The old guard is throwing a dinner. I\'ll put in a word for you.',
        'We could have used someone like you twenty years ago.',
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
      about: [
        'Stockholm is home. Amsterdam is where the money is. I\'ve learned to live in both.',
        'The spark isn\'t gone. It\'s just waiting for the right script to ignite it.',
        'I\'ve survived worse executives. I\'ve survived worse films. I\'ll survive this.',
      ],
    },
    portraitColors: {
      hair: '#c4a574',
      skin: '#f5e6d3',
      shirt: '#5c4033',
    },
  },
  // 4. Jake Morrison - The Hitmaker
  {
    id: 'jake',
    type: 'hitmaker',
    notePreference: 'balanced',
    name: 'Jake Morrison',
    role: 'filmmaker',
    archetype: 'hitmaker',
    nationality: 'American',
    personality: 'Commercial success, secretly wants art. LA-trained, numbers-driven, but carries a Criterion subscription he never mentions.',
    creativePhilosophy: 'I make hits. That\'s the job. But every now and then I want to make something that doesn\'t need to hit. Something that just... is.',
    preferredGiftType: 'art_prints',
    preferredTone: 'balanced',
    defaultLocation: 'office_upper',
    schedule: {
      morning: 'office_upper',
      afternoon: 'market',
      evening: 'cafe',
    },
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
      heartEight: [
        'I\'ve got something big coming. You want in, you need to move fast.',
        'My agent is talking to Netflix. Your support could change the conversation.',
        'There\'s a script. Small. No commercial upside. I want to make it anyway. Your thoughts?',
      ],
      pleased: [
        'Your commercial notes were spot-on. I\'ve already incorporated them.',
        'We\'re going to make a lot of money together, Steve. I can feel it.',
        'You get it. Most Europeans don\'t. They\'re too busy being "artistic."',
      ],
      special: [
        'I\'ve got something big coming. You want in, you need to move fast.',
        'My agent is talking to Netflix. Your support could change the conversation.',
      ],
      upset: [
        'Character depth? I\'m making content, not therapy.',
        'You\'re going to pass because it\'s "too commercial"? That\'s a first.',
      ],
      about: [
        'Hollywood taught me how to play the game. Amsterdam taught me there are other games.',
        'I have a shelf of films I\'ll never make. Maybe one day. When I\'ve earned it.',
        'The best executives know when to push for art and when to push for audience.',
      ],
    },
    portraitColors: {
      hair: '#1a1a1a',
      skin: '#c9a86c',
      shirt: '#1e3a5f',
    },
  },
  // 5. Yuki Tanaka - The Festival Darling
  {
    id: 'yuki',
    type: 'festival_darling',
    notePreference: 'gentle',
    name: 'Yuki Tanaka',
    role: 'filmmaker',
    archetype: 'festival_darling',
    nationality: 'Japanese',
    personality: 'Can\'t reach mainstream. Award-winning, critically adored, commercially invisible. Believes mainstream success corrupts.',
    creativePhilosophy: 'Every frame should earn its place. Most films don\'t. I\'d rather make something for twelve people who feel it than twelve million who forget it.',
    preferredGiftType: 'flowers',
    preferredTone: 'gentle',
    defaultLocation: 'canal_walk',
    schedule: {
      morning: 'canal_walk',
      afternoon: 'canal_walk',
      evening: 'cafe',
    },
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
      heartEight: [
        'I\'m developing something radical. You might be the only one who\'d consider it.',
        'The festival circuit will understand. So will you. That\'s enough.',
        'I didn\'t make this for an algorithm. I made it for people who feel. You feel.',
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
      about: [
        'Tokyo gave me form. Amsterdam gave me space. I\'m still learning what to put in it.',
        'The mainstream and I have an understanding: we leave each other alone.',
        'Critics understand my work. Audiences might, one day. Executives rarely do. You\'re an exception.',
      ],
    },
    portraitColors: {
      hair: '#1a1a1a',
      skin: '#e8d4c4',
      shirt: '#6b4423',
    },
  },
  // 6. Bernard 'Bernie' Okafor - VP Boss
  {
    id: 'bernie',
    type: 'boss',
    notePreference: 'balanced',
    name: "Bernard 'Bernie' Okafor",
    role: 'colleague',
    archetype: 'vp_boss',
    nationality: 'Nigerian-Dutch',
    personality: 'VP of Content. Values bold bets. Seen it all, still believes in the work. Demanding but fair.',
    creativePhilosophy: null,
    preferredGiftType: 'premium_spirits',
    preferredTone: 'balanced',
    defaultLocation: 'office_upper',
    schedule: {
      morning: 'office_upper',
      afternoon: 'office_upper',
      evening: 'office_upper',
    },
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
      heartEight: [
        'I\'m considering you for the senior role. Don\'t make me regret it.',
        'The quarterly review is coming. I want you prepared.',
        'I\'m putting you on the Morrison pitch. You\'ve earned it.',
      ],
      pleased: [
        'That last greenlight was the right call. The numbers are proving it.',
        'You\'ve grown. I notice these things. Keep it up.',
        'Your notes on the Rossi project—exactly the right balance. Well done.',
      ],
      special: [
        'I\'m considering you for the senior role. Don\'t make me regret it.',
        'The quarterly review is coming. I want you prepared.',
      ],
      upset: [
        'We need to talk about the van der Berg situation. My office. Now.',
        'Your coverage on that last script was thin. I expect better.',
      ],
      about: [
        'Lagos, Rotterdam, Amsterdam. Three cities, one career. The work connects them.',
        'I value executives who can say no. And executives who know when to say yes.',
        'The best content comes from people who aren\'t afraid to fail. Are you?',
      ],
    },
    portraitColors: {
      hair: '#1a1a1a',
      skin: '#8d5524',
      shirt: '#2c3e50',
    },
  },
  // 7. Lena Vogel - Data Analyst
  {
    id: 'lena',
    type: 'data_analyst',
    notePreference: 'direct',
    name: 'Lena Vogel',
    role: 'colleague',
    archetype: 'data_analyst',
    nationality: 'German',
    personality: 'Quantifies everything. Distrusts gut instinct but respects those who balance it with data. Nerdy, precise, surprisingly warm.',
    creativePhilosophy: null,
    preferredGiftType: 'tech_gadgets',
    preferredTone: 'direct',
    defaultLocation: 'office_upper',
    schedule: {
      morning: 'office_upper',
      afternoon: 'office_upper',
      evening: 'office_upper',
    },
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
        'Bernie said your coverage was thorough. I might have helped with the numbers.',
        'We make a good team. You read scripts, I read spreadsheets. Together we\'re unstoppable.',
      ],
      heartEight: [
        'I\'ve got access to some competitor data. Don\'t tell anyone. Want to see?',
        'The new dashboard is live. It might actually help with your coverage.',
        'You\'re one of the few executives who doesn\'t treat data as the enemy of art.',
      ],
      pleased: [
        'You actually used my data in the pitch? That\'s... that\'s great!',
        'Bernie said your coverage was thorough. I might have helped with the numbers.',
        'We make a good team. You read scripts, I read spreadsheets. Together we\'re unstoppable.',
      ],
      special: [
        'I\'ve got access to some competitor data. Don\'t tell anyone. Want to see?',
        'The new dashboard is live. It might actually help with your coverage.',
      ],
      upset: [
        'I gave you the data. The data said pass. What happened?',
        'You can\'t just ignore the completion rates. They\'re predictive.',
      ],
      about: [
        'Berlin taught me to question everything. Amsterdam taught me to build something from the answers.',
        'Data doesn\'t replace taste. It informs it. The best executives understand both.',
        'I quantify the unquantifiable. Completion rates, engagement curves. The rest is up to you.',
      ],
    },
    portraitColors: {
      hair: '#4a3728',
      skin: '#e8c4a0',
      shirt: '#2ecc71',
    },
  },
  // 8. Pieter de Jong - Office Manager
  {
    id: 'pieter',
    type: 'office_manager',
    notePreference: 'gentle',
    name: 'Pieter de Jong',
    role: 'colleague',
    archetype: 'office_manager',
    nationality: 'Dutch',
    personality: 'Knows everyone\'s secrets. Runs the place from behind the scenes. Warm, observant, discreet until he decides not to be.',
    creativePhilosophy: null,
    preferredGiftType: 'homemade_treats',
    preferredTone: 'gentle',
    defaultLocation: 'office_ground',
    schedule: {
      morning: 'office_ground',
      afternoon: 'office_ground',
      evening: 'market',
    },
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
        'Sophie was in yesterday. She mentioned you. Good things. I thought you should know.',
      ],
      heartTwo: [
        'You remembered my birthday? You\'re a good one, Steve. A good one.',
        'The filmmakers ask about you. They like you. That matters more than you know.',
        'People talk. I listen. Your name comes up. Usually in a good way.',
      ],
      heartFive: [
        'Bernie said you handled the Morrison meeting well. I knew you had it in you.',
        'You\'ve been so kind to Marco. He needs people like you. We all do.',
        'Keep doing what you\'re doing. The office is better for having you.',
      ],
      heartEight: [
        'I\'ve arranged a little something for the team. Your presence would mean a lot.',
        'There\'s someone I think you should meet. A filmmaker. Very talented. Very hungry.',
        'I know things. Useful things. You\'ve earned the right to ask.',
      ],
      pleased: [
        'Bernie said you handled the Morrison meeting well. I knew you had it in you.',
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
      about: [
        'I\'ve worked here longer than the building has had a name. I remember when it was a warehouse.',
        'Everyone has a story. My job is to remember them. And the coffee order.',
        'The best executives understand that the office runs on relationships, not org charts.',
      ],
    },
    portraitColors: {
      hair: '#c4a574',
      skin: '#e8d4c4',
      shirt: '#7d4e37',
    },
  },
  // 9. Sophie Laurent - Agent
  {
    id: 'sophie',
    type: 'talent_agent',
    notePreference: 'balanced',
    name: 'Sophie Laurent',
    role: 'contact',
    archetype: 'agent',
    nationality: 'French',
    personality: 'Pushes clients\' scripts. Smooth, well-connected, plays the long game. Values relationships over single deals.',
    creativePhilosophy: null,
    preferredGiftType: 'restaurant_gift_cards',
    preferredTone: 'balanced',
    defaultLocation: 'brown_cafe',
    schedule: {
      morning: 'canal_walk',
      afternoon: 'office_ground',
      evening: 'cafe',
    },
    dialoguePool: {
      greeting: [
        'Steve. Good to see you. I\'ve got something that might interest you.',
        'There he is. The man with the greenlight. How\'s the inbox looking?',
        'Steve. Perfect. I wanted to run something by you before it goes wide.',
        'My friend. I hope you\'ve been well. We should talk about opportunities.',
        'Steve. I\'ve been holding something for you. Exclusive. For now.',
      ],
      casual: [
        'Three of my clients have projects in development. Two of them could use an advocate.',
        'The market\'s shifting. Limited series are where the smart money\'s going.',
        'I\'ve known Katrien for fifteen years. She\'s difficult. She\'s also brilliant.',
        'Netflix passed on something last week. Might be perfect for you. Want details?',
        'Jake\'s agent is shopping his next project. I could get you first look.',
      ],
      heartTwo: [
        'You gave my client a real shot. That doesn\'t go unnoticed. Thank you.',
        'Your notes on the Tanaka project—she mentioned them. Favorably. I owe you one.',
        'We could do great things together, Steve. I mean that.',
      ],
      heartFive: [
        'I\'ve been telling people about you. The right people. You\'re welcome.',
        'That pass you did? Classy. My client appreciated the feedback. So did I.',
        'Paris, London, Amsterdam. The best deals happen in the spaces between.',
      ],
      heartEight: [
        'I\'ve got a debut director. Raw talent. Script needs work. Your kind of project.',
        'There\'s a package coming together. A-list director, hot writer. You want in?',
        'You\'ve built something here. Reputation. Relationships. I notice. So do others.',
      ],
      pleased: [
        'You gave my client a real shot. That doesn\'t go unnoticed. Thank you.',
        'Your notes on the Tanaka project—she mentioned them. Favorably. I owe you one.',
        'We could do great things together, Steve. I mean that.',
      ],
      special: [
        'I\'ve got a debut director. Raw talent. Script needs work. Your kind of project.',
        'There\'s a package coming together. A-list director, hot writer. You want in?',
      ],
      upset: [
        'My client felt dismissed. I\'m sure that wasn\'t your intention. Let\'s fix the perception.',
        'I sent you something special. The response was... underwhelming.',
      ],
      about: [
        'Agents are matchmakers. We find the right script for the right executive. You\'re becoming one of the right ones.',
        'My clients trust me because I don\'t oversell. I underpromise and overdeliver. You should try it.',
        'The industry runs on favors. You\'ve earned a few. Spend them wisely.',
      ],
    },
    portraitColors: {
      hair: '#2c1810',
      skin: '#e8c4a0',
      shirt: '#8b0000',
    },
  },
  // 10. Oliver Blackwood - Critic
  {
    id: 'oliver',
    type: 'film_critic',
    notePreference: 'direct',
    name: 'Oliver Blackwood',
    role: 'contact',
    archetype: 'critic',
    nationality: 'British',
    personality: 'Early reviews matter. Film critic for a major paper. Intellectual, rigorous, occasionally cutting. Can make or break a release.',
    creativePhilosophy: null,
    preferredGiftType: 'rare_cinema_books',
    preferredTone: 'direct',
    defaultLocation: 'brown_cafe',
    schedule: {
      morning: 'cafe',
      afternoon: 'canal_walk',
      evening: 'cafe',
    },
    dialoguePool: {
      greeting: [
        'Steve. I\'ve been reading about your slate. Interesting choices.',
        'Ah, the executive. I hope you\'ve come to discuss cinema, not commerce.',
        'Steve. I saw the van der Berg film. We should talk about it.',
        'There you are. I\'ve been curious about your taste. Let\'s find out.',
        'Steve. Good. I\'ve wanted to pick your brain about the industry.',
      ],
      casual: [
        'The Dutch film industry suffers from provincial thinking. Present company excepted, perhaps.',
        'I\'ve written about twelve films this year. Two were worth the ink.',
        'Critics and executives have more in common than either would admit. We both curate.',
        'The festival circuit has become predictable. I long for genuine surprise.',
        'My editor wants more "accessible" reviews. I want to write about art. We compromise.',
      ],
      heartTwo: [
        'You championed something difficult. That takes courage. I noticed.',
        'Your taste is better than I expected. I mean that as a compliment.',
        'The industry needs executives who actually watch films. You might be one.',
      ],
      heartFive: [
        'I\'ve heard good things from filmmakers. Rare. Consider it high praise.',
        'Perhaps we\'re not on opposite sides after all. Perhaps.',
        'A good executive knows that criticism serves the work. You seem to understand that.',
      ],
      heartEight: [
        'I\'m writing a piece on the state of Dutch cinema. Your perspective could be valuable.',
        'A film you developed is screening. I\'ll be there. I hope it\'s good.',
        'I\'ll be watching your choices. Closely. So far, I\'m impressed.',
      ],
      pleased: [
        'You championed something difficult. That takes courage. I noticed.',
        'Your taste is better than I expected. I mean that as a compliment.',
        'I\'ve heard good things from filmmakers. Rare. Consider it high praise.',
      ],
      special: [
        'I\'m writing a piece on the state of Dutch cinema. Your perspective could be valuable.',
        'A film you developed is screening. I\'ll be there. I hope it\'s good.',
      ],
      upset: [
        'You greenlit that? I suppose someone has to make the safe choices.',
        'Your slate suggests commercial instincts override artistic ones. Disappointing.',
      ],
      about: [
        'London taught me to be sharp. Amsterdam taught me to be fair. I\'m still working on both.',
        'Early reviews matter. I know that. I try not to let it go to my head. I fail.',
        'The best executives and the best critics want the same thing: work that deserves attention.',
      ],
    },
    portraitColors: {
      hair: '#4a3728',
      skin: '#d4a574',
      shirt: '#2c3e50',
    },
  },
  // 11. Anouk Visser - Junior Executive (mentee)
  {
    id: 'anouk',
    type: 'junior_exec',
    notePreference: 'balanced',
    name: 'Anouk Visser',
    role: 'mentee',
    archetype: 'junior_exec',
    nationality: 'Dutch',
    personality: 'Eager, analytical, occasionally overthinks. Wants to prove herself but respects hierarchy. First job in content.',
    creativePhilosophy: null,
    preferredGiftType: 'coffee',
    preferredTone: 'balanced',
    defaultLocation: 'office_upper',
    schedule: {
      morning: 'office_upper',
      afternoon: 'office_upper',
      evening: 'office_ground',
    },
    dialoguePool: {
      greeting: [
        'Steve! Do you have a minute? I could use your perspective on something.',
        'Hey Steve. I\'m working through a coverage report and I\'m stuck. Can I ask you something?',
        'Oh good, you\'re here. I was hoping to pick your brain.',
        'Steve! Sorry to bother you. I have a question about a script on my desk.',
      ],
      casual: [
        'I stayed up until 2am reading scripts. Is that normal? Please say yes.',
        'Bernie said I should watch more European cinema. Any recommendations?',
        'I\'m trying to figure out how you decide which scripts to champion. It seems like instinct.',
        'The filmmakers are... intense. Is that a them thing or an industry thing?',
      ],
      heartTwo: [
        'Your advice on that coverage was really helpful. The filmmaker actually thanked me.',
        'I\'m starting to understand the notes triangle. I think. Maybe.',
        'People are starting to take me seriously in meetings. I think that\'s partly your influence.',
      ],
      heartFive: [
        'I greenlit my first project! It\'s terrifying and exhilarating.',
        'Bernie mentioned you\'ve been saying good things about my work. Thank you.',
        'I finally gave difficult notes without the filmmaker walking out. Progress!',
      ],
      heartEight: [
        'I got offered a job at a competitor. I turned it down. This team is where I want to be.',
        'I want to be the kind of executive you are. I hope that\'s not weird to say.',
      ],
      pleased: [
        'I greenlit my first project! It\'s terrifying and exhilarating.',
        'Bernie mentioned you\'ve been saying good things about my work. Thank you.',
      ],
      special: [
        'I got offered a job at a competitor. I turned it down. This team is where I want to be.',
      ],
      upset: [
        'I thought you\'d have more time for me. I know you\'re busy, but still.',
        'The notes you suggested I give... they didn\'t land well. I need better guidance.',
      ],
      about: [
        'Amsterdam born and raised. First person in my family to work in entertainment.',
        'I studied film theory at UvA. Turns out the job is 80% email and 20% cinema.',
      ],
    },
    portraitColors: {
      hair: '#8B4513',
      skin: '#e8d4c4',
      shirt: '#4682B4',
    },
  },
  // 12. Tomás Ferreira - Junior Executive (mentee)
  {
    id: 'tomas',
    type: 'junior_exec',
    notePreference: 'direct',
    name: 'Tomás Ferreira',
    role: 'mentee',
    archetype: 'junior_exec',
    nationality: 'Portuguese',
    personality: 'Confident, sometimes brash, strong instincts but needs refinement. Came from a film festival background.',
    creativePhilosophy: null,
    preferredGiftType: 'art_prints',
    preferredTone: 'direct',
    defaultLocation: 'office_upper',
    schedule: {
      morning: 'office_ground',
      afternoon: 'office_upper',
      evening: 'cafe',
    },
    dialoguePool: {
      greeting: [
        'Steve. Got a second? I need a reality check on something.',
        'Hey, perfect timing. I\'m about to make a call and I want your take first.',
        'Steve. Quick one. I\'ve got a script situation and I trust your judgement.',
        'Oh good. I was going to email you but this is faster.',
      ],
      casual: [
        'I ran a festival in Lisbon before this. Different world. Fewer spreadsheets.',
        'The data team keeps sending me completion rate reports. I miss when films just... existed.',
        'I think I\'m developing an instinct for scripts. Or maybe that\'s just confidence.',
        'Jake Morrison gave me some advice yesterday. Mostly about money. Very on-brand.',
      ],
      heartTwo: [
        'Your mentoring style is good. Direct without being harsh. I\'m learning.',
        'I passed on a script you would have passed on too. Felt right.',
        'I\'m getting better at reading the room in meetings. Thanks for the coaching.',
      ],
      heartFive: [
        'My first release got decent numbers. Nothing huge, but I\'ll take it.',
        'I stood up to a filmmaker who was pushing back on notes. It worked. Your advice helped.',
        'Bernie\'s starting to include me in strategy conversations. That\'s new.',
      ],
      heartEight: [
        'I want to run my own division someday. I think working with you will get me there.',
        'A filmmaker dedicated their film to "everyone who believed early." I\'d like to think that includes us.',
      ],
      pleased: [
        'My first release got decent numbers. Nothing huge, but I\'ll take it.',
        'I stood up to a filmmaker who was pushing back on notes. It worked.',
      ],
      special: [
        'I want to run my own division someday. I think working with you will get me there.',
      ],
      upset: [
        'I took your advice and it backfired. Maybe I should have trusted my gut.',
        'I need more support. I\'m drowning a bit here.',
      ],
      about: [
        'Lisbon, then Rotterdam, now Amsterdam. I follow the industry where it goes.',
        'I think the best executives combine gut and data. I\'m still figuring out the ratio.',
      ],
    },
    portraitColors: {
      hair: '#2c1810',
      skin: '#d4a574',
      shirt: '#8B0000',
    },
  },
];

export function getCharacter(id) {
  if (typeof id === 'number' && id >= 0 && id < CHARACTERS.length) {
    return CHARACTERS[id];
  }
  return CHARACTERS.find((c) => c.id === id) ?? null;
}
