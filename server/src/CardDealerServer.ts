import {PubSub} from 'graphql-subscriptions';

const pubSub = new PubSub();
const CARD_DRAWN = 'CARD_DRAWN';

export const typeDefs = `#graphql
    type Card {
      rank: String!
      suit: String!
    }
    
    type Query {
      getGameState: GameState!
    }
    
    type Mutation {
      drawCard(player: String!): GameState!
      resetGame: GameState!
    }
    
    type Subscription {
      onCardDrawn: GameState!
    }
    
    type GameState {
      currentPlayer: String!
      deck: [Card!]!
      drawnCards: [Card!]!
      gameState: String!
    }
`;

// noinspection JSUnusedGlobalSymbols
export const resolvers = {
    Query: {
        getGameState: () => gameState,
    },
    Mutation: {
        drawCard: (_: any, {player}: { player: string }) => {
            if (gameState.currentPlayer !== player || gameState.gameState !== 'active') {
                throw new Error('It is not your turn or the game is not active.');
            }

            // Check if the game is active
            if (gameState.gameState !== 'active') {
                throw new Error('Game is not active.');
            }

            // Check if the deck is empty
            if (gameState.deck.length === 0) {
                gameState.gameState = 'draw';
                return gameState;
            }

            // Draw a card from the deck
            const drawnCard = gameState.deck.pop();
            if (!drawnCard) {
                throw new Error('Failed to draw a card.');
            }

            // Add the drawn card to the drawnCards array
            gameState.drawnCards.push(drawnCard);

            // Check if the player wins
            const len = gameState.drawnCards.length;
            if (len >= 2 && gameState.drawnCards[len - 1].rank === gameState.drawnCards[len - 2].rank) {
                gameState.gameState = 'won';
                return gameState;
            }

            // Update the current player
            gameState.currentPlayer = gameState.currentPlayer === 'PlayerA' ? 'PlayerB' : 'PlayerA';

            // Publish the updated game state
            void pubSub.publish(CARD_DRAWN, {onCardDrawn: gameState});

            return gameState;
        },
        resetGame: () => {
            resetGameState();
            return gameState;
        },
    },
    Subscription: {
        onCardDrawn: {
            subscribe: () => pubSub.asyncIterator([CARD_DRAWN]),
        },
    },
};

type Card = { rank: string; suit: string };

export let gameState = {
    currentPlayer: 'PlayerA' as 'PlayerA' | 'PlayerB',
    deck: shuffleDeck(),
    drawnCards: [] as Card[],
    gameState: 'active' as 'active' | 'draw' | 'won'
};

export function resetGameState(): void {
    gameState.currentPlayer = 'PlayerA';
    gameState.deck = shuffleDeck();
    gameState.drawnCards = [];
    gameState.gameState = 'active';
}

function shuffleDeck(): Card[] {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const deck: Card[] = [];

    suits.forEach((suit) => {
        ranks.forEach((rank) => {
            deck.push({suit, rank});
        });
    });

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}
