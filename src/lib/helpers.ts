import { Position, Range, Selection, window } from 'vscode';

const LEFT_SCOPE_SYMBOLS = ['(', '{', '['];
const RIGHT_SCOPE_SYMBOLS = [')', '}', ']'];
const SEPARATORS = [',', ';'];
const QUOTE_SYMBOLS = [`'`, '"', '`'];

export type Arg = { value: string; start: number; end: number };
export type Direction = 'left' | 'right';

export const findNearestBlock = (
  text: string,
  cursor: number
): { content: string; start: number; end: number } | null => {
  if (!text.length || cursor >= text.length) {
    return null;
  }

  let leftIndex = cursor,
    rightIndex = cursor;
  let leftDepth = 0,
    rightDepth = 0;
  let leftFound = false,
    rightFound = false;

  while (!(leftFound && rightFound)) {
    if (leftIndex <= 0 || rightIndex >= text.length) {
      return null;
    }

    if (!leftFound) {
      const leftChar = text[--leftIndex];
      if (LEFT_SCOPE_SYMBOLS.includes(leftChar)) {
        leftDepth === 0 ? (leftFound = true) : leftDepth--;
      }
      if (RIGHT_SCOPE_SYMBOLS.includes(leftChar)) {
        leftDepth++;
      }
    }

    if (!rightFound) {
      const rightChar = text[rightIndex++];
      if (RIGHT_SCOPE_SYMBOLS.includes(rightChar)) {
        rightDepth === 0 ? (rightFound = true) : rightDepth--;
      }
      if (LEFT_SCOPE_SYMBOLS.includes(rightChar)) {
        rightDepth++;
      }
    }
  }

  return leftIndex < rightIndex
    ? {
        content: text.substring(++leftIndex, --rightIndex),
        start: leftIndex,
        end: rightIndex
      }
    : null;
};

export const splitArguments = (text: string, blockStart: number): Arg[] => {
  let args: Arg[] = [];
  let current = '',
    depth = 0,
    inQuotes = false,
    quoteChar = '',
    argStart = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (argStart === -1 && /[^,;\s]/.test(char)) {
      argStart = blockStart + i;
    }
    if (SEPARATORS.includes(char) && depth === 0 && !inQuotes) {
      args.push({
        value: current.trim(),
        start: argStart,
        end: blockStart + i
      });
      current = '';
      argStart = -1;
      continue;
    }
    if (QUOTE_SYMBOLS.includes(char) && (i === 0 || text[i - 1] !== '\\')) {
      inQuotes = inQuotes ? char !== quoteChar : ((quoteChar = char), true);
    }
    if (LEFT_SCOPE_SYMBOLS.includes(char) && !inQuotes) {
      depth++;
    }
    if (RIGHT_SCOPE_SYMBOLS.includes(char) && !inQuotes) {
      depth--;
    }
    if (argStart !== -1) {
      current += char;
    }
  }

  if (current.trim()) {
    args.push({
      value: current.trim(),
      start: argStart,
      end: argStart + current.trim().length
    });
  }
  return args;
};

export const findCurrentArgument = (args: Arg[], cursor: number): number =>
  args.findIndex(({ start, end }) => cursor >= start && cursor <= end);

export const extractArguments = (): { args: Arg[]; argIndex: number } => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return { args: [], argIndex: -1 };
  }

  const { document, selection } = editor;
  const position = selection.active;
  const text = document.getText();
  const offset = document.offsetAt(position);
  const block = findNearestBlock(text, offset);

  if (!block) {
    return { args: [], argIndex: -1 };
  }

  const args = splitArguments(block.content, block.start);
  return { args, argIndex: findCurrentArgument(args, offset) };
};

export const swapArguments = (
  args: Arg[],
  index: number,
  direction: Direction
): Arg[] => {
  if (
    index < 0 ||
    index >= args.length ||
    (direction === 'left' && index === 0) ||
    (direction === 'right' && index === args.length - 1)
  ) {
    return args;
  }

  const swapped = [...args];
  const targetIndex = index + (direction === 'left' ? -1 : 1);

  [swapped[index].value, swapped[targetIndex].value] = [
    swapped[targetIndex].value,
    swapped[index].value
  ];

  return swapped;
};

export const findNewCursorPositionToRight = (line: string, pos: number) => {
  let currentPos = pos;
  let newCursorOffset = -1;
  let depth = 0;
  let quoteChar: string | null = null;

  while (currentPos - 50 <= pos) {
    const char = line[currentPos];

    if (!quoteChar) {
      if (RIGHT_SCOPE_SYMBOLS.includes(char)) {
        depth++;
      }
      if (LEFT_SCOPE_SYMBOLS.includes(char)) {
        depth--;
      }
    }

    if (QUOTE_SYMBOLS.includes(char)) {
      if (quoteChar === char) {
        quoteChar = null;
      } else if (!quoteChar) {
        quoteChar = char;
      }
    }

    if (!quoteChar && depth === 0 && SEPARATORS.includes(char)) {
      currentPos += 2;
      newCursorOffset = currentPos;
      break;
    }

    currentPos++;
  }

  return newCursorOffset;
};

export const replaceArguments = (
  args: Arg[],
  argIndex: number,
  direction: Direction
) => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  const document = editor.document;
  const newArgIndex = argIndex + (direction === 'left' ? -1 : 1);

  let prevLineIndex = -1;
  let newLineIndex = -1;

  let prevPosition: Position | null = null;
  let newPosition: Position | null = null;

  editor
    .edit((editBuilder) => {
      args.forEach(({ value, start, end }, index) => {
        const range = new Range(
          document.positionAt(start),
          document.positionAt(end)
        );

        if (argIndex === index) {
          prevLineIndex = range.end.line;
          prevPosition = document.positionAt(start);
        }

        if (newArgIndex === index) {
          newLineIndex = range.end.line;
          newPosition = document.positionAt(start);
        }

        editBuilder.replace(range, value);
      });
    })
    .then(() => {
      if (
        newArgIndex >= 0 &&
        newArgIndex < args.length &&
        prevPosition &&
        newPosition
      ) {
        const onSameLine = prevLineIndex === newLineIndex;

        if (direction === 'right' && onSameLine) {
          const text = document.getText();
          const prevOffset = document.offsetAt(prevPosition);
          const newOffset = findNewCursorPositionToRight(text, prevOffset);
          newPosition = document.positionAt(newOffset);
        }

        editor.selection = new Selection(newPosition, newPosition);
      }
    });
};
