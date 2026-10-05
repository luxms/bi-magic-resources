/**
 * @fileoverview Нормализация текстовых ресурсов для сборки и синхронизации.
 */
const path = require('path');

/**
 * @typedef {Object} SourceMapV3
 * @property {number} version Версия формата; обрабатывается только число 3.
 * @property {string} [file] Имя сгенерированного файла.
 * @property {string} [sourceRoot] Общий путь к исходникам.
 * @property {string[]} [sources] Пути исходных файлов.
 * @property {string[]} [names] Имена символов в карте.
 * @property {string} [mappings] Закодированные соответствия позиций в коде.
 * @property {Array<string|null>} [sourcesContent] Встроенные исходники или null.
 * @property {SourceMapSection[]} [sections] Секции индексированной карты.
 */

/**
 * @typedef {Object} SourceMapSection
 * @property {{line: number, column: number}} offset Начальная позиция секции.
 * @property {SourceMapV3} [map] Встроенная карта для рекурсивной обработки.
 * @property {string} [url] Ссылка на внешнюю карту; функция её не загружает.
 */

/**
 * Расширения ресурсов, для которых разрешена нормализация текста.
 * @private
 * @type {string[]}
 */
const TEXT_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.css', '.scss', '.sass', '.less', '.html', '.htm', '.svg', '.xml',
  '.json', '.json5', '.map', '.txt', '.md', '.yaml', '.yml',
  '.csv', '.tsv', '.sql', '.lpe',
];

/**
 * Заменяет фактические CRLF и одиночные CR на LF.
 * Не раскрывает escape-последовательности и не добавляет конечный перевод строки.
 *
 * @param {string} text Текст с любым сочетанием CRLF, CR и LF.
 * @returns {string} Текст с заменёнными переводами строк.
 */
function normalizeLineEndings(text) {
  return text.replace(/\r\n?/g, '\n');
}

/**
 * Нормализует встроенные исходные тексты карты версии 3, не меняя оригинал.
 * Обрабатывает sourcesContent и вложенные sections[].map; метаданные сохраняет.
 * Ожидается корректная нециклическая карта. Внешние карты по url не загружаются.
 *
 * @param {SourceMapV3|Object|null|undefined} sourceMap Уже разобранная карта.
 * @returns {SourceMapV3|Object|null|undefined} Поверхностная копия с обновлёнными
 *   исходниками и секциями либо исходное значение для неподдерживаемой версии.
 */
function normalizeSourceMap(sourceMap) {
  if (!sourceMap || sourceMap.version !== 3) return sourceMap;
  const result = {...sourceMap};
  if (Array.isArray(result.sourcesContent)) {
    result.sourcesContent = result.sourcesContent.map(content =>
      typeof content === 'string' ? normalizeLineEndings(content) : content);
  }
  if (Array.isArray(result.sections)) {
    result.sections = result.sections.map(section =>
      section.map ? {...section, map: normalizeSourceMap(section.map)} : section);
  }
  return result;
}

/**
 * Приводит содержимое поддерживаемого текстового ресурса к LF.
 * Неизвестные расширения, разобранные JSON-объекты, содержимое с NUL
 * и Buffer с некорректным UTF-8 возвращает без изменений.
 *
 * Для .map версии 3 также нормализует встроенные исходники и компактно
 * сериализует JSON. При ошибке остаётся только замена физических переводов строк.
 * Escape-последовательности в обычных .json сохраняются.
 *
 * Не меняет входные данные, сохраняет тип string/Buffer. Если изменений нет,
 * возвращает исходное значение, включая тот же экземпляр Buffer.
 *
 * @param {string} filePath Путь с расширением без query-параметров и фрагмента.
 * @param {*} content Содержимое ресурса: обычно string, Buffer или JSON-объект.
 * @returns {*} Нормализованное содержимое либо исходное значение.
 */
function normalizeResourceContent(filePath, content) {
  const extension = path.extname(filePath).toLowerCase();
  if (!TEXT_EXTENSIONS.includes(extension)) return content;
  const isBuffer = Buffer.isBuffer(content);
  // Parsed JSON objects contain data, including meaningful line endings in strings.
  if (!isBuffer && typeof content !== 'string') return content;

  const text = isBuffer ? content.toString('utf8') : content;
  if (text.includes('\0') || (isBuffer && !Buffer.from(text, 'utf8').equals(content))) return content;

  let normalized = normalizeLineEndings(text);
  if (extension === '.map') {
    try {
      const sourceMap = JSON.parse(normalized);
      if (sourceMap && sourceMap.version === 3) {
        normalized = JSON.stringify(normalizeSourceMap(sourceMap));
      }
    } catch {
      // A .map file is not necessarily a JSON source map.
    }
  }
  if (normalized === text) return content;
  return isBuffer ? Buffer.from(normalized, 'utf8') : normalized;
}

/**
 * Проверяет строгое равенство, затем сравнивает string/Buffer по байтам.
 * Строки кодирует в UTF-8; переводы строк не нормализует, объекты глубоко не сравнивает.
 *
 * @param {*} left Первое содержимое ресурса.
 * @param {*} right Второе содержимое ресурса.
 * @returns {boolean} true при строгом равенстве или совпадении байтов string/Buffer.
 */
function equalContentBytes(left, right) {
  if (left === right) return true;
  const isBytes = value => Buffer.isBuffer(value) || typeof value === 'string';
  if (!isBytes(left) || !isBytes(right)) return false;
  return Buffer.from(left).equals(Buffer.from(right));
}

module.exports = {normalizeLineEndings, normalizeSourceMap, normalizeResourceContent, equalContentBytes};
