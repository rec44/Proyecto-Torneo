import { Bracket } from "react-tournament-bracket";
import type { Game } from "react-tournament-bracket/lib/components/model";
import { Side } from "react-tournament-bracket/lib/components/model";

interface Team {
  id: string;
  name: string;
}

interface Props {
  teams: Team[];
}

const now = Date.now();

const nextPowerOfTwo = (n: number) => (n < 2 ? 2 : 1 << Math.ceil(Math.log2(n)));

const baseGame = (home: Team | null, visitor: Team | null, idx: number): Game => ({
  id: `game-r1-${idx + 1}`,
  name: `Ronda 1 · Juego ${idx + 1}`,
  scheduled: now,
  sides: {
    [Side.HOME]: home
      ? {
          team: { id: home.id, name: home.name },
          score: { score: 0 },
        }
      : {},
    [Side.VISITOR]: visitor
      ? {
          team: { id: visitor.id, name: visitor.name },
          score: { score: 0 },
        }
      : {},
  },
});

const fromPrevious = (homeSource: Game | undefined, visitorSource: Game | undefined, round: number, idx: number): Game => ({
  id: `game-r${round}-${idx + 1}`,
  name: `Ronda ${round} · Juego ${idx + 1}`,
  scheduled: now + round * 1000,
  sides: {
    [Side.HOME]: homeSource
      ? {
          seed: {
            displayName: homeSource.name,
            rank: 1,
            sourceGame: homeSource,
            sourcePool: {},
          },
          score: { score: 0 },
        }
      : {},
    [Side.VISITOR]: visitorSource
      ? {
          seed: {
            displayName: visitorSource.name,
            rank: 1,
            sourceGame: visitorSource,
            sourcePool: {},
          },
          score: { score: 0 },
        }
      : {},
  },
});

const buildBracket = (teams: Team[]): Game | null => {
  if (!teams.length) return null;

  const slots = nextPowerOfTwo(teams.length);
  const padded = Array.from({ length: slots }, (_, i) => teams[i] ?? null);

  let currentRound: Game[] = [];
  for (let i = 0; i < padded.length; i += 2) {
    currentRound.push(baseGame(padded[i], padded[i + 1], i / 2));
  }

  let round = 2;
  while (currentRound.length > 1) {
    const nextRound: Game[] = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      nextRound.push(fromPrevious(currentRound[i], currentRound[i + 1], round, i / 2));
    }
    currentRound = nextRound;
    round += 1;
  }

  return currentRound[0];
};

export default function BracketsRender({ teams }: Props) {
  const finalGame = buildBracket(teams);

  if (!finalGame) {
    return (
      <div className="bg-white rounded shadow p-4 text-center text-gray-500">
        No hay suficientes equipos para generar el bracket.
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-4 overflow-x-auto">
        Braket
      <Bracket
        game={finalGame}
        svgPadding={20}
        homeOnTop
        gameDimensions={{ width: 200, height: 90 }}
      />
    </div>
  );
}