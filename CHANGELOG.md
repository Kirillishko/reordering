# Change Log

All notable changes to the "reordering" extension will be documented in this file.

## 1.1.0

**Release Date:** March 10, 2025

### Changed

- **Optimized Argument Detection**: Improved the performance of the argument detection algorithm for faster and more efficient operation.

### Fixed

- **Fixed Infinite Loops in Rare Cases**: Resolved issues causing infinite loops in specific edge cases when reordering arguments.
- **Minor Bug Fixes**: Addressed a few small bugs related to UI rendering an

## 1.0.0

**Release Date:** March 7, 2025

### Added

- **Reorder Arguments to the Left**: Functionality to move selected arguments one position to the left within function calls or code blocks.

  - _Windows/Linux_: `Ctrl+Shift+Alt+Left`
  - _macOS_: `Ctrl+Shift+Cmd+Left`

- **Reorder Arguments to the Right**: Functionality to move selected arguments one position to the right within function calls or code blocks.

  - _Windows/Linux_: `Ctrl+Shift+Alt+Right`
  - _macOS_: `Ctrl+Shift+Cmd+Right`

- **Context-sensitive Argument Detection**: Automatically detects arguments inside function calls or blocks and ensures the correct argument is selected for modification.

- **Support for Multiple Languages**: Works with any language that uses parentheses `()` or curly braces `{}` for argument lists or parameter blocks.

- **Efficient Argument Swapping**: Allows precise control over the reordering of arguments, reducing the need for manual edits.

- **Supported Blocks**:

  - Function Calls: Reordering parameters inside function calls (arguments inside parentheses).
  - Code Blocks: Reordering elements within blocks that use curly braces `{}`, such as objects and arrays.

- **Seamless Document Update**: The document is updated in place when arguments are reordered, ensuring that the new order is applied correctly without manual edits.
