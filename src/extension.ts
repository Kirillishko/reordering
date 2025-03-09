import { commands, ExtensionContext } from 'vscode';
import {
  Direction,
  extractArguments,
  replaceArguments,
  swapArguments
} from './lib/helpers';

export const activate = (context: ExtensionContext) => {
  const reorder = (direction: Direction) => {
    const { args, argIndex } = extractArguments();

    if (argIndex === -1) {
      return;
    }

    const swappedArgs = swapArguments([...args], argIndex, direction);
    replaceArguments(swappedArgs, argIndex, direction);
  };

  context.subscriptions.push(
    commands.registerCommand('reordering.reorderToLeft', () => reorder('left'))
  );
  context.subscriptions.push(
    commands.registerCommand('reordering.reorderToRight', () =>
      reorder('right')
    )
  );
};
