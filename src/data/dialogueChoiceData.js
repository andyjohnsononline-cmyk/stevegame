/**
 * Dialogue choice encounters for all 8 NPCs, organized by relationship tier.
 *
 * Each encounter: { npcLine, optionA, optionB }
 *   option: { text, effects: [{ npcId, hearts }], special?: { type, ... } }
 *
 * Tiers: low (0-2), mid (3-5), high (6-8), max (9-10)
 */

export const DIALOGUE_CHOICES = {
  // ─── KATRIEN VAN DER BERG (auteur, prefers gentle) ────────────────────
  katrien: {
    low: [
      {
        npcLine: 'You greenlit Jake\'s thriller over my script. Tell me why I should trust your taste.',
        optionA: { text: 'The market demanded it. I\'m sorry.', effects: [{ npcId: 'katrien', hearts: -0.5 }, { npcId: 'jake', hearts: 0.3 }] },
        optionB: { text: 'Your script needed more time. I was protecting it.', effects: [{ npcId: 'katrien', hearts: 0.8 }] },
      },
      {
        npcLine: 'Do you even watch films, Steve? Or just the trailers?',
        optionA: { text: 'I rewatched Stalker last weekend, actually.', effects: [{ npcId: 'katrien', hearts: 0.5 }] },
        optionB: { text: 'I watch what the audience watches.', effects: [{ npcId: 'katrien', hearts: -0.5 }] },
      },
      {
        npcLine: 'Marco asked me for advice on his script. I told him to start over. Was I wrong?',
        optionA: { text: 'That\'s harsh. He\'s still learning.', effects: [{ npcId: 'katrien', hearts: -0.3 }, { npcId: 'marco', hearts: 0.5 }] },
        optionB: { text: 'Honesty is a gift. He\'ll thank you later.', effects: [{ npcId: 'katrien', hearts: 0.6 }] },
      },
    ],
    mid: [
      {
        npcLine: 'I\'ve been thinking about a limited series. Six episodes, no concessions. Interested?',
        optionA: { text: 'Absolutely. Let\'s find the right shape for it.', effects: [{ npcId: 'katrien', hearts: 0.8 }] },
        optionB: { text: 'Could you make it four episodes? Shorter is trending.', effects: [{ npcId: 'katrien', hearts: -0.5 }] },
      },
      {
        npcLine: 'Helena says my work is self-indulgent. She\'s wrong, but I respect her saying it.',
        optionA: { text: 'She has a point about pacing, though.', effects: [{ npcId: 'katrien', hearts: -0.3 }, { npcId: 'helena', hearts: 0.5 }] },
        optionB: { text: 'Self-indulgent is what they called Bergman too.', effects: [{ npcId: 'katrien', hearts: 0.6 }] },
      },
      {
        npcLine: 'The festival circuit is the only honest measure of quality left.',
        optionA: { text: 'Festivals have their own politics.', effects: [{ npcId: 'katrien', hearts: -0.3 }] },
        optionB: { text: 'At least they still value the craft.', effects: [{ npcId: 'katrien', hearts: 0.5 }, { npcId: 'yuki', hearts: 0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'I\'m writing something personal. About my mother. Would you read an early draft?',
        optionA: { text: 'I\'d be honored. Send it whenever you\'re ready.', effects: [{ npcId: 'katrien', hearts: 1.0 }] },
        optionB: { text: 'Is it commercially viable?', effects: [{ npcId: 'katrien', hearts: -1.0 }] },
      },
      {
        npcLine: 'Jake offered to co-produce my next film. The money would help, but the creative control...',
        optionA: { text: 'Protect your vision. We\'ll find another way.', effects: [{ npcId: 'katrien', hearts: 0.8 }, { npcId: 'jake', hearts: -0.3 }] },
        optionB: { text: 'Jake knows audiences. It could work.', effects: [{ npcId: 'katrien', hearts: -0.5 }, { npcId: 'jake', hearts: 0.5 }] },
      },
      {
        npcLine: 'You\'ve never once asked me to compromise. That means something.',
        optionA: { text: 'Your work doesn\'t need compromising.', effects: [{ npcId: 'katrien', hearts: 0.8 }] },
        optionB: { text: 'Well... there is one scene I\'d reconsider.', effects: [{ npcId: 'katrien', hearts: -0.3 }] },
      },
    ],
    max: [
      {
        npcLine: 'I\'m considering dedicating the film to you. Is that too much?',
        optionA: { text: 'I don\'t know what to say. That\'s beautiful.', effects: [{ npcId: 'katrien', hearts: 0.5 }] },
        optionB: { text: 'The work speaks for itself. You don\'t need to.', effects: [{ npcId: 'katrien', hearts: 0.3 }] },
      },
      {
        npcLine: 'Cannes wants us. Main competition. I need you there.',
        optionA: { text: 'I\'ll clear my schedule. This is your moment.', effects: [{ npcId: 'katrien', hearts: 0.5 }] },
        optionB: { text: 'Let\'s talk strategy for the press tour.', effects: [{ npcId: 'katrien', hearts: 0.2 }] },
      },
    ],
  },

  // ─── MARCO ROSSI (newcomer, prefers gentle) ──────────────────────────
  marco: {
    low: [
      {
        npcLine: 'I know my script wasn\'t perfect. But did anyone actually read it?',
        optionA: { text: 'I read every page. The second act needs work, but the voice is there.', effects: [{ npcId: 'marco', hearts: 0.8 }] },
        optionB: { text: 'We get a lot of submissions. Don\'t take it personally.', effects: [{ npcId: 'marco', hearts: -0.5 }] },
      },
      {
        npcLine: 'Helena told me I should give up and go back to school. Do you agree?',
        optionA: { text: 'Helena\'s tough, but she doesn\'t mean it like that.', effects: [{ npcId: 'marco', hearts: 0.3 }, { npcId: 'helena', hearts: 0.3 }] },
        optionB: { text: 'Absolutely not. Keep writing. You\'ll get there.', effects: [{ npcId: 'marco', hearts: 0.8 }, { npcId: 'helena', hearts: -0.3 }] },
      },
      {
        npcLine: 'I can\'t afford to keep writing for free. Maybe this isn\'t for me.',
        optionA: { text: 'Talent needs time. Don\'t give up yet.', effects: [{ npcId: 'marco', hearts: 0.6 }] },
        optionB: { text: 'The industry is tough. Only you can decide.', effects: [{ npcId: 'marco', hearts: -0.3 }] },
      },
    ],
    mid: [
      {
        npcLine: 'I\'ve been rewriting like crazy. Three drafts this week! Is that too much?',
        optionA: { text: 'Channel that energy. Each draft gets you closer.', effects: [{ npcId: 'marco', hearts: 0.6 }] },
        optionB: { text: 'Slow down. Revision fatigue is real.', effects: [{ npcId: 'marco', hearts: 0.3 }] },
      },
      {
        npcLine: 'Jake said my dialogue is too "film school." What does that even mean?',
        optionA: { text: 'It means find your own voice instead of copying others.', effects: [{ npcId: 'marco', hearts: 0.5 }, { npcId: 'jake', hearts: 0.3 }] },
        optionB: { text: 'Ignore Jake. Your dialogue has authenticity.', effects: [{ npcId: 'marco', hearts: 0.6 }, { npcId: 'jake', hearts: -0.3 }] },
      },
      {
        npcLine: 'Katrien offered to mentor me. Should I take it? She\'s intimidating.',
        optionA: { text: 'Take it. She\'ll push you harder than anyone.', effects: [{ npcId: 'marco', hearts: 0.3 }, { npcId: 'katrien', hearts: 0.5 }] },
        optionB: { text: 'Find your own path. You don\'t need a guru.', effects: [{ npcId: 'marco', hearts: 0.5 }, { npcId: 'katrien', hearts: -0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'My parents saw the trailer. My dad cried. He\'s never cried at anything I\'ve done.',
        optionA: { text: 'That\'s what it\'s all about. Hold onto that feeling.', effects: [{ npcId: 'marco', hearts: 0.8 }] },
        optionB: { text: 'Now imagine a million people feeling the same thing.', effects: [{ npcId: 'marco', hearts: 0.5 }] },
      },
      {
        npcLine: 'I think I\'m ready for something bigger. A feature. Would you back me?',
        optionA: { text: 'Let\'s talk about it. I think you\'re ready too.', effects: [{ npcId: 'marco', hearts: 1.0 }] },
        optionB: { text: 'One more strong short first. Build the foundation.', effects: [{ npcId: 'marco', hearts: 0.3 }] },
      },
      {
        npcLine: 'You\'re the first person in this industry who didn\'t make me feel small.',
        optionA: { text: 'You were never small. You just needed someone to see it.', effects: [{ npcId: 'marco', hearts: 0.8 }] },
        optionB: { text: 'That\'s the job. Don\'t get sentimental on me.', effects: [{ npcId: 'marco', hearts: -0.3 }] },
      },
    ],
    max: [
      {
        npcLine: 'I got into the Berlinale Talents program! They want me to present my next project.',
        optionA: { text: 'You earned this. Every draft, every note — it led here.', effects: [{ npcId: 'marco', hearts: 0.5 }] },
        optionB: { text: 'Good. Use it to network. This industry runs on connections.', effects: [{ npcId: 'marco', hearts: 0.2 }] },
      },
      {
        npcLine: 'Whatever happens next, I want you to know — you changed my life, Steve.',
        optionA: { text: 'You changed your own life. I just opened a door.', effects: [{ npcId: 'marco', hearts: 0.5 }] },
        optionB: { text: 'Don\'t look back. The best is ahead of you.', effects: [{ npcId: 'marco', hearts: 0.3 }] },
      },
    ],
  },

  // ─── HELENA JOHANSSON (veteran, prefers direct) ──────────────────────
  helena: {
    low: [
      {
        npcLine: 'Thirty years and I\'m pitching to someone half my age. Don\'t waste my time.',
        optionA: { text: 'Your track record speaks for itself. Let\'s get to work.', effects: [{ npcId: 'helena', hearts: 0.8 }] },
        optionB: { text: 'I\'m here to help. We\'re on the same team.', effects: [{ npcId: 'helena', hearts: -0.3 }] },
      },
      {
        npcLine: 'Yuki\'s latest is three hours of someone staring at a wall. They call it art.',
        optionA: { text: 'Duration isn\'t the problem. Substance is.', effects: [{ npcId: 'helena', hearts: 0.5 }, { npcId: 'yuki', hearts: -0.3 }] },
        optionB: { text: 'You should see it before judging. It\'s actually powerful.', effects: [{ npcId: 'helena', hearts: -0.5 }, { npcId: 'yuki', hearts: 0.5 }] },
      },
      {
        npcLine: 'My last three scripts were passed on. Am I finished?',
        optionA: { text: 'Not finished. But you need to evolve.', effects: [{ npcId: 'helena', hearts: 0.6 }] },
        optionB: { text: 'Of course not! You\'re a legend.', effects: [{ npcId: 'helena', hearts: -0.3 }] },
      },
    ],
    mid: [
      {
        npcLine: 'The new generation doesn\'t understand craft. They think editing is a filter.',
        optionA: { text: 'Some of them are brilliant. Marco, for instance.', effects: [{ npcId: 'helena', hearts: -0.3 }, { npcId: 'marco', hearts: 0.5 }] },
        optionB: { text: 'Craft is earned. You can\'t shortcut decades of experience.', effects: [{ npcId: 'helena', hearts: 0.6 }] },
      },
      {
        npcLine: 'I\'m thinking of setting the new script in the 1970s. Expensive, but honest.',
        optionA: { text: 'If the story demands it, we\'ll find the budget.', effects: [{ npcId: 'helena', hearts: 0.8 }] },
        optionB: { text: 'Could you modernize it? Period pieces are a hard sell.', effects: [{ npcId: 'helena', hearts: -0.5 }] },
      },
      {
        npcLine: 'Bernie keeps pushing me toward limited series. I\'m a filmmaker, not a content mill.',
        optionA: { text: 'Series can be art. Look at what\'s out there.', effects: [{ npcId: 'helena', hearts: 0.3 }, { npcId: 'bernie', hearts: 0.3 }] },
        optionB: { text: 'You\'re right. Your vision deserves the cinema.', effects: [{ npcId: 'helena', hearts: 0.5 }, { npcId: 'bernie', hearts: -0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'I found a box of letters my mother wrote during the war. There\'s a film in there.',
        optionA: { text: 'That sounds extraordinary. Bring me a treatment.', effects: [{ npcId: 'helena', hearts: 1.0 }] },
        optionB: { text: 'War stories are a saturated market right now.', effects: [{ npcId: 'helena', hearts: -1.0 }] },
      },
      {
        npcLine: 'You don\'t flatter me and you don\'t patronize me. That\'s why I keep coming back.',
        optionA: { text: 'You\'d see through it anyway.', effects: [{ npcId: 'helena', hearts: 0.6 }] },
        optionB: { text: 'I just give you what the work needs.', effects: [{ npcId: 'helena', hearts: 0.8 }] },
      },
      {
        npcLine: 'My wife thinks I should retire. She might be right. But not yet.',
        optionA: { text: 'One more film. Make it the one you\'ve been afraid to make.', effects: [{ npcId: 'helena', hearts: 1.0 }] },
        optionB: { text: 'Retirement isn\'t so bad. You\'ve earned it.', effects: [{ npcId: 'helena', hearts: -0.5 }] },
      },
    ],
    max: [
      {
        npcLine: 'The retrospective they\'re doing at EYE — they asked me to name my most important collaborator.',
        optionA: { text: 'I\'m just the person who said yes.', effects: [{ npcId: 'helena', hearts: 0.5 }] },
        optionB: { text: 'The collaborator was the work itself.', effects: [{ npcId: 'helena', hearts: 0.3 }] },
      },
      {
        npcLine: 'I want to teach a masterclass. And I want you to co-host it.',
        optionA: { text: 'I\'d learn more than anyone in the room.', effects: [{ npcId: 'helena', hearts: 0.5 }] },
        optionB: { text: 'That\'s your stage. I\'ll be in the front row.', effects: [{ npcId: 'helena', hearts: 0.3 }] },
      },
    ],
  },

  // ─── JAKE MORRISON (hitmaker, prefers direct) ────────────────────────
  jake: {
    low: [
      {
        npcLine: 'My last project did 50 million views. What have your "art" picks done?',
        optionA: { text: 'Numbers aren\'t everything, but yours are impressive.', effects: [{ npcId: 'jake', hearts: 0.5 }] },
        optionB: { text: 'Views don\'t equal quality and you know it.', effects: [{ npcId: 'jake', hearts: -0.5 }] },
      },
      {
        npcLine: 'Katrien called my work "wallpaper for screens." Can you believe that?',
        optionA: { text: 'She\'s an artist. They say things like that.', effects: [{ npcId: 'jake', hearts: 0.3 }, { npcId: 'katrien', hearts: 0.3 }] },
        optionB: { text: 'Your wallpaper pays for her art house experiments.', effects: [{ npcId: 'jake', hearts: 0.8 }, { npcId: 'katrien', hearts: -0.5 }] },
      },
      {
        npcLine: 'I need a greenlight by Friday or I\'m taking this to Netflix.',
        optionA: { text: 'Let me see the numbers first. Then we\'ll talk.', effects: [{ npcId: 'jake', hearts: 0.5 }] },
        optionB: { text: 'Threats don\'t work on me, Jake.', effects: [{ npcId: 'jake', hearts: -0.5 }] },
      },
    ],
    mid: [
      {
        npcLine: 'Between us — I wrote a short film. No commercial angle. Just... a story.',
        optionA: { text: 'Send it over. I want to read it.', effects: [{ npcId: 'jake', hearts: 0.8 }] },
        optionB: { text: 'Stick to what works. The market needs you.', effects: [{ npcId: 'jake', hearts: -0.3 }] },
      },
      {
        npcLine: 'Lena\'s data says comedy is trending. I\'ve got a comedy pitch. Coincidence?',
        optionA: { text: 'Smart move. Ride the wave.', effects: [{ npcId: 'jake', hearts: 0.6 }, { npcId: 'lena', hearts: 0.3 }] },
        optionB: { text: 'Don\'t chase trends. Make what only you can make.', effects: [{ npcId: 'jake', hearts: 0.3 }] },
      },
      {
        npcLine: 'I\'ve been watching Yuki\'s films late at night. Don\'t tell anyone.',
        optionA: { text: 'Your secret\'s safe. What did you think?', effects: [{ npcId: 'jake', hearts: 0.6 }, { npcId: 'yuki', hearts: 0.3 }] },
        optionB: { text: 'Maybe there\'s an artist in there after all.', effects: [{ npcId: 'jake', hearts: 0.5 }] },
      },
    ],
    high: [
      {
        npcLine: 'I want to make something real, Steve. Not content. A film. Can you help me?',
        optionA: { text: 'That\'s the Jake Morrison I\'ve been waiting to meet.', effects: [{ npcId: 'jake', hearts: 1.0 }] },
        optionB: { text: 'Real doesn\'t pay the bills. But let\'s see what you\'ve got.', effects: [{ npcId: 'jake', hearts: 0.3 }] },
      },
      {
        npcLine: 'My agent says I\'m crazy for working with a small Amsterdam office. Prove him wrong.',
        optionA: { text: 'We\'ll make something he can\'t ignore.', effects: [{ npcId: 'jake', hearts: 0.8 }] },
        optionB: { text: 'Your agent might have a point about the scale.', effects: [{ npcId: 'jake', hearts: -0.5 }] },
      },
      {
        npcLine: 'Katrien and I had coffee yesterday. Didn\'t kill each other. Progress?',
        optionA: { text: 'Maybe you two should collaborate sometime.', effects: [{ npcId: 'jake', hearts: 0.5 }, { npcId: 'katrien', hearts: 0.5 }] },
        optionB: { text: 'Don\'t push it. Détente is enough.', effects: [{ npcId: 'jake', hearts: 0.3 }] },
      },
    ],
    max: [
      {
        npcLine: 'The personal film is done. It\'s the best thing I\'ve ever made. And it\'ll make no money.',
        optionA: { text: 'Some things are worth more than money. Even for you.', effects: [{ npcId: 'jake', hearts: 0.5 }] },
        optionB: { text: 'Let\'s find a way to make it work commercially too.', effects: [{ npcId: 'jake', hearts: 0.2 }] },
      },
      {
        npcLine: 'You saw something in me that my agent, my manager, and my mother didn\'t.',
        optionA: { text: 'It was always there. You just needed permission.', effects: [{ npcId: 'jake', hearts: 0.5 }] },
        optionB: { text: 'Now make another one. The world needs it.', effects: [{ npcId: 'jake', hearts: 0.3 }] },
      },
    ],
  },

  // ─── YUKI TANAKA (festival darling, prefers gentle) ──────────────────
  yuki: {
    low: [
      {
        npcLine: 'You\'re going to ask me about audience metrics, aren\'t you.',
        optionA: { text: 'No. Tell me about the film.', effects: [{ npcId: 'yuki', hearts: 0.8 }] },
        optionB: { text: 'We do need to discuss the numbers eventually.', effects: [{ npcId: 'yuki', hearts: -0.5 }] },
      },
      {
        npcLine: 'Jake suggested I add a car chase to my meditation drama. He was serious.',
        optionA: { text: 'That\'s very Jake. Ignore him.', effects: [{ npcId: 'yuki', hearts: 0.5 }, { npcId: 'jake', hearts: -0.3 }] },
        optionB: { text: 'Maybe not a car chase, but some momentum wouldn\'t hurt.', effects: [{ npcId: 'yuki', hearts: -0.3 }] },
      },
      {
        npcLine: 'My films don\'t make money. Does that make them failures?',
        optionA: { text: 'Art doesn\'t need a profit margin to matter.', effects: [{ npcId: 'yuki', hearts: 0.8 }] },
        optionB: { text: 'Not failures, but sustainability matters too.', effects: [{ npcId: 'yuki', hearts: -0.3 }] },
      },
    ],
    mid: [
      {
        npcLine: 'I\'ve been experimenting with no dialogue at all. Just images and sound.',
        optionA: { text: 'That\'s brave. Show me what you have.', effects: [{ npcId: 'yuki', hearts: 0.8 }] },
        optionB: { text: 'Audiences need something to hold onto.', effects: [{ npcId: 'yuki', hearts: -0.5 }] },
      },
      {
        npcLine: 'Katrien understands my work. The rest of this office looks at me like I\'m alien.',
        optionA: { text: 'I\'m trying to understand it too. Help me.', effects: [{ npcId: 'yuki', hearts: 0.6 }] },
        optionB: { text: 'You two are kindred spirits.', effects: [{ npcId: 'yuki', hearts: 0.3 }, { npcId: 'katrien', hearts: 0.3 }] },
      },
      {
        npcLine: 'Rotterdam offered me a sidebar slot. Not the main program. Should I be insulted?',
        optionA: { text: 'A sidebar at Rotterdam is still Rotterdam.', effects: [{ npcId: 'yuki', hearts: 0.5 }] },
        optionB: { text: 'You deserve main competition. Hold out for Cannes.', effects: [{ npcId: 'yuki', hearts: 0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'I dreamed about the ending of my film last night. It came fully formed.',
        optionA: { text: 'Trust that instinct. The subconscious knows.', effects: [{ npcId: 'yuki', hearts: 1.0 }] },
        optionB: { text: 'Write it down before the logic brain kicks in.', effects: [{ npcId: 'yuki', hearts: 0.6 }] },
      },
      {
        npcLine: 'My mother in Tokyo saw my last film. She said she finally understood what I do.',
        optionA: { text: 'That might be worth more than any award.', effects: [{ npcId: 'yuki', hearts: 0.8 }] },
        optionB: { text: 'Family understanding is rare in this business.', effects: [{ npcId: 'yuki', hearts: 0.5 }] },
      },
      {
        npcLine: 'Would you greenlight something you loved even if Lena\'s data said it would fail?',
        optionA: { text: 'Yes. Some bets are worth making.', effects: [{ npcId: 'yuki', hearts: 1.0 }, { npcId: 'lena', hearts: -0.3 }] },
        optionB: { text: 'I\'d find a way to make the data work for us.', effects: [{ npcId: 'yuki', hearts: 0.3 }, { npcId: 'lena', hearts: 0.3 }] },
      },
    ],
    max: [
      {
        npcLine: 'Venice called. Golden Lion nomination. I can\'t breathe.',
        optionA: { text: 'Breathe. You deserve every moment of this.', effects: [{ npcId: 'yuki', hearts: 0.5 }] },
        optionB: { text: 'Let\'s plan the premiere strategy.', effects: [{ npcId: 'yuki', hearts: 0.2 }] },
      },
      {
        npcLine: 'You never asked me to be someone else. In this industry, that\'s everything.',
        optionA: { text: 'The world needs exactly the kind of films you make.', effects: [{ npcId: 'yuki', hearts: 0.5 }] },
        optionB: { text: 'Just keep making them. That\'s all I ask.', effects: [{ npcId: 'yuki', hearts: 0.3 }] },
      },
    ],
  },

  // ─── BERNIE OKAFOR (boss, prefers direct) ────────────────────────────
  bernie: {
    low: [
      {
        npcLine: 'The board is asking why our pipeline is thin. What do I tell them?',
        optionA: { text: 'We\'re being selective. Quality over quantity.', effects: [{ npcId: 'bernie', hearts: 0.5 }] },
        optionB: { text: 'I\'ll push more greenlights this week.', effects: [{ npcId: 'bernie', hearts: 0.3 }] },
      },
      {
        npcLine: 'London wants commercial hits. I want us to survive. Find the overlap.',
        optionA: { text: 'Commercial and good aren\'t mutually exclusive.', effects: [{ npcId: 'bernie', hearts: 0.6 }] },
        optionB: { text: 'Maybe we lean commercial for one quarter.', effects: [{ npcId: 'bernie', hearts: 0.3 }] },
      },
      {
        npcLine: 'Your coverage reports are getting better. Don\'t let that go to your head.',
        optionA: { text: 'Noted. I\'ll keep pushing.', effects: [{ npcId: 'bernie', hearts: 0.5 }] },
        optionB: { text: 'Thanks, Bernie. That means a lot.', effects: [{ npcId: 'bernie', hearts: 0.3 }] },
      },
    ],
    mid: [
      {
        npcLine: 'I\'m putting you on the Johansson project. Don\'t screw it up.',
        optionA: { text: 'I won\'t. Helena and I work well together.', effects: [{ npcId: 'bernie', hearts: 0.5 }, { npcId: 'helena', hearts: 0.3 }] },
        optionB: { text: 'I\'m ready. What\'s the brief?', effects: [{ npcId: 'bernie', hearts: 0.6 }] },
      },
      {
        npcLine: 'There\'s a budget meeting next week. I need you to present the slate.',
        optionA: { text: 'I\'ll have the deck ready by Thursday.', effects: [{ npcId: 'bernie', hearts: 0.6 }] },
        optionB: { text: 'Can Lena help with the data side?', effects: [{ npcId: 'bernie', hearts: 0.3 }, { npcId: 'lena', hearts: 0.3 }] },
      },
      {
        npcLine: 'Between us — I fought to keep this Amsterdam office open. Don\'t make me regret it.',
        optionA: { text: 'You won\'t regret it. I\'ll make this office shine.', effects: [{ npcId: 'bernie', hearts: 0.8 }] },
        optionB: { text: 'That\'s a lot of pressure, Bernie.', effects: [{ npcId: 'bernie', hearts: -0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'I\'m recommending you for a promotion. Don\'t tell anyone yet.',
        optionA: { text: 'I won\'t let you down.', effects: [{ npcId: 'bernie', hearts: 0.8 }] },
        optionB: { text: 'What does the role look like?', effects: [{ npcId: 'bernie', hearts: 0.5 }] },
      },
      {
        npcLine: 'London approved the extra budget I requested. I may have mentioned your track record.',
        optionA: { text: 'Let\'s put it to good use.', effects: [{ npcId: 'bernie', hearts: 0.6 }], special: { type: 'budget_bonus', amount: 30 } },
        optionB: { text: 'That\'s generous. I hope the pressure doesn\'t come with it.', effects: [{ npcId: 'bernie', hearts: 0.3 }], special: { type: 'budget_bonus', amount: 15 } },
      },
      {
        npcLine: 'The Amsterdam office outperformed LA last quarter. That\'s never happened before.',
        optionA: { text: 'It\'s the team. Every one of them.', effects: [{ npcId: 'bernie', hearts: 0.8 }] },
        optionB: { text: 'Let\'s keep that momentum going.', effects: [{ npcId: 'bernie', hearts: 0.5 }] },
      },
    ],
    max: [
      {
        npcLine: 'I\'m retiring next year. I want you to take my chair. Think about it.',
        optionA: { text: 'I\'ll think about it. But this office is yours, Bernie.', effects: [{ npcId: 'bernie', hearts: 0.5 }] },
        optionB: { text: 'I\'m honored. Let\'s make this last year count.', effects: [{ npcId: 'bernie', hearts: 0.5 }], special: { type: 'budget_bonus', amount: 50 } },
      },
      {
        npcLine: 'You\'re the best hire I ever made. And I\'ve hired a lot of people.',
        optionA: { text: 'I learned from watching you.', effects: [{ npcId: 'bernie', hearts: 0.3 }] },
        optionB: { text: 'Then give me a raise.', effects: [{ npcId: 'bernie', hearts: 0.5 }], special: { type: 'budget_bonus', amount: 20 } },
      },
    ],
  },

  // ─── LENA VOGEL (data analyst, prefers direct) ───────────────────────
  lena: {
    low: [
      {
        npcLine: 'I ran the completion data on your last greenlight. Want to see? It\'s... informative.',
        optionA: { text: 'Show me. I can handle bad news.', effects: [{ npcId: 'lena', hearts: 0.6 }] },
        optionB: { text: 'Numbers don\'t capture everything about a show.', effects: [{ npcId: 'lena', hearts: -0.5 }] },
      },
      {
        npcLine: 'People think data kills creativity. I think it just kills bad ideas faster.',
        optionA: { text: 'That\'s a good way to look at it.', effects: [{ npcId: 'lena', hearts: 0.5 }] },
        optionB: { text: 'Some bad ideas become great films.', effects: [{ npcId: 'lena', hearts: -0.3 }] },
      },
      {
        npcLine: 'Katrien won\'t talk to me. Apparently I\'m "the algorithm."',
        optionA: { text: 'She\'ll come around. Artists fear what they don\'t understand.', effects: [{ npcId: 'lena', hearts: 0.5 }, { npcId: 'katrien', hearts: -0.3 }] },
        optionB: { text: 'Maybe try framing it as insight, not metrics.', effects: [{ npcId: 'lena', hearts: 0.3 }, { npcId: 'katrien', hearts: 0.3 }] },
      },
    ],
    mid: [
      {
        npcLine: 'I\'ve got early data on the next batch of scripts. Want a preview?',
        optionA: { text: 'Absolutely. Knowledge is power.', effects: [{ npcId: 'lena', hearts: 0.6 }], special: { type: 'reveal_commercial' } },
        optionB: { text: 'I should read them fresh first.', effects: [{ npcId: 'lena', hearts: -0.3 }] },
      },
      {
        npcLine: 'I built a model that predicts critical reception within 0.5 points. Want access?',
        optionA: { text: 'That\'s incredible. Send me the dashboard.', effects: [{ npcId: 'lena', hearts: 0.8 }], special: { type: 'reveal_commercial' } },
        optionB: { text: 'Impressive, but I don\'t want it to bias my judgment.', effects: [{ npcId: 'lena', hearts: 0.3 }] },
      },
      {
        npcLine: 'Jake\'s been asking me for competitor data. Should I share it with him?',
        optionA: { text: 'Only the high-level stuff. Keep the details internal.', effects: [{ npcId: 'lena', hearts: 0.5 }] },
        optionB: { text: 'Let him have it. Collaboration helps everyone.', effects: [{ npcId: 'lena', hearts: 0.3 }, { npcId: 'jake', hearts: 0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'I\'ve been tracking your greenlight decisions. Your hit rate is above average.',
        optionA: { text: 'That\'s partly thanks to your data.', effects: [{ npcId: 'lena', hearts: 0.8 }], special: { type: 'reveal_commercial' } },
        optionB: { text: 'Instinct plus data. The winning formula.', effects: [{ npcId: 'lena', hearts: 0.6 }] },
      },
      {
        npcLine: 'I\'m presenting at a data conference next month. Nervous. Any advice?',
        optionA: { text: 'Lead with a story, not a chart. Then hit them with the numbers.', effects: [{ npcId: 'lena', hearts: 1.0 }] },
        optionB: { text: 'You know the material better than anyone. You\'ll be great.', effects: [{ npcId: 'lena', hearts: 0.6 }] },
      },
      {
        npcLine: 'Some days I wonder if anyone here values what I do. Then you ask for a report.',
        optionA: { text: 'Your work is the foundation everything else is built on.', effects: [{ npcId: 'lena', hearts: 0.8 }] },
        optionB: { text: 'Data and taste together. That\'s how we win.', effects: [{ npcId: 'lena', hearts: 0.6 }] },
      },
    ],
    max: [
      {
        npcLine: 'I got offered a job at Google. Twice the salary. But I\'d miss... this.',
        optionA: { text: 'We\'d miss you too. Stay. We need you.', effects: [{ npcId: 'lena', hearts: 0.5 }] },
        optionB: { text: 'Only you can make that choice. But selfishly — please stay.', effects: [{ npcId: 'lena', hearts: 0.5 }] },
      },
      {
        npcLine: 'I made something for you — a personalized dashboard for your slate. Check your email.',
        optionA: { text: 'Lena, this is amazing. Thank you.', effects: [{ npcId: 'lena', hearts: 0.3 }], special: { type: 'reveal_commercial' } },
        optionB: { text: 'You built this just for me? I\'m genuinely touched.', effects: [{ npcId: 'lena', hearts: 0.5 }], special: { type: 'reveal_commercial' } },
      },
    ],
  },

  // ─── PIETER DE JONG (office manager, prefers gentle) ─────────────────
  pieter: {
    low: [
      {
        npcLine: 'Between us, Katrien\'s been stressed about her next pitch. Handle her gently.',
        optionA: { text: 'Thanks for the heads-up. I\'ll be careful.', effects: [{ npcId: 'pieter', hearts: 0.6 }], special: { type: 'reveal_preference', filmmakerIndex: 0 } },
        optionB: { text: 'She\'s always stressed. That\'s just Katrien.', effects: [{ npcId: 'pieter', hearts: -0.3 }] },
      },
      {
        npcLine: 'The kitchen is a disaster. Nobody cleans up around here except me.',
        optionA: { text: 'I\'ll help you tidy up. It\'s the least I can do.', effects: [{ npcId: 'pieter', hearts: 0.6 }] },
        optionB: { text: 'Maybe send an email about it?', effects: [{ npcId: 'pieter', hearts: -0.3 }] },
      },
      {
        npcLine: 'Marco\'s been eating lunch alone every day. Someone should sit with him.',
        optionA: { text: 'I\'ll make a point to. Thanks for noticing, Pieter.', effects: [{ npcId: 'pieter', hearts: 0.5 }, { npcId: 'marco', hearts: 0.3 }] },
        optionB: { text: 'He\'s probably just working through lunch.', effects: [{ npcId: 'pieter', hearts: -0.3 }] },
      },
    ],
    mid: [
      {
        npcLine: 'Helena\'s anniversary is next week. I\'m planning a small thing. Want to help?',
        optionA: { text: 'Count me in. What do you need?', effects: [{ npcId: 'pieter', hearts: 0.6 }, { npcId: 'helena', hearts: 0.3 }] },
        optionB: { text: 'I\'m swamped, but send my regards.', effects: [{ npcId: 'pieter', hearts: -0.3 }] },
      },
      {
        npcLine: 'Word is Jake\'s looking for direct feedback on his new pitch. He wants honesty.',
        optionA: { text: 'Good to know. I\'ll be straight with him.', effects: [{ npcId: 'pieter', hearts: 0.5 }], special: { type: 'reveal_preference', filmmakerIndex: 3 } },
        optionB: { text: 'Jake always says that, then gets defensive.', effects: [{ npcId: 'pieter', hearts: 0.3 }] },
      },
      {
        npcLine: 'I overheard Bernie on the phone with London. Sounded tense. Be extra good this week.',
        optionA: { text: 'Noted. I\'ll bring my A-game.', effects: [{ npcId: 'pieter', hearts: 0.5 }, { npcId: 'bernie', hearts: 0.3 }] },
        optionB: { text: 'Bernie can handle London. He always does.', effects: [{ npcId: 'pieter', hearts: 0.3 }] },
      },
    ],
    high: [
      {
        npcLine: 'Yuki left a thank-you note on your desk. She was too shy to give it in person.',
        optionA: { text: 'That\'s sweet. I\'ll find her and thank her properly.', effects: [{ npcId: 'pieter', hearts: 0.6 }, { npcId: 'yuki', hearts: 0.3 }] },
        optionB: { text: 'Pieter, you see everything, don\'t you?', effects: [{ npcId: 'pieter', hearts: 0.5 }] },
      },
      {
        npcLine: 'Marco\'s nervous about his next pitch. Might need the gentle approach.',
        optionA: { text: 'I\'ll keep that in mind. You always look out for people.', effects: [{ npcId: 'pieter', hearts: 0.6 }], special: { type: 'reveal_preference', filmmakerIndex: 1 } },
        optionB: { text: 'Marco needs to toughen up eventually.', effects: [{ npcId: 'pieter', hearts: -0.5 }, { npcId: 'marco', hearts: -0.3 }] },
      },
      {
        npcLine: 'This office would fall apart without you. I\'ve told Bernie as much.',
        optionA: { text: 'And it would fall apart without you, Pieter.', effects: [{ npcId: 'pieter', hearts: 0.8 }] },
        optionB: { text: 'We\'re a team. It takes all of us.', effects: [{ npcId: 'pieter', hearts: 0.6 }] },
      },
    ],
    max: [
      {
        npcLine: 'I\'ve been offered a job managing a bigger office in London. But this place is home.',
        optionA: { text: 'Amsterdam wouldn\'t be the same without you.', effects: [{ npcId: 'pieter', hearts: 0.5 }] },
        optionB: { text: 'Follow your heart. You\'ll make the right choice.', effects: [{ npcId: 'pieter', hearts: 0.3 }] },
      },
      {
        npcLine: 'I keep a list of everyone who\'s been kind in this building. You\'re at the top.',
        optionA: { text: 'That might be the nicest thing anyone\'s ever said to me.', effects: [{ npcId: 'pieter', hearts: 0.5 }] },
        optionB: { text: 'You bring out the best in people, Pieter.', effects: [{ npcId: 'pieter', hearts: 0.5 }] },
      },
    ],
  },
};

/**
 * Pick a dialogue choice for a character based on current hearts.
 * Returns a random encounter from the appropriate tier, or null if none available.
 */
export function getDialogueChoice(characterId, hearts) {
  const charChoices = DIALOGUE_CHOICES[characterId];
  if (!charChoices) return null;

  let tier;
  if (hearts >= 9) tier = 'max';
  else if (hearts >= 6) tier = 'high';
  else if (hearts >= 3) tier = 'mid';
  else tier = 'low';

  const pool = charChoices[tier];
  if (!pool?.length) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}
