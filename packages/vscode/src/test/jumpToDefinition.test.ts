import vscode from 'vscode'
import assert from 'assert'
import { getDocUri, activate, toRange } from './helper'

async function testJumpToDefinition(
  fixturePathSqlite: vscode.Uri,
  position: vscode.Position,
  expectedLocation: vscode.Location,
): Promise<void> {
  const actualLocation: vscode.Location[] =
    (await vscode.commands.executeCommand(
      'vscode.executeDefinitionProvider',
      fixturePathSqlite,
      position,
    )) as vscode.Location[]

  assert.ok(actualLocation.length === 1)
  assert.deepStrictEqual(actualLocation[0].range, expectedLocation.range)
}

suite('Jump-to-definition', () => {
  const fixturePathSqlite = getDocUri('correct_sqlite.prisma')
  const fixturePathMongodb = getDocUri('correct_mongodb.prisma')

  test('SQLite: from attribute to model', async function () {
    await activate(fixturePathSqlite)

    await testJumpToDefinition(
      fixturePathSqlite,
      new vscode.Position(11, 16),
      new vscode.Location(fixturePathSqlite, toRange(26, 0, 31, 1)),
    )
    await testJumpToDefinition(
      fixturePathSqlite,
      new vscode.Position(14, 14),
      new vscode.Location(fixturePathSqlite, toRange(18, 0, 24, 1)),
    )
    await testJumpToDefinition(
      fixturePathSqlite,
      new vscode.Position(22, 9),
      new vscode.Location(fixturePathSqlite, toRange(9, 0, 16, 1)),
    )
  })

  test('MongoDB: from attribute to type', async function () {
    await activate(fixturePathMongodb)

    await testJumpToDefinition(
      fixturePathMongodb,
      new vscode.Position(13, 11),
      new vscode.Location(fixturePathMongodb, toRange(16, 0, 20, 1)),
    )
  })
})
