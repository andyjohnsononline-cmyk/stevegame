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
];
