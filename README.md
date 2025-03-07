# Reordering Extension for VSCode

The Reordering extension for Visual Studio Code allows you to easily reorder function arguments and parameters.

## Features

- Reorder arguments to the left or right: Quickly move parameters within a function or block of code to the left or right, making it easier to adjust their position.
- Context-sensitive argument detection: Automatically detects the arguments inside function calls, blocks of code, and ensures the right argument is selected and modified.
- Support for multiple languages: Works with any language that uses parentheses () or curly braces {} for argument lists or parameter blocks.
- Efficient editing: The extension allows for precise control over parameter reordering, minimizing the need for manual edits.

## Commands

The extension offers two commands:

- _Reorder Arguments to the Left_: Moves the currently selected argument one position to the left.
  - **_Windows/Linux_**: `Ctrl+Shift+Alt+Left`
  - **_macOS_**: `Ctrl+Shift+Cmd+Left`
- _Reorder Arguments to the Right_: Moves the currently selected argument one position to the right.
  - **_Windows/Linux_**: `Ctrl+Shift+Alt+Right`
  - **_macOS_**: `Ctrl+Shift+Cmd+Right`

## How It Works

- Argument Extraction: The extension identifies the current argument based on the cursor position and extracts all arguments within the nearest function or block.
- Argument Swapping: Once the arguments are extracted, the extension determines the appropriate direction to move the argument (either left or right) based on the user’s command.
- Update the Document: The arguments are replaced with the new order, and the document is updated in place, making the code modifications seamless and error-free.

## Supported Blocks

- Function Calls: Supports reordering parameters within function calls (i.e., arguments inside parentheses ()).
- Code Blocks: Supports reordering elements within blocks that use curly braces {}, such as objects, arrays, and other structures.

## Example Use Case

Imagine you have the following function call in your code:

```js
foo(1, 2, 3, 4);
```

If you move the second argument to the left, the function call becomes:

```js
foo(2, 1, 3, 4);
```

If you move the third argument to the right, the function call becomes:

```js
foo(2, 1, 4, 3);
```

This allows you to easily adjust the order of parameters without having to manually cut and paste the arguments.

## Installation

- Open Visual Studio Code.
- Go to the Extensions view (Ctrl+Shift+X).
- Search for Reordering.
- Click Install.

Alternatively, you can install the extension by opening the command palette (Ctrl+Shift+P), typing ext install reordering, and pressing Enter.

## Development and Contribution

If you'd like to contribute to this extension or make improvements, feel free to fork the repository and submit pull requests. Contributions, bug reports, and suggestions are always welcome!

## License

This extension is open source and available under the MIT License. See the LICENSE file for more information.

---

By using this extension, you can significantly streamline your workflow when it comes to manipulating function parameters, improving the structure of your code with minimal effort.
