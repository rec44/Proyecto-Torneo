/**
 * BracketResultsManager
 * 
 * Este componente gestiona y muestra el cuadro de eliminatorias (bracket) de un torneo.
 * Permite visualizar los partidos, editar resultados (si eres admin o dueño), y actualiza los resultados en tiempo real.
 * 
 * - Recibe los equipos, los partidos, y funciones para crear/actualizar partidos.
 * - Construye las rondas del torneo según los resultados.
 * - Permite editar el marcador de cada partido mediante un modal.
 * - Actualiza el estado local y remoto de los resultados.
 * - Solo muestra el modal de edición si el usuario tiene permisos.
 * 
 * Uso típico: se utiliza en la página de brackets de un torneo.
 */

import { useEffect, useState } from "react";
import Bracket from "react-tournament-bracket/lib/components/Bracket";
import BracketGame from "react-tournament-bracket/lib/components/BracketGame";
import type { Game } from "react-tournament-bracket/lib/components/model";
import { Side } from "react-tournament-bracket/lib/components/model";
import { useAuth } from "../../hooks/useAuth";
import type { Match } from "../../types/match";

interface Team {
  id: string;
  name: string;
}

interface Props {
  teams: Team[];
  tournamentOwnerId: string | number;
  tournamentId: string;
  matches: Match[];
  createMatch: (match: Omit<Match, "id">) => Promise<Match>;
  updateMatch: (id: string, match: Partial<Match>) => Promise<Match>;
  matchesLoading?: boolean;
  matchesError?: string | null;
}

const now = Date.now();

const nextPowerOfTwo = (n: number) => (n < 2 ? 2 : 1 << Math.ceil(Math.log2(n)));

function getWinner(game: Game): Team | null {
  const homeScore = game.sides[Side.HOME]?.score?.score ?? 0;
  const visitorScore = game.sides[Side.VISITOR]?.score?.score ?? 0;
  const homeTeam = game.sides[Side.HOME]?.team;
  const visitorTeam = game.sides[Side.VISITOR]?.team;
  if (!homeTeam && visitorTeam) return visitorTeam;
  if (!visitorTeam && homeTeam) return homeTeam;
  if (!homeTeam && !visitorTeam) return null;
  if (homeScore > visitorScore) return homeTeam!;
  if (visitorScore > homeScore) return visitorTeam!;
  return null;
}

// Construye todas las rondas con resultados
function buildRounds(
  teams: Team[],
  scores: Record<string, { home: number; visitor: number }>
): { rounds: Game[][]; roundTitles: string[] } {
  const slots = nextPowerOfTwo(teams.length);
  const padded = Array.from({ length: slots }, (_, i) => teams[i] ?? null);

  const rounds: Game[][] = [];
  let currentRound: Game[] = [];
  for (let i = 0; i < padded.length; i += 2) {
    const gameId = `game-r1-${i / 2 + 1}`;
    currentRound.push({
      id: gameId,
      name: `Ronda 1 · Juego ${i / 2 + 1}`,
      scheduled: now,
      sides: {
        [Side.HOME]: padded[i]
          ? {
              team: { id: padded[i]!.id, name: padded[i]!.name },
              score: { score: scores[gameId]?.home ?? 0 },
            }
          : {},
        [Side.VISITOR]: padded[i + 1]
          ? {
              team: { id: padded[i + 1]!.id, name: padded[i + 1]!.name },
              score: { score: scores[gameId]?.visitor ?? 0 },
            }
          : {},
      },
    });
  }
  rounds.push(currentRound);

  let round = 2;
  while (currentRound.length > 1) {
    const nextRound: Game[] = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      const homeSource = currentRound[i];
      const visitorSource = currentRound[i + 1];
      const gameId = `game-r${round}-${i / 2 + 1}`;
      nextRound.push({
        id: gameId,
        name: `Ronda ${round} · Juego ${i / 2 + 1}`,
        scheduled: now + round * 1000,
        sides: {
          [Side.HOME]: homeSource
            ? {
                team: getWinner(homeSource)
                  ? { id: getWinner(homeSource)!.id, name: getWinner(homeSource)!.name }
                  : undefined,
                score: { score: scores[gameId]?.home ?? 0 },
                seed: {
                  displayName: homeSource.name,
                  rank: 1,
                  sourceGame: homeSource,
                  sourcePool: {},
                },
              }
            : {},
          [Side.VISITOR]: visitorSource
            ? {
                team: getWinner(visitorSource)
                  ? { id: getWinner(visitorSource)!.id, name: getWinner(visitorSource)!.name }
                  : undefined,
                score: { score: scores[gameId]?.visitor ?? 0 },
                seed: {
                  displayName: visitorSource.name,
                  rank: 1,
                  sourceGame: visitorSource,
                  sourcePool: {},
                },
              }
            : {},
        },
      });
    }
    rounds.push(nextRound);
    currentRound = nextRound;
    round += 1;
  }

  // Genera los títulos de las rondas
  const roundTitles = rounds.map((r, idx) => {
    if (idx === rounds.length - 1) return "Final";
    if (idx === rounds.length - 2 && rounds.length > 2) return "Semifinal";  r;
    return `Ronda ${idx + 1}`;
  });

  return { rounds, roundTitles };
}

// Modal simple para editar resultado
function ResultModal({
  open,
  homeName,
  visitorName,
  homeScore,
  visitorScore,
  onClose,
  onSave,
}: {
  open: boolean;
  gameId: string;
  homeName: string;
  visitorName: string;
  homeScore: number;
  visitorScore: number;
  onClose: () => void;
  onSave: (home: number, visitor: number) => void;
}) {
  const [home, setHome] = useState(homeScore);
  const [visitor, setVisitor] = useState(visitorScore);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 min-w-75">
        <h3 className="font-bold mb-4">Editar resultado</h3>
        <div className="mb-4">
          <label className="block mb-2">{homeName}:</label>
          <input
            type="number"
            min={0}
            value={home}
            onChange={e => setHome(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">{visitorName}:</label>
          <input
            type="number"
            min={0}
            value={visitor}
            onChange={e => setVisitor(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              onSave(home, visitor);
              onClose();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

type Scores = Record<string, { home: number; visitor: number }>;

function CustomGameComponent(
  props: React.ComponentProps<typeof BracketGame> & { onGameSelect: (game: Game) => void }
) {
  const { game, onGameSelect, ...rest } = props;

  return (
    <g
      onClick={e => {
        e.stopPropagation();
        onGameSelect(game);
      }}
      style={{ cursor: "pointer" }}
    >
      <BracketGame game={game} {...rest} />
    </g>
  );
}

type ModalState = {
  open: boolean;
  gameId: string;
  homeName: string;
  visitorName: string;
  homeScore: number;
  visitorScore: number;
  homeId: string;
  visitorId: string;
  round: number;
};

export default function BracketResultsManager({
  teams,
  tournamentOwnerId,
  tournamentId,
  matches,
  createMatch,
  updateMatch,
  matchesLoading,
  matchesError,
}: Props) {
  // Hook de usuario para permisos
  const { user } = useAuth();

  // Estado local de resultados y modal
  const [scores, setScores] = useState<Scores>({});
  const [modal, setModal] = useState<ModalState | null>(null);

  // Al cargar los partidos, restaura los resultados en el bracket
  useEffect(() => {
    const restored: Scores = {};
    matches.forEach(match => {
      restored[match.gameId] = {
        home: match.homeScore,
        visitor: match.visitorScore,
      };
    });
    setScores(restored);
  }, [matches]);

  // Construye las rondas del bracket
  const { rounds } = buildRounds(teams, scores);
  const finalGame = rounds.length ? rounds.at(-1)![0] : null;

  // Permisos para editar resultados
  const canEdit =
    user && (user.role === "admin" || user.id === tournamentOwnerId);

  // Abre el modal para editar el resultado de un partido
  const openModal = (game: Game) => {
    if (!canEdit) return;
    const home = game.sides[Side.HOME]?.team;
    const visitor = game.sides[Side.VISITOR]?.team;
    if (!home || !visitor) return;

    const roundMatch = Number(game.id.split("-")[1]?.replace("r", "") ?? 1);

    setModal({
      open: true,
      gameId: game.id,
      homeName: home.name,
      visitorName: visitor.name,
      homeScore: game.sides[Side.HOME]?.score?.score ?? 0,
      visitorScore: game.sides[Side.VISITOR]?.score?.score ?? 0,
      homeId: String(home.id),
      visitorId: String(visitor.id),
      round: roundMatch,
    });
  };

  // Crea o actualiza el resultado de un partido
  const upsertMatch = async ({
    gameId,
    homeId,
    visitorId,
    round,
    homeScore,
    visitorScore,
  }: {
    gameId: string;
    homeId: string;
    visitorId: string;
    round: number;
    homeScore: number;
    visitorScore: number;
  }) => {
    const existing = matches.find(
      m =>
        (m.homeTeamId === homeId && m.visitorTeamId === visitorId) ||
        (m.homeTeamId === visitorId && m.visitorTeamId === homeId)
    );

    const matchPayload: Omit<Match, "id"> = {
      tournamentId,
      gameId,
      round,
      date: new Date().toISOString(),
      homeTeamId: homeId,
      visitorTeamId: visitorId,
      homeScore,
      visitorScore,
    };

    if (existing) {
      await updateMatch(existing.id, matchPayload);
    } else {
      await createMatch(matchPayload);
    }
  };

  // Render principal
  if (matchesLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow text-center text-gray-500">
        Cargando resultados…
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      {matchesError && (
        <p className="mb-3 text-sm text-red-500">{matchesError}</p>
      )}

      {/* Muestra el bracket si hay suficientes equipos */}
      {finalGame ? (
        <Bracket
          game={finalGame}
          svgPadding={20}
          homeOnTop
          gameDimensions={{ width: 210, height: 100 }}
          GameComponent={componentProps => (
            <CustomGameComponent
              {...componentProps}
              onGameSelect={openModal}
            />
          )}
        />
      ) : (
        <div className="text-center text-gray-500">
          No hay suficientes equipos para generar el bracket.
        </div>
      )}

      {/* Modal para editar resultados */}
      {modal && (
        <ResultModal
          open={modal.open}
          gameId={modal.gameId}
          homeName={modal.homeName}
          visitorName={modal.visitorName}
          homeScore={modal.homeScore}
          visitorScore={modal.visitorScore}
          onClose={() => setModal(null)}
          onSave={async (home, visitor) => {
            setScores(prev => ({
              ...prev,
              [modal.gameId]: { home, visitor },
            }));
            await upsertMatch({
              gameId: modal.gameId,
              homeId: modal.homeId,
              visitorId: modal.visitorId,
              round: modal.round,
              homeScore: home,
              visitorScore: visitor,
            });
            setModal(null);
          }}
        />
      )}
    </div>
  );
}