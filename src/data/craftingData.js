export const RECIPES = [
  {
    id: 'pitch',
    name: 'Pitch',
    description: 'Combine a script with an idea',
    inputs: { script: 1, idea: 1 },
    output: { type: 'pitch', amount: 1 },
  },
  {
    id: 'project',
    name: 'Project',
    description: 'Attach contacts to your pitch',
    inputs: { pitch: 1, contact: 1 },
    output: { type: 'project', amount: 1 },
  },
  {
    id: 'complete',
    name: 'Complete Show',
    description: 'Finish the project with coffee',
    inputs: { project: 1, coffee: 1 },
    output: { type: 'coin', amount: 10, xp: 10 },
  },
  {
    id: 'documentary',
    name: 'Documentary',
    description: 'A quick low-budget production',
    inputs: { script: 2, coffee: 1 },
    output: { type: 'coin', amount: 6, xp: 6 },
  },
  {
    id: 'reality_show',
    name: 'Reality Show',
    description: 'No script needed, just drama',
    inputs: { idea: 2, contact: 2 },
    output: { type: 'coin', amount: 8, xp: 8 },
  },
  {
    id: 'blockbuster',
    name: 'Blockbuster',
    description: 'The ultimate production',
    inputs: { project: 1, pitch: 1 },
    output: { type: 'coin', amount: 25, xp: 20 },
  },
];
