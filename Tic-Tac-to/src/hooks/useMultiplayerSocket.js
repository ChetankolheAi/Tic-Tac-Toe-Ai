import { useEffect } from "react";

export function useMultiplayerSocket({
    socket,
    roomId,
    player,
    setPlayer,
    setGameStarted,
    setBoard,
    setGameScores,
    setisDraw,
    setWinningset,
    setisXturn,
    setisXChance,
    spawnEmojiS,
    sounds
}) {
    useEffect(() => {
        socket.on("player_role", (role) => setPlayer(role));

        socket.on("start_game", ({ scores, starter }) => {
            setGameScores(scores);
            setGameStarted(true);
            const initialTurn = starter || "X";
            setisXturn(initialTurn === "X");
            setisXChance(initialTurn === "X");
        });

        socket.on("receive_move", ({ index, player: movePlayer, scores, winner, pattern, draw }) => {
            setBoard(prev => {
                const newBoard = [...prev];
                newBoard[index] = movePlayer;
                return newBoard;
            });

            if (sounds.click.current) {
                sounds.click.current.currentTime = 0;
                sounds.click.current.play().catch(() => {});
            }

            setGameScores(scores);

            if (winner) {
                setWinningset([...pattern]);
                const sound = winner === player ? sounds.win.current : sounds.loose.current;
                if (sound) {
                    sound.currentTime = 0;
                    sound.play().catch(() => {});
                }
            } else if (draw) {
                setisDraw(true);
                if (sounds.draw.current) {
                    sounds.draw.current.currentTime = 0;
                    sounds.draw.current.play().catch(() => {});
                }
            }

            setisXturn(movePlayer !== "X");
        });

        socket.on("room_full", () => alert("Room is full!"));

        socket.on("restart_game", ({ nextStarter }) => {
            setBoard(Array(9).fill(null));
            setisXturn(nextStarter === "X");
            setisXChance(nextStarter === "X");
            setisDraw(false);
            setWinningset([]);
        });

        socket.on("opponent_left", () => {
            alert("Opponent left the game.");
            setGameStarted(false);
            setBoard(Array(9).fill(null));
            setWinningset([]);
            setisDraw(false);
            setisXturn(true);
            setisXChance(true);
        });

        const handleEmoji = (data) => spawnEmojiS(data.emoji);
        socket.on("receive_emoji", handleEmoji);

        return () => {
            socket.off("player_role");
            socket.off("start_game");
            socket.off("receive_move");
            socket.off("room_full");
            socket.off("restart_game");
            socket.off("opponent_left");
            socket.off("receive_emoji");
        };
    }, [player, roomId, socket, spawnEmojiS, setBoard, setGameScores, setGameStarted, setPlayer, setWinningset, setisDraw, setisXChance, setisXturn, sounds]);
}