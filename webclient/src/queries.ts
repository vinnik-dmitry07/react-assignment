import { gql } from '@apollo/client';

export const GET_GAME_STATE = gql`
  query GetGameState {
    getGameState {
      currentPlayer
      deck {
        suit
        rank
      }
      drawnCards {
        suit
        rank
      }
      gameState
    }
  }
`;

export const DRAW_CARD = gql`
  mutation DrawCard($player: String!) {
    drawCard(player: $player) {
      currentPlayer
      deck {
        suit
        rank
      }
      drawnCards {
        suit
        rank
      }
      gameState
    }
  }
`;

export const ON_CARD_DRAWN = gql`
  subscription OnCardDrawn {
    onCardDrawn {
      currentPlayer
      deck {
        suit
        rank
      }
      drawnCards {
        suit
        rank
      }
      gameState
    }
  }
`;

export const RESET_GAME = gql`
  mutation ResetGame {
    resetGame {
      currentPlayer
      deck {
        suit
        rank
      }
      drawnCards {
        rank
        suit
      }
      gameState
    }
  }
`;

