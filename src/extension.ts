import * as vscode from 'vscode';
import {
  extractArguments,
  replaceArguments,
  swapArguments
} from './lib/helpers';

export const activate = (context: vscode.ExtensionContext) => {
  const reorderToLeft = vscode.commands.registerCommand(
    'reordering.reorderToLeft',
    () => {
      const { args, argIndex } = extractArguments();
      const swappedArgs = swapArguments(args, argIndex, 'left');

      if (!swappedArgs.length) {
        return;
      }

      replaceArguments(swappedArgs);
    }
  );

  const reorderToRight = vscode.commands.registerCommand(
    'reordering.reorderToRight',
    () => {
      const { args, argIndex } = extractArguments();
      const swappedArgs = swapArguments(args, argIndex, 'right');

      if (!swappedArgs.length) {
        return;
      }

      replaceArguments(swappedArgs);
    }
  );

  context.subscriptions.push(reorderToLeft);
  context.subscriptions.push(reorderToRight);
};
