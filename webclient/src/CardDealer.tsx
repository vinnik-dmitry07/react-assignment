import './App.css';
import React, {useEffect, useRef} from 'react';
import {useMutation, useQuery, useSubscription} from '@apollo/client';
import {DRAW_CARD, GET_GAME_STATE, ON_CARD_DRAWN, RESET_GAME} from './queries';

const CardDealer: React.FC = () => {
    const {data, loading, error, refetch} = useQuery(GET_GAME_STATE);
    const [drawCard] = useMutation(DRAW_CARD);
    const { data: subscriptionData, error: subscriptionError} = useSubscription(ON_CARD_DRAWN);
    const [player, setPlayer] = React.useState<'PlayerA' | 'PlayerB' | null>(null);
    const [resetGame] = useMutation(RESET_GAME);
    const drawnCardsRef = useRef(null);

    useEffect(() => {
        if (subscriptionData) {
            console.log('New Data Received', subscriptionData.onCardDrawn);
            void refetch();
        }
    }, [subscriptionData, refetch]);

    useEffect(() => {
        if (drawnCardsRef.current) {
            const element = drawnCardsRef.current;
            element.scrollTop = element.scrollHeight;
        }
    }, [data]);

    useEffect(() => {
        if (subscriptionError) {
            console.error('Subscription error:', subscriptionError);
        }
    }, [subscriptionError]);

    const handleDrawCard = async () => {
        await drawCard({ variables: { player } });
        await refetch();
    };

    const handleResetGame = async () => {
        await resetGame();
        await refetch();
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (!player) {
        return (
            <div>
                <button onClick={() => setPlayer('PlayerA')}>Play as Player A</button>
                <button onClick={() => setPlayer('PlayerB')}>Play as Player B</button>
            </div>
        );
    }

    const {currentPlayer, deck, drawnCards, gameState} = data.getGameState;
    return (
        <div className="App">
            <h1>Card Game</h1>
            {(gameState === 'active') && (
                <button onClick={handleDrawCard} disabled={currentPlayer !== player}>
                    Draw Card
                </button>
            )}
            {(gameState === 'won' || gameState === 'draw') && (
                <button onClick={handleResetGame}>Reset Game</button>
            )}
            <div>
                <h2>You are: {player}</h2>
                <h2>Game State: {gameState}</h2>
                <h2>Current Player: {currentPlayer}</h2>
                <h2>Deck Remaining: {deck.length} cards</h2>
                <h2>Drawn Cards:</h2>
                <div className="drawn-cards-container" ref={drawnCardsRef}>
                    <ul>
                        {drawnCards.map((card, index) => (
                            <li key={index}>
                                {card.rank} of {card.suit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CardDealer;
