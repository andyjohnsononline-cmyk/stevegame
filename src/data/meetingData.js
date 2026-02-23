export const MEETING_SCENARIOS = {
  boss_one_on_one: [
    {
      id: 'boss_slate_defense',
      type: 'boss_one_on_one',
      title: 'One-on-One with Bernie',
      speaker: "Bernard 'Bernie' Okafor",
      steps: [
        {
          prompt: 'Steve, I\'ve been looking at your recent greenlights. Walk me through your thinking on the current slate.',
          choices: [
            {
              text: '"I\'m prioritising festival-quality projects with long-term prestige value."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 5 }, { type: 'reputation', repType: 'commercial', amount: -2 }],
            },
            {
              text: '"The numbers are front of mind. Every greenlight has a clear audience."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 5 }, { type: 'reputation', repType: 'creative', amount: -2 }],
            },
            {
              text: '"I\'m balancing risk and reward — some safe bets, some creative swings."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 4 }],
            },
          ],
        },
        {
          prompt: 'London is asking about our pipeline. They want to know we\'re competitive. What do I tell them?',
          choices: [
            {
              text: '"Tell them we\'re building a slate that\'ll win awards. That\'s how you compete."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 3 }],
            },
            {
              text: '"Tell them the viewership projections are strong. We\'re on track."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 3 }],
            },
            {
              text: '"Tell them we\'ve got the right relationships. The talent wants to work with us."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 3 }],
            },
          ],
        },
      ],
    },
    {
      id: 'boss_performance',
      type: 'boss_one_on_one',
      title: 'Performance Check-in',
      speaker: "Bernard 'Bernie' Okafor",
      steps: [
        {
          prompt: 'Be honest with me, Steve. How do you think things are going? And I don\'t mean the polite answer.',
          choices: [
            {
              text: '"Honestly? I think we\'re making brave choices. Not all of them will land, but the ones that do will matter."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 4 }, { type: 'reputation', repType: 'industry', amount: 2 }],
            },
            {
              text: '"The pipeline is solid. I\'ve been focused on de-risking where I can."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 4 }, { type: 'reputation', repType: 'industry', amount: 2 }],
            },
            {
              text: '"There\'s room for improvement. I\'m learning what works in this market."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 5 }],
            },
          ],
        },
        {
          prompt: 'One more thing. I need you to think about what kind of executive you want to be. This job shapes you as much as you shape it.',
          choices: [
            {
              text: '"I want to be the exec filmmakers trust with their best work."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 3 }],
            },
            {
              text: '"I want to build a track record that speaks for itself. Numbers and quality."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 2 }, { type: 'reputation', repType: 'creative', amount: 2 }],
            },
            {
              text: '"I want to be someone this industry takes seriously."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 4 }],
            },
          ],
        },
      ],
    },
  ],

  data_review: [
    {
      id: 'data_viewership',
      type: 'data_review',
      title: 'Data Review',
      speaker: 'Lena Vogel',
      steps: [
        {
          prompt: 'I\'ve pulled the latest numbers. Completion rates are the key metric right now. How do you want to approach the gap between our creative slate and audience retention?',
          choices: [
            {
              text: '"Completion rates will follow if the content is good enough. Quality drives retention."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 4 }, { type: 'reputation', repType: 'commercial', amount: -1 }],
            },
            {
              text: '"Let\'s look at what\'s dropping off and adjust. The data should guide development."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 5 }],
            },
            {
              text: '"It\'s not either/or. Help me find projects where quality and retention overlap."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 2 }, { type: 'reputation', repType: 'creative', amount: 2 }],
            },
          ],
        },
        {
          prompt: 'One more thing — the genre breakdown shows we\'re heavy on drama. The 18-34 demo wants more genre content. Thriller, sci-fi, horror. Your call.',
          choices: [
            {
              text: '"We should follow the data. Diversify the genre mix."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 4 }],
            },
            {
              text: '"Drama is our strength. Doubling down is smarter than chasing trends."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 4 }],
            },
            {
              text: '"Let\'s test one or two genre projects without abandoning our identity."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 3 }, { type: 'reputation', repType: 'commercial', amount: 1 }],
            },
          ],
        },
      ],
    },
    {
      id: 'data_competitive',
      type: 'data_review',
      title: 'Competitive Analysis',
      speaker: 'Lena Vogel',
      steps: [
        {
          prompt: 'I\'ve been benchmarking us against three other streamers. We\'re behind on volume but ahead on critical reception. What\'s your read on that?',
          choices: [
            {
              text: '"Critical reception builds brand. Long-term, that\'s more valuable than volume."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 5 }],
            },
            {
              text: '"Volume matters. We need to increase output without sacrificing too much quality."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 4 }, { type: 'reputation', repType: 'creative', amount: -1 }],
            },
            {
              text: '"Both metrics matter. Let\'s find the sweet spot."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 3 }, { type: 'reputation', repType: 'commercial', amount: 1 }],
            },
          ],
        },
      ],
    },
  ],

  strategy_session: [
    {
      id: 'strategy_quarterly',
      type: 'strategy_session',
      title: 'Quarterly Strategy Session',
      speaker: "Bernard 'Bernie' Okafor",
      steps: [
        {
          prompt: 'It\'s time to set the strategic focus for the coming weeks. This will shape what shows up in your inbox. What direction do you want to take?',
          choices: [
            {
              text: '"Prestige push — I want to build our creative reputation with ambitious, original work."',
              effects: [{ type: 'strategy', focus: 'prestige' }, { type: 'reputation', repType: 'creative', amount: 3 }],
            },
            {
              text: '"Audience growth — let\'s focus on projects with clear commercial appeal."',
              effects: [{ type: 'strategy', focus: 'audience' }, { type: 'reputation', repType: 'commercial', amount: 3 }],
            },
            {
              text: '"Balanced slate — keep the mix diverse. Some swings, some safe bets."',
              effects: [{ type: 'strategy', focus: 'balanced' }, { type: 'reputation', repType: 'industry', amount: 3 }],
            },
          ],
        },
        {
          prompt: 'Good. And one more thing — where do you want to invest relationship capital? We can\'t court everyone.',
          choices: [
            {
              text: '"Auteur filmmakers. The kind of talent that elevates the brand."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 2 }],
            },
            {
              text: '"Proven hitmakers. People who deliver audiences reliably."',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 2 }],
            },
            {
              text: '"New voices. Fresh perspectives are our competitive edge."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 2 }, { type: 'reputation', repType: 'creative', amount: 1 }],
            },
          ],
        },
      ],
    },
  ],

  mentoring: [
    {
      id: 'mentee_greenlight_dilemma',
      type: 'mentoring',
      title: 'Mentoring Session',
      speaker: null,
      steps: [
        {
          prompt: null,
          choices: [
            {
              text: '"Trust the script. If the writing is strong, the audience will find it."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 3 }, { type: 'reputation', repType: 'industry', amount: 2 }],
            },
            {
              text: '"Look at the numbers. What does the data say about this genre?"',
              effects: [{ type: 'reputation', repType: 'commercial', amount: 3 }, { type: 'reputation', repType: 'industry', amount: 2 }],
            },
            {
              text: '"Talk to the filmmaker. The best decisions come from understanding the person behind the script."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 4 }],
            },
          ],
        },
      ],
    },
    {
      id: 'mentee_notes_dilemma',
      type: 'mentoring',
      title: 'Mentoring Session',
      speaker: null,
      steps: [
        {
          prompt: null,
          choices: [
            {
              text: '"Be direct. Filmmakers respect honesty more than comfort."',
              effects: [{ type: 'reputation', repType: 'creative', amount: 2 }, { type: 'reputation', repType: 'industry', amount: 3 }],
            },
            {
              text: '"Be supportive first. Build trust, then push for changes."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 4 }],
            },
            {
              text: '"Depends on the filmmaker. Read the room before you give notes."',
              effects: [{ type: 'reputation', repType: 'industry', amount: 3 }, { type: 'reputation', repType: 'creative', amount: 1 }],
            },
          ],
        },
      ],
    },
  ],
};

export const MENTEE_PROMPTS = [
  (name) => `${name} knocks on your door. "Hey Steve, I've got a script on my desk — strong premise, but the dialogue is weak and the filmmaker is... intense. Should I greenlight it or pass?"`,
  (name) => `${name} catches you in the hallway. "Steve, quick question. I've got a filmmaker who wants to do a 6-episode limited series, but the budget is way over. Do I push back or champion it?"`,
  (name) => `${name} looks nervous. "I need to give notes on a script and the filmmaker is already defensive. How do I handle this?"`,
  (name) => `${name} pulls you aside. "Between us — I think a project on my slate is going to underperform. Do I flag it to Bernie now or wait and hope it improves?"`,
];

export function pickMeetingScenario(type) {
  const scenarios = MEETING_SCENARIOS[type];
  if (!scenarios || scenarios.length === 0) return null;
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}
