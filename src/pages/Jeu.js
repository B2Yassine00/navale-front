import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDragLayer, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/bateau_3.png"; // Import du logo
import battleshiphHorizontal from "../assets/images/bbattleshiph.webp"; // Import de l'image du porte-avions
import battleshipVertical from "../assets/images/bbattleshipv.webp"; // Import de l'image du porte-avions
import carrierHorizontal from "../assets/images/bcarrrierh.webp"; // Import de l'image du porte-avions
import carrierVertical from "../assets/images/bcarrrierv.webp"; // Import de l'image du porte-avions
import cruiserHorizontal from "../assets/images/bcruiserh.webp"; // Import de l'image du porte-avions
import cruiserVertical from "../assets/images/bcruiserv.webp"; // Import de l'image du porte-avions
import destroyerHorizontal from "../assets/images/bdestroyerh.webp"; // Import de l'image du porte-avions
import destroyerVertical from "../assets/images/bdestroyerv.webp"; // Import de l'image du porte-avions
import submarineHorizontal from "../assets/images/bsubmarineh.webp"; // Import de l'image du porte-avions
import submarineVertical from "../assets/images/bsubmarinev.webp"; // Import de l'image du porte-avions
import settings_icon from "../assets/images/settings_icon.png"; // Import de l'icône utilisateur
import user_co from "../assets/images/user_co.png"; // Import de l'icône utilisateur
import {
  endGameFunction,
  getAllShips,
  launchGameFunction,
  shootFunction,
} from "./Api";
import "../assets/css/Jeu.css";
import useAuth from "./useAuth";

let cellContents = new Map();

const getShipImage = (ship) => {
  if (ship.name === "CARRIER") {
    return ship.orientation === "horizontal"
      ? carrierHorizontal
      : carrierVertical;
  } else if (ship.name === "CRUISER") {
    return ship.orientation === "horizontal"
      ? cruiserHorizontal
      : cruiserVertical;
  } else if (ship.name === "BATTLESHIP") {
    return ship.orientation === "horizontal"
      ? battleshiphHorizontal
      : battleshipVertical;
  } else if (ship.name === "SUBMARINE") {
    return ship.orientation === "horizontal"
      ? submarineHorizontal
      : submarineVertical;
  } else if (ship.name === "DESTROYER") {
    return ship.orientation === "horizontal"
      ? destroyerHorizontal
      : destroyerVertical;
  } else if (ship.name === "WARSHIP") {
    return ship.orientation === "horizontal"
      ? destroyerHorizontal
      : destroyerVertical;
  }
  // Ajoutez des conditions pour les autres bateaux si vous avez leurs images
};

function combineColumnLetterAndRow(column, rowNumber, size, orientation) {
  if (
    column >= 1 &&
    column <= 10 &&
    rowNumber >= 1 &&
    rowNumber <= 10 &&
    size > 0
  ) {
    let occupiedCells = [];

    if (orientation === "horizontal") {
      for (let i = 0; i < size; i++) {
        const columnLetter = String.fromCharCode(64 + column + i); // Get the column letter for each step
        occupiedCells.push(columnLetter + rowNumber);
      }
    } else if (orientation === "vertical") {
      for (let i = 0; i < size; i++) {
        const columnLetter = String.fromCharCode(64 + column); // Column stays the same
        occupiedCells.push(columnLetter + (rowNumber + i)); // Increment the row number
      }
    } else {
      return "Invalid orientation"; // Handle invalid orientation
    }

    return occupiedCells; // Return a string with all occupied cells
  } else {
    return "Invalid input"; // Return error if column, row, or size is out of range
  }
}

const GRID_SIZE = 10;

function Jeu() {
  const [SHIPS, setShips] = useState([]);

  useEffect(() => {
    const fetchShips = async () => {
      try {
        const response = await getAllShips();
        setShips(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchShips();
  }, []);

  // Initialiser shipsToPlaceP1 et shipsToPlaceP2 après que SHIPS a été mis à jour
  const [shipsToPlaceP1, setShipsToPlaceP1] = useState([]);
  const [shipsToPlaceP2, setShipsToPlaceP2] = useState([]);

  useEffect(() => {
    if (SHIPS.length > 0) {
      // Initialiser les états seulement après avoir obtenu les données de SHIPS
      setShipsToPlaceP1(
        SHIPS.map((ship) => ({ ...ship, orientation: "horizontal" }))
      );
      setShipsToPlaceP2(
        SHIPS.map((ship) => ({ ...ship, orientation: "horizontal" }))
      );
    }
  }, [SHIPS]); // Dépendance sur SHIPS pour que cet effet se déclenche lorsque SHIPS change

  // États pour les bateaux placés
  const [placedShipsP1, setPlacedShipsP1] = useState([]);
  const [placedShipsP2, setPlacedShipsP2] = useState([]);

  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gamePhase, setGamePhase] = useState("placement"); // 'placement' ou 'battle'

  // Gestion du drop pour les deux joueurs
  const handleDrop = (player, item, rowIndex, colIndex) => {
    const ship = item.ship;

    // Récupère les états corrects en fonction du joueur
    const placedShips = player === 1 ? placedShipsP1 : placedShipsP2;
    const setPlacedShips = player === 1 ? setPlacedShipsP1 : setPlacedShipsP2;
    const shipsToPlace = player === 1 ? shipsToPlaceP1 : shipsToPlaceP2;
    const setShipsToPlace =
      player === 1 ? setShipsToPlaceP1 : setShipsToPlaceP2;

    // Crée une copie de placedShips sans le bateau en cours de déplacement
    const updatedPlacedShips = placedShips.filter((s) => s.name !== ship.name);

    // Vérifie si le bateau rentre dans le plateau
    if (isOutOfBounds(ship, rowIndex, colIndex)) {
      alert("Le bateau ne rentre pas ici.");
      return;
    }

    // Vérifie le chevauchement en utilisant updatedPlacedShips
    if (checkOverlap(updatedPlacedShips, ship, rowIndex, colIndex)) {
      alert("Le bateau chevauche un autre bateau.");
      return;
    }

    // Met à jour la liste des bateaux placés
    updatedPlacedShips.push({
      ...ship,
      row: rowIndex,
      col: colIndex,
      index: combineColumnLetterAndRow(
        colIndex + 1,
        rowIndex + 1,
        ship.size,
        ship.orientation
      ),
    });
    setPlacedShips(updatedPlacedShips);

    // cellContents = [...cellContents, ...combineColumnLetterAndRow(colIndex+1, rowIndex+1, ship.size, 'horizontal')];
    // [...updatedPlacedShips].forEach((ship) => {
    //   const occupiedCells = combineColumnLetterAndRow(colIndex+1, rowIndex+1, ship.size, ship.orientation);
    //   occupiedCells.forEach(cell => cellContents.set(cell, ship.id));
    // });
    const lastPlacedShip = updatedPlacedShips[updatedPlacedShips.length - 1];
    const occupiedCells = combineColumnLetterAndRow(
      colIndex + 1,
      rowIndex + 1,
      lastPlacedShip.size,
      lastPlacedShip.orientation
    );
    occupiedCells.forEach((cell) => cellContents.set(cell, lastPlacedShip.id));
    // Si le bateau venait de la sélection, on le retire de la liste des bateaux à placer
    if (item.from === "selection") {
      setShipsToPlace((prevShips) =>
        prevShips.filter((s) => s.name !== ship.name)
      );
    }
  };

  // Fonctions pour la rotation et la suppression des bateaux pour les deux joueurs
  const handleRotateShip = (player, shipName) => {
    const setShipsToPlace =
      player === 1 ? setShipsToPlaceP1 : setShipsToPlaceP2;
    setShipsToPlace((prevShips) =>
      prevShips.map((ship) =>
        ship.name === shipName
          ? {
              ...ship,
              orientation:
                ship.orientation === "horizontal" ? "vertical" : "horizontal",
            }
          : ship
      )
    );
  };

  const handleRemoveShip = (player, shipName) => {
    const setPlacedShips = player === 1 ? setPlacedShipsP1 : setPlacedShipsP2;
    const setShipsToPlace =
      player === 1 ? setShipsToPlaceP1 : setShipsToPlaceP2;

    setPlacedShips((prevShips) => prevShips.filter((s) => s.name !== shipName));

    // Ajouter le bateau à shipsToPlace s'il n'y est pas déjà
    setShipsToPlace((prevShips) => {
      if (!prevShips.some((s) => s.name === shipName)) {
        const shipData = SHIPS.find((s) => s.name === shipName);
        return [...prevShips, { ...shipData, orientation: "horizontal" }];
      }
      return prevShips;
    });
  };

  const isOutOfBounds = (ship, row, col) => {
    if (ship.orientation === "horizontal") {
      return col + ship.size > GRID_SIZE;
    } else {
      return row + ship.size > GRID_SIZE;
    }
  };

  const handleLaunchGame = async () => {
    console.log("launching the game");
    const data = {
      gameId: localStorage.getItem("gameId"),
      userId: localStorage.getItem("userId"),
      // cellContents : cellContents,
      cellContents: Object.fromEntries(cellContents),
      ships: SHIPS,
    };
    const response = await launchGameFunction(data);
    console.log(response.data);
    setGamePhase("battle");
    console.log(cellContents);
    cellContents.clear();
    console.log(cellContents);
    console.log("after launch cell content : " + cellContents);
  };

  const handleCellClick = (rowIndex, colIndex) => {
    console.log(`Cell clicked at row ${rowIndex}, column ${colIndex}`);
    // Add other actions here, like firing a shot or selecting a cell
  };

  const auth = useAuth();

  const [attackedCells1, setAttackedCells1] = useState([]);
  const [attackedCells2, setAttackedCells2] = useState([]);

  const handleShoot = async (rowIndex, colIndex) => {
    const colLetter = String.fromCharCode(65 + colIndex);
    const position = `${colLetter}${rowIndex + 1}`;
    const data = {
      gameId: localStorage.getItem("gameId"),
      userId: localStorage.getItem("userId"),
      targetPosition: position,
    };
    console.log(data);
    const response = await shootFunction(data);
    console.log(response.data.winner);
    if (response.data.winner != null) {
      declareWinner(response.data.winner, response.data.player);
    }
    if (response.data.botMove) {
      const resultBoard2 = response.data.playerMove.result; // Player 1 attack
      const resultBoard1 = response.data.botMove.result; // Bot attack
      //cells attacked in board 2
      setAttackedCells2((prevAttacks) => [
        ...prevAttacks,
        { row: rowIndex, col: colIndex, result: resultBoard2 },
      ]);
      const targetPosition = response.data.botMove.targetPosition;
      const colLetter = targetPosition[0]; // "F" in "F4"
      const rowNum = targetPosition.slice(1); // "4" in "F4"
      const colIndexBot = colLetter.charCodeAt(0) - 65;
      const rowIndexBot = parseInt(rowNum, 10) - 1;
      //cells attacked in board 1  by bot
      setAttackedCells1((prevAttacks) => [
        ...prevAttacks,
        { row: rowIndexBot, col: colIndexBot, result: resultBoard1 },
      ]);
    } else {
      // If it's not against a bot, only handle Player 1's move so we will look at the attacked cells in board2
      //cells attacked in board 2 by player 1
      const resultBoard2 = response.data.playerMove.result || "miss"; // Player 1 attack
      setAttackedCells2((prevAttacks) => [
        ...prevAttacks,
        { row: rowIndex, col: colIndex, result: resultBoard2 },
      ]);
    }
  };

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const gameId = localStorage.getItem("gameId");

  const handleResign = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir abandonner la partie ?")) {
      try {
        const response = await endGameFunction(gameId, userId);
        alert(response.data.message);
        //clean the storage
        navigate("/jouer");
      } catch (error) {
        console.error("Erreur lors de l'abandon:", error);
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Une erreur est survenue lors de l'abandon de la partie");
        }
      }
      localStorage.removeItem("gameId");
    }
  };

  const [winnerMessage, setWinnerMessage] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const declareWinner = (winner, player) => {
    console.log("we have a winner");
    console.log(winner.id);
    console.log(player.id);
    if (winner.id === player.id) {
      setWinnerMessage(`Tu as triomphé ! Félicitations, ${player.username} !`);
      setIsWinner(true);
    } else {
      setWinnerMessage(`Désolé, ${player.username}, tu as perdu cette fois !`);
    }
    setIsGameOver(true);
    localStorage.removeItem("gameId");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <header>
        <nav>
          <img src={logo} alt="Logo" className="logo" />
          <Link to="/">Accueil</Link>
          <Link to="/tutoriel">Tutoriel</Link>
          <Link to="/jouer" style={{ color: "#F9943B" }}>
            Jouer
          </Link>
          {!auth && <Link to="/connexion">Connexion</Link>}
          <Link to="/connexion/profile">
            <img src={user_co} alt="user_co" className="user-co" />
          </Link>
          <Link to="/connexion/setting">
            <img
              src={settings_icon}
              alt="Settings Icon"
              className="settings-icon"
            />
          </Link>
        </nav>
      </header>
      <div className="jeu">
        <CustomDragLayer />
        {/* <button
          onClick={handleResign}
          className="resign-button" // Ajoutez le style approprié
        >
          Abandonner la partie
        </button> */}

        {gamePhase === "placement" ? (
          <>
            <h1
              style={{
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                width: "50%",
                margin: "2px",
              }}
            >
              Placement des bateaux - Joueur {currentPlayer}
            </h1>
            <div className="players-container">
              {/* Afficher uniquement la grille du joueur courant */}
              <div className="player-area">
                <div className="ship-selection">
                  <h3>Bateaux à placer :</h3>
                  <div className="ships">
                    {(currentPlayer === 1
                      ? shipsToPlaceP1
                      : shipsToPlaceP2
                    ).map((ship) => (
                      <Ship
                        key={ship.name}
                        ship={ship}
                        from="selection"
                        onRotate={(shipName) =>
                          handleRotateShip(currentPlayer, shipName)
                        }
                        player={currentPlayer}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid-container">
                  <h3>Plateau du Joueur {currentPlayer}</h3>
                  <div className="grid">
                    {Array(GRID_SIZE)
                      .fill(null)
                      .map((_, rowIndex) => (
                        <div key={rowIndex} className="row">
                          {Array(GRID_SIZE)
                            .fill(null)
                            .map((_, colIndex) => (
                              <Cell
                                key={`${rowIndex}-${colIndex}`}
                                shipPart={getShipPartAt(
                                  currentPlayer === 1
                                    ? placedShipsP1
                                    : placedShipsP2,
                                  rowIndex,
                                  colIndex
                                )}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                onDrop={(item, row, col) =>
                                  handleDrop(currentPlayer, item, row, col)
                                }
                                onRemoveShip={(shipName) =>
                                  handleRemoveShip(currentPlayer, shipName)
                                }
                                placedShips={
                                  currentPlayer === 1
                                    ? placedShipsP1
                                    : placedShipsP2
                                }
                                player={currentPlayer}
                                showShip={true}
                                isCurrentPlayer={true}
                                gamePhase={gamePhase}
                              />
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                handleLaunchGame();
              }}
            >
              {currentPlayer === 1 ? "Ready" : "Commencer la bataille"}
            </button>
          </>
        ) : (
          // Phase de bataille
          <div>
            <h1
              style={{
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              }}
            >
              Phase de bataille
            </h1>
            <div className="players-container battle-grids">
              {/* Grille du Joueur 1 */}
              <div className="player-area-battle">
                <h3>Plateau du Joueur 1</h3>
                <div className="grid">
                  {Array(GRID_SIZE)
                    .fill(null)
                    .map((_, rowIndex) => (
                      <div key={rowIndex} className="row">
                        {Array(GRID_SIZE)
                          .fill(null)
                          .map((_, colIndex) => (
                            <Cell
                              key={`${rowIndex}-${colIndex}`}
                              shipPart={getShipPartAt(
                                placedShipsP1,
                                rowIndex,
                                colIndex
                              )}
                              rowIndex={rowIndex}
                              colIndex={colIndex}
                              placedShips={placedShipsP1}
                              player={1}
                              showShip={true}
                              isCurrentPlayer={false}
                              gamePhase={gamePhase}
                              isPlayerTwo={false}
                              alreadyClicked={true}
                              className={
                                attackedCells1.some(
                                  (cell) =>
                                    cell.row === rowIndex &&
                                    cell.col === colIndex
                                )
                                  ? attackedCells1.find(
                                      (cell) =>
                                        cell.row === rowIndex &&
                                        cell.col === colIndex
                                    ).result === "miss"
                                    ? "miss-cell"
                                    : "hit-cell"
                                  : ""
                              }
                              result={
                                attackedCells1.some(
                                  (cell) =>
                                    cell.row === rowIndex &&
                                    cell.col === colIndex
                                )
                                  ? attackedCells1.find(
                                      (cell) =>
                                        cell.row === rowIndex &&
                                        cell.col === colIndex
                                    ).result
                                  : ""
                              }
                            />
                          ))}
                      </div>
                    ))}
                </div>
              </div>

              {/* Grille du Joueur 2 */}
              <div className="player-area-battle">
                <h3>Plateau du Joueur 2</h3>
                <div className="grid">
                  {Array(GRID_SIZE)
                    .fill(null)
                    .map((_, rowIndex) => (
                      <div key={rowIndex} className="row">
                        {Array(GRID_SIZE)
                          .fill(null)
                          .map((_, colIndex) => (
                            <Cell
                              key={`${rowIndex}-${colIndex}`}
                              shipPart={getShipPartAt(
                                placedShipsP2,
                                rowIndex,
                                colIndex
                              )}
                              rowIndex={rowIndex}
                              colIndex={colIndex}
                              placedShips={placedShipsP2}
                              player={2}
                              showShip={true}
                              isCurrentPlayer={false}
                              gamePhase={gamePhase}
                              isPlayerTwo={true}
                              alreadyClicked={false}
                              className={
                                attackedCells2.some(
                                  (cell) =>
                                    cell.row === rowIndex &&
                                    cell.col === colIndex
                                )
                                  ? attackedCells2.find(
                                      (cell) =>
                                        cell.row === rowIndex &&
                                        cell.col === colIndex
                                    ).result === "miss"
                                    ? "miss-cell"
                                    : "hit-cell"
                                  : ""
                              }
                              result={
                                attackedCells2.some(
                                  (cell) =>
                                    cell.row === rowIndex &&
                                    cell.col === colIndex
                                )
                                  ? attackedCells2.find(
                                      (cell) =>
                                        cell.row === rowIndex &&
                                        cell.col === colIndex
                                    ).result
                                  : ""
                              }
                              onClick={() => handleShoot(rowIndex, colIndex)}
                            />
                          ))}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Winner message */}
        {isGameOver && (
          <div className="winner-overlay">
            <div
              className={`winner-message ${
                isWinner ? "win-message" : "lose-message"
              }`}
            >
              {winnerMessage}
              {/* Le bouton pour rejouer */}
              <Link to="/jouer" className="rejouer-button">
                Rejouer
              </Link>
            </div>
          </div>
        )}

        {/* <footer>
          <p>&copy; 2024 Mon Application - Tous droits réservés</p>
        </footer> */}
      </div>
    </DndProvider>
  );
}

export default Jeu;

// Fonctions utilitaires (inchangées)
function checkOverlap(placedShips, ship, row, col) {
  const shipPositions = getShipPositions({ ...ship, row, col });
  for (const position of shipPositions) {
    for (const placedShip of placedShips) {
      const placedShipPositions = getShipPositions(placedShip);
      if (
        placedShipPositions.some(
          (pos) => pos.row === position.row && pos.col === position.col
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

function getShipPositions(ship) {
  const positions = [];
  const { row, col, size, orientation } = ship;
  for (let i = 0; i < size; i++) {
    positions.push({
      row: orientation === "horizontal" ? row : row + i,
      col: orientation === "horizontal" ? col + i : col,
    });
  }
  return positions;
}

function getShipPartAt(placedShips, row, col) {
  for (const ship of placedShips) {
    const positions = getShipPositions(ship);
    for (let index = 0; index < positions.length; index++) {
      const pos = positions[index];
      if (pos.row === row && pos.col === col) {
        return { ship, index };
      }
    }
  }
  return null;
}

// Composant Ship (inchangé)
function Ship({ ship, from, onRotate, player }) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "SHIP",
    item: { ship, from, player },
    canDrag: true,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Désactiver l'aperçu par défaut
  preview(null);

  return (
    <div
      className="ship"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        userSelect: "none",
      }}
    >
      <div className="ship-info">
        {ship.name} ({ship.size})
        <button
          className="rotate-ship-button"
          onClick={(e) => {
            e.stopPropagation(); // Empêche le déclenchement du drag
            onRotate(ship.name);
          }}
        >
          🔄
        </button>
      </div>
    </div>
  );
}

// Composant Cell (modifié pour désactiver le drag-and-drop en phase de bataille)
function Cell({
  shipPart,
  rowIndex,
  colIndex,
  onDrop,
  onRemoveShip,
  placedShips,
  player,
  showShip,
  isCurrentPlayer,
  gamePhase,
  isPlayerTwo,
  onClick,
  result,
}) {
  const isPlacementPhase = gamePhase === "placement";

  const [{ isOver, canDrop, item }, drop] = useDrop({
    accept: "SHIP",
    drop: (item) =>
      onDrop && isPlacementPhase ? onDrop(item, rowIndex, colIndex) : null,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
    canDrop: (item) => {
      if (
        !isPlacementPhase ||
        !isCurrentPlayer ||
        !item ||
        item.player !== player
      )
        return false;
      const ship = item.ship;
      const updatedPlacedShips = placedShips.filter(
        (s) => s.name !== ship.name
      );

      if (isOutOfBounds(ship, rowIndex, colIndex)) {
        return false;
      }

      return !checkOverlap(updatedPlacedShips, ship, rowIndex, colIndex);
    },
  });

  // Si la cellule contient une partie de bateau, elle doit être draggée en phase de placement
  const [{ isDragging }, drag, preview] = useDrag({
    type: "SHIP",
    item: { ship: shipPart?.ship, from: "board", player },
    canDrag: isPlacementPhase && isCurrentPlayer && !!shipPart,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Désactiver l'aperçu par défaut
  if (shipPart) {
    preview(null);
  }

  // Calculer si la cellule fait partie de la prévisualisation
  let isPreview = false;
  if (isOver && item) {
    const ship = item.ship;
    const shipPositions = getShipPositions({
      ...ship,
      row: rowIndex,
      col: colIndex,
    });
    isPreview = shipPositions.some(
      (pos) => pos.row === rowIndex && pos.col === colIndex
    );
  }

  // Vérifier si le placement est valide pour changer la couleur de la prévisualisation
  let isValidPlacement = canDrop;

  // Calculer la position de l'image de fond pour chaque partie du bateau
  const backgroundPosition = shipPart
    ? shipPart.ship.orientation === "horizontal"
      ? `${-shipPart.index * 100}% 0`
      : `0 ${-shipPart.index * 100}%`
    : null;

  const backgroundSize = shipPart
    ? shipPart.ship.orientation === "horizontal"
      ? `${shipPart.ship.size * 100}% 100%`
      : `100% ${shipPart.ship.size * 100}%`
    : "cover";

  // Déterminer si on doit afficher le bateau
  const shouldShowShipPart = showShip && shipPart;

  const [alreadyClicked, setAlreadyClicked] = useState(false);

  // const onClickHandler = isPlayerTwo ? handleShoot : null;
  const onClickHandler = () => {
    if (isPlayerTwo && !alreadyClicked) {
      setAlreadyClicked(true); // Mark this cell as clicked
      onClick(rowIndex, colIndex);
    }
  };

  return (
    <div
      className={`cell ${shouldShowShipPart ? "ship-cell" : ""} ${
        isPreview
          ? isValidPlacement
            ? "preview-cell"
            : "invalid-preview-cell"
          : ""
      }`}
      ref={(node) => {
        if (isPlacementPhase) {
          drop(node);
          if (shouldShowShipPart) {
            drag(node);
          }
        }
      }}
      onClick={onClickHandler}
      style={{
        opacity: isDragging ? 0.5 : 1,
        position: "relative",
        backgroundImage: shouldShowShipPart
          ? `url(${getShipImage(shipPart.ship)})`
          : "none",
        backgroundPosition,
        backgroundSize,
      }}
    >
      {result === "hit" && <span className="hit-indicator">💥</span>}
      {result === "miss" && <span className="miss-indicator">❌</span>}

      {/* Supprimer le bouton de suppression en phase de bataille */}
      {shouldShowShipPart &&
        shipPart.index === 0 &&
        isCurrentPlayer &&
        isPlacementPhase && (
          <button
            className="remove-ship-button"
            onClick={(e) => {
              e.stopPropagation(); // Empêche le déclenchement du drag
              // removeShipFromCellContents(shipPart.ship.id);
              onRemoveShip(shipPart.ship.name);
            }}
          >
            ❌
          </button>
        )}
    </div>
  );
}

//TODO : test
// to remove the ship from cellcontents using the ship id when we remove it from the board
// explanation : when we put a boat on the board, then remove it and put it back both the intiial spots and the new spots are added to cellContents
function removeShipFromCellContents(shipId) {
  for (let [cell, id] of cellContents.entries()) {
    if (id === shipId) {
      cellContents.delete(cell);
    }
  }
}

function isOutOfBounds(ship, row, col) {
  if (ship.orientation === "horizontal") {
    return col + ship.size > GRID_SIZE;
  } else {
    return row + ship.size > GRID_SIZE;
  }
}

// Composant CustomDragLayer (désactiver pendant la phase de bataille)
function CustomDragLayer() {
  const { itemType, isDragging, item, currentOffset } = useDragLayer(
    (monitor) => ({
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      currentOffset: monitor.getSourceClientOffset(),
    })
  );

  // Désactiver le drag layer pendant la phase de bataille
  if (!isDragging || itemType !== "SHIP" || !currentOffset || !item) {
    return null;
  }

  const { ship } = item;

  // Calculer la position
  const style = {
    position: "fixed",
    pointerEvents: "none",
    top: currentOffset.y,
    left: currentOffset.x,
    transform: "translate(-50%, -50%)",
    zIndex: 100,
  };

  const cellSize = 50; // Taille de chaque cellule dans l'aperçu de drag
  const backgroundSize =
    ship.orientation === "horizontal"
      ? `${ship.size * cellSize}px ${cellSize}px`
      : `${cellSize}px ${ship.size * cellSize}px`;

  return (
    <div style={style}>
      <div
        className="dragging-ship-preview"
        style={{
          display: "flex",
          flexDirection: ship.orientation === "horizontal" ? "row" : "column",
          width:
            ship.orientation === "horizontal"
              ? `${ship.size * cellSize}px`
              : `${cellSize}px`,
          height:
            ship.orientation === "vertical"
              ? `${ship.size * cellSize}px`
              : `${cellSize}px`,
          backgroundImage: `url(${getShipImage(ship)})`,
          backgroundSize,
        }}
      >
        {Array(ship.size)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="dragging-ship-part"
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundPosition:
                  ship.orientation === "horizontal"
                    ? `${-index * cellSize}px 0`
                    : `0 ${-index * cellSize}px`,
              }}
            />
          ))}
      </div>
    </div>
  );
}
