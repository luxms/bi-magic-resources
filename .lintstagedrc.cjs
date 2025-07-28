module.exports = {
  '*.{js,jsx,ts,tsx}': () => [
    'npm run check:ts',
    'npm run lint:ts',  
    'npm run format',
  ],
  '**/*.scss': ['npm run lint:scss', 'npm run format'],
};
