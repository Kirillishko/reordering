import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual([1, 2, 3].indexOf(5), -1);
    assert.strictEqual(-1, [2, 3, 1].indexOf(0));
  });
});

// const a = (
//   first: string,
//   second: 'qwe,qwe, qwe zxc ' | 'qw qwe q adzx,qwe ;'
// ) => {
//   console.log(first + second);
// };

const a = (
  first: string,
  second: string,
  third: string = '',
  fourth: string = ''
) => {
  console.log(fourth, first + second + third);
};

let a1 = a('Hello', 'world');
let a2 = a('1', '4', '2', '3');

let b = ({ first, second }: { second: string; first: string }) => {
  console.log(first + second);
};

let b1 = b({ second: 'world', first: 'Hello ' });

let c = ({
  first,
  sixth,
  fourth = 'defau123l456t fourth',
  fifth,
  third,
  second = 'defau123l456t second'
}: {
  first?: string;
  fourth?: string;
  fifth?: string;
  third?: string;
  sixth?: string;
  second?: string;
}) => {
  console.log(first + second, 'asd');
};

let c1 = c({
  second: 'world',
  fourth: '222',
  third: '111',
  fifth: '333',
  first: 'Hello world',
  sixth: '444'
});

let c2 = c({
  fourth: '222',
  fifth: '333',
  sixth: '444'
});
