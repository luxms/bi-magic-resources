const fs = require('fs');
const path = require('path');
const {scanFile, getJsFiles, getStatusFile} = require('./lib/commands');

const ROOT_DIR = path.resolve(__dirname, '..', 'src');
const REPORT_PATH = path.resolve(__dirname, '..', 'react19-report.json');

const PRIORITY_ORDER = {
  high: 2,
  medium: 1,
  low: 0,
};

const CHECKS = [
  // HIGH
  {
    pattern: 'React.createClass',
    priority: 'high',
    title: 'Deprecated API: React.createClass is no longer supported'
  },
  {
    pattern: 'React.PropTypes',
    priority: 'high',
    title: 'Deprecated API: React.PropTypes moved to prop-types package'
  },
  {
    pattern: 'React.findDOMNode',
    priority: 'high',
    title: 'Deprecated API: React.findDOMNode is not recommended'
  },
  {
    regex: /\bcomponentWillMount\b/g,
    priority: 'high',
    title: 'Deprecated lifecycle method'
  },
  {
    regex: /\bcomponentWillReceiveProps\b/g,
    priority: 'high',
    title: 'Deprecated lifecycle method'
  },
  {
    regex: /\bcomponentWillUpdate\b/g,
    priority: 'high',
    title: 'Deprecated lifecycle method'
  },
  {
    regex: /\bcontextTypes\b/g,
    priority: 'high',
    title: 'Legacy context API: contextTypes'
  },
  {
    regex: /\bchildContextTypes\b/g,
    priority: 'high',
    title: 'Legacy context API'
  },
  {
    regex: /\bthis\.refs\b/g,
    priority: 'high',
    title: 'Legacy refs usage: this.refs'
  },
  {
    regex: /\bdefaultProps\b/g,
    priority: 'high',
    title: 'defaultProps usage: may be incompatible with React 19 for function components'
  },
  {
    regex: /\bprocess\.env\.REACT_VERSION\b/g,
    priority: 'high',
    title: 'Custom React version check in code'
  },

  // MEDIUM
  {
    regex: /\bforwardRef\b/g,
    priority: 'medium',
    title: 'forwardRef usage: verify compatibility'
  },
  {
    regex: /\bStrictMode\b/g,
    priority: 'medium',
    title: 'StrictMode detected: check for double render side effects'
  },
  {
    pattern: '__REACT_DEVTOOLS_GLOBAL_HOOK__',
    priority: 'medium',
    title: 'React DevTools hook usage detected'
  },
  {
    regex: /\bunstable_[A-Za-z0-9_]+\b/g,
    priority: 'medium',
    title: 'React unstable API usage detected'
  },

  // LOW
  {
    regex: /\bTODO\b/g,
    priority: 'low',
    title: 'TODO comment found'
  },
  {
    regex: /\bDeprecated\b/g,
    priority: 'low',
    title: 'Deprecated comment found'
  },
  {
    regex: /\bWarning\b/g,
    priority: 'low',
    title: 'Warning comment found'
  },
];

function scan() {
  if (!fs.existsSync(ROOT_DIR)) {
    console.error(`Directory not found: ${ROOT_DIR}`);
    process.exit(1);
  }

  const files = getJsFiles(ROOT_DIR);
  console.log(`Found ${files.length} JS files\n`);

  let countHigh = 0;
  let countMedium = 0;
  let countLow = 0;
  let matches = 0;

  const hooks = new Set();
  const results = [];

  for (const file of files) {
    const scanResult = scanFile(file, CHECKS);
    if (scanResult) results.push(scanResult);
  }

  if (!results.length) {
    console.log('SUCCESS. No matches found');

    const emptyReport = {
      generatedAt: new Date().toISOString(),
      rootDir: ROOT_DIR,
      summary: {
        scannedFiles: files.length,
        filesWithMatches: 0,
        totalMatches: 0,
        highMatches: 0,
        mediumMatches: 0,
        lowMatches: 0,
        customHooksFound: 0,
      },
      customHooks: [],
      files: [],
    };

    fs.writeFileSync(REPORT_PATH, JSON.stringify(emptyReport, null, 2), 'utf8');
    console.log(`JSON report saved to: ${REPORT_PATH}`);
    return;
  }

  for (const item of results) {
    console.log(path.relative(ROOT_DIR, item.filePath));

    const sorted = [...item.found].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );

    sorted.forEach(({title, priority, match}) => {
      const text = match && match !== title
        ? `[${priority.toUpperCase()}] ${title}: ${match}`
        : `[${priority.toUpperCase()}] ${title}`;

      console.log(getStatusFile(text, priority));

      matches++;

      switch (priority) {
        case 'high':
          countHigh++;
          break;
        case 'medium':
          countMedium++;
          break;
        case 'low':
        default:
          countLow++;
          break;
      }
    });

    if (item.customHooks && item.customHooks.length) {
      item.customHooks.forEach((hook) => hooks.add(hook));

      console.log('[INFO] Custom hooks detected:');

      item.customHooks.forEach((hook) => {
        console.log(`  - ${hook}`);
      });
    }

    console.log('');
  }

  console.log(`
  Scanned files: ${files.length}
  Files with matches: ${results.length}
  Total matches: ${matches}
  High matches: ${countHigh}
  Medium matches: ${countMedium}
  Low matches: ${countLow}
  Custom hooks found: ${hooks.size}
  `);

  // if (hooks.size) {
  //   console.log('Custom hooks found in project:');
  //   [...hooks].sort().forEach((hook) => {
  //     console.log(`- ${hook}`);
  //   });
  // }

  const report = {
    generatedAt: new Date().toISOString(),
    rootDir: ROOT_DIR,
    summary: {
      scannedFiles: files.length,
      filesWithMatches: results.length,
      totalMatches: matches,
      highMatches: countHigh,
      mediumMatches: countMedium,
      lowMatches: countLow,
      customHooksFound: hooks.size,
    },
    customHooks: [...hooks].sort(),
    files: results.map((item) => ({
      filePath: path.relative(ROOT_DIR, item.filePath),
      found: [...item.found]
        .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
        .map(({priority, title, match}) => ({
          priority,
          title,
          match,
        })),
      customHooks: [...(item.customHooks || [])].sort(),
    })),
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nJSON report saved to: ${REPORT_PATH}`);
}

scan();
