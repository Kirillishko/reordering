import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});

const a = (first: string, second: string) => {
  console.log(first + second);
};

let a1 = a('Hello', 'world');

let b = ({ first, second }: { first: string; second: string }) => {
  console.log(first + second);
};

let b1 = b({ first: 'Hello', second: 'world' });

let c = ({
  first,
  second = 'default second',
  third,
  fourth = 'default fourth',
  fifth,
  sixth
}: {
  first: string;
  second: string;
  third: string;
  fifth: string;
  fourth: string;
  sixth: string;
}) => {
  console.log(first + second, 'asd');
};

let c1 = c({
  first: 'Hello world',
  second: 'world',
  third: '111',
  fourth: '222',
  fifth: '333',
  sixth: '444'
});
