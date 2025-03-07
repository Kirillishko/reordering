import { Range, window } from 'vscode';

type Arg = { value: string; start: number; end: number };

export const findNearestBlock = (
  text: string,
  cursor: number,
  open: string,
  close: string
): {
  content: string;
  start: number;
  end: number;
} | null => {
  let start = cursor;
  let end = cursor;
  let depth = 0;

  while (start >= 0) {
    const char = text[start];

    if (char === close && depth === 0) {
      break;
    }

    if (char === open && depth === 0) {
      start++;
      break;
    }

    if (char === close) {
      depth--;
    }

    if (char === open) {
      depth++;
    }

    start--;
  }

  while (end < text.length) {
    const char = text[end];

    if (char === open && depth === 0) {
      break;
    }

    if (char === close && depth === 0) {
      break;
    }

    if (char === close) {
      depth--;
    }

    if (char === open) {
      depth++;
    }

    end++;
  }

  if (start === -1 || end === -1 || start >= end) {
    return null;
  }

  const content = text.substring(start, end);
  return { content, start, end };
};

export const splitArgumentsWithSeparators = (
  text: string,
  blockStart: number
): {
  args: Arg[];
} => {
  let args: Arg[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;
  let quoteChar = '';
  let separator = '';
  let argStart = -1;

  for (let i = 0; i < text.length; i++) {
    let char = text[i];

    if (argStart === -1 && char.match(/[a-zA-Z0-9'"`]/)) {
      argStart = blockStart + i;
    }

    if ((char === ',' || char === ';') && depth === 0 && !inQuotes) {
      args.push({
        value: current.trim(),
        start: argStart,
        end: blockStart + i
      });
      current = '';
      separator = '';
      argStart = -1;
      continue;
    }

    if (char === '\n' && depth === 0 && !inQuotes) {
      separator += char;
      continue;
    }

    if (
      (char === '"' || char === "'" || char === '`') &&
      (i === 0 || text[i - 1] !== '\\')
    ) {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
      }
    }

    if ((char === '{' || char === '(') && !inQuotes) {
      depth++;
    }

    if ((char === '}' || char === ')') && !inQuotes) {
      depth--;
    }

    if (argStart !== -1) {
      current += char;
    }
  }

  const remainder = current.trim();

  if (remainder) {
    args.push({
      value: remainder,
      start: argStart,
      end: argStart + remainder.length
    });
  }

  return { args };
};

export const findCurrentArgument = (args: Arg[], cursor: number): number => {
  let result = -1;

  for (let i = 0; i < args.length; i++) {
    let { start, end } = args[i];

    if (cursor >= start && cursor <= end) {
      result = i;
      break;
    }
  }

  return result;
};

export const extractArguments = (): {
  args: Arg[];
  argIndex: number;
} => {
  const editor = window.activeTextEditor;
  if (!editor) {
    return {
      args: [],
      argIndex: -1
    };
  }

  const document = editor.document;
  const selection = editor.selection;
  const position = selection.active;
  const text = document.getText();
  const offset = document.offsetAt(position);

  const matchObject = findNearestBlock(text, offset, '{', '}');
  const matchArgs = findNearestBlock(text, offset, '(', ')');

  const block =
    matchObject && matchArgs
      ? matchObject.content.length > matchArgs.content.length
        ? matchArgs
        : matchObject
      : matchObject || matchArgs;

  if (!block) {
    window.showInformationMessage('Не найдено подходящего блока {} или ()');

    return {
      args: [],
      argIndex: -1
    };
  }

  const { content, start } = block;
  const { args } = splitArgumentsWithSeparators(content, start);
  const argIndex = findCurrentArgument(args, offset);

  return { args, argIndex };
};

export const swapArguments = (
  arr: Arg[],
  argIndex: number,
  direction: 'left' | 'right'
) => {
  if (argIndex < 0 || argIndex >= arr.length) {
    return [];
  }

  const newArr = [...arr];

  if (direction === 'left') {
    if (argIndex <= 0) {
      return [];
    }

    newArr[argIndex] = {
      ...newArr[argIndex],
      value: newArr[argIndex - 1].value
    };
    newArr[argIndex - 1] = {
      ...newArr[argIndex - 1],
      value: arr[argIndex].value
    };
  } else if (direction === 'right') {
    if (argIndex >= arr.length - 1) {
      return [];
    }

    newArr[argIndex] = {
      ...newArr[argIndex],
      value: newArr[argIndex + 1].value
    };
    newArr[argIndex + 1] = {
      ...newArr[argIndex + 1],
      value: arr[argIndex].value
    };
  }

  return newArr;
};

export const replaceArguments = (args: Arg[]) => {
  const editor = window.activeTextEditor;

  if (!editor) {
    return;
  }

  const document = editor.document;

  editor.edit((editBuilder) => {
    for (let i = 0; i < args.length; i++) {
      let { value, start, end } = args[i];

      const range = new Range(
        document.positionAt(start),
        document.positionAt(end)
      );

      editBuilder.replace(range, value);
    }
  });
};
